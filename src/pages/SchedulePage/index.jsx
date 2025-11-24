// src/pages/SchedulePage/index.jsx
import React, { useState } from "react";
import dayjs from "dayjs";

import TopBar from "../../components/shared/TopBar";
import CalendarGrid from "./CalendarGrid";
import StudentPanel from "./StudentPanel";

import { useStudents } from "../../hooks/useStudents";
import { useWeekNavigation } from "../../hooks/useWeekNavigation";
import DndWrapper from "./DndWrapper";
import CreateStudentModal from "./CreateStudentModal";
import { useToast } from "../../components/ui/Toast";

// map màu cho block lịch, bám theo màu thẻ học sinh
const STUDENT_COLOR_TO_CLASS = {
  blue: "bg-sky-50 border-sky-200 text-sky-900",
  purple: "bg-violet-50 border-violet-200 text-violet-900",
  green: "bg-emerald-50 border-emerald-200 text-emerald-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  rose: "bg-rose-50 border-rose-200 text-rose-900",
};

export default function SchedulePage() {
  const toast = useToast();

  // quản lý học sinh
  const {
    students,
    filteredStudents,
    studentQuery,
    setStudentQuery,
    addStudent,
  } = useStudents([
    {
      id: "s-1",
      name: "Minh Nguyet",
      note: "IELTS Fundamentals",
      tag: "eng",
      color: "blue",
    },
    {
      id: "s-2",
      name: "Hà Anh",
      note: "Speaking Boost A2 → B1",
      tag: "code",
      color: "purple",
    },
    {
      id: "s-3",
      name: "Nam",
      note: "Grammar B1",
      tag: "math",
      color: "green",
    },
  ]);

  // quản lý tuần
  const { weekStart, weekLabel, prevWeek, nextWeek, todayWeek } =
    useWeekNavigation();

  // buổi học trên lịch
  const [lessons, setLessons] = useState([]);

  // modal tạo thẻ
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");

  // filter theo tag cho StudentPanel
  const [tagFilter, setTagFilter] = useState("all");

  // DnD
  const [activeId, setActiveId] = useState(null);
  const activeStudent =
    students.find((s) => String(s.id) === String(activeId)) || null;
  const activeLesson =
    lessons.find((l) => String(l.id) === String(activeId)) || null;

  // pending chọn cách xử lý khi kéo lesson pinned sang slot khác
  const [pendingPinnedMove, setPendingPinnedMove] = useState(null);

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Hãy nhập tên học sinh");
      return;
    }

    const tag = newTag || null;

    let color = "blue";
    if (tag === "eng") color = "blue";
    else if (tag === "code") color = "purple";
    else if (tag === "math") color = "green";

    addStudent({
      name: newName.trim(),
      note: newNote.trim(),
      tag,
      color,
    });

    setCreateOpen(false);
    setNewName("");
    setNewNote("");
    setNewTag("");
  };

  // xử lý drop xuống ô lịch – tạo lesson từ thẻ học sinh
  const handleDropToSlot = (event) => {
    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith("slot-")) return;

    const [, dayIndexStr, hourStr] = overId.split("-");
    const dayIndex = Number(dayIndexStr);
    const hour = Number(hourStr);

    const student = students.find((s) => String(s.id) === String(active.id));
    if (!student) return;

    const id = `lesson-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const colorClass =
      STUDENT_COLOR_TO_CLASS[student.color] ?? STUDENT_COLOR_TO_CLASS.blue;

    const slotDate = weekStart
      .add(dayIndex, "day")
      .startOf("day")
      .toISOString();

    setLessons((prev) => [
      ...prev,
      {
        id,
        studentId: student.id,
        studentName: student.name,
        note: student.note,
        hour,
        date: slotDate,
        colorClass,
        pinned: false,
      },
    ]);

    toast.success(`Đã sắp lịch cho ${student.name}`);
  };

  // move 1 lesson sang slot khác
  const moveSingleLesson = (lessonId, targetHour, targetDate, extra = {}) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              hour: targetHour,
              date: targetDate,
              ...extra,
            }
          : l
      )
    );
  };

  const handlePinLesson = (lessonId) => {
    setLessons((prev) => {
      const original = prev.find((l) => l.id === lessonId);
      if (!original || !original.date) return prev;

      const startDate = dayjs(original.date).startOf("day");
      const endDate = startDate.add(3, "month");

      // Ghim
      if (!original.pinned) {
        const newLessons = [];
        let cursor = startDate.add(1, "week");

        while (
          cursor.isBefore(endDate, "day") ||
          cursor.isSame(endDate, "day")
        ) {
          const cursorDay = cursor;

          const exists = prev.some(
            (l) =>
              l.studentId === original.studentId &&
              l.hour === original.hour &&
              l.date &&
              dayjs(l.date).isSame(cursorDay, "day")
          );

          if (!exists) {
            newLessons.push({
              ...original,
              id: `lesson-${cursor.valueOf()}-${Math.random()
                .toString(16)
                .slice(2)}`,
              date: cursor.toISOString(),
              pinned: true,
            });
          }

          cursor = cursor.add(1, "week");
        }

        const updated = prev.map((l) =>
          l.id === lessonId ? { ...l, pinned: true } : l
        );

        return [...updated, ...newLessons];
      }

      // Bỏ ghim
      const filtered = prev.filter((l) => {
        if (l.id === lessonId) return true;
        if (
          l.studentId !== original.studentId ||
          l.hour !== original.hour ||
          !l.date
        )
          return true;

        const d = dayjs(l.date).startOf("day");

        return !(
          d.isAfter(startDate, "day") &&
          (d.isBefore(endDate, "day") || d.isSame(endDate, "day"))
        );
      });

      return filtered.map((l) =>
        l.id === lessonId ? { ...l, pinned: false } : l
      );
    });
  };

  const handleDragStart = (e) => {
    setActiveId(e.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const overId = over ? String(over.id) : null;

    // thả vào thùng rác -> hủy kéo
    if (overId === "trash") {
      toast.info("Đã hủy kéo thẻ");
      setActiveId(null);
      return;
    }

    // không có target hợp lệ
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeIdStr = String(active.id);

    // KÉO LESSON TRONG LỊCH
    if (activeIdStr.startsWith("lesson-")) {
      const lesson = lessons.find((l) => String(l.id) === activeIdStr);
      if (!lesson) {
        setActiveId(null);
        return;
      }

      // chỉ quan tâm khi thả lên 1 slot
      if (!overId.startsWith("slot-")) {
        setActiveId(null);
        return;
      }

      const [, dayIndexStr, hourStr] = overId.split("-");
      const targetDayIndex = Number(dayIndexStr);
      const targetHour = Number(hourStr);

      const targetDate = weekStart
        .add(targetDayIndex, "day")
        .startOf("day")
        .toISOString();

      const sameDay =
        lesson.date && dayjs(lesson.date).isSame(targetDate, "day");
      const sameHour = lesson.hour === targetHour;
      const isSameSlot = sameDay && sameHour;

      // nếu không đổi slot thì thôi
      if (isSameSlot) {
        setActiveId(null);
        return;
      }

      // LESSON ĐANG GHIM -> CÁCH 3: HỎI NGƯỜI DÙNG
      if (lesson.pinned) {
        setPendingPinnedMove({
          lessonId: lesson.id,
          sourceLesson: lesson,
          targetHour,
          targetDate,
        });
      } else {
        // lesson thường -> move luôn
        moveSingleLesson(lesson.id, targetHour, targetDate);
      }

      setActiveId(null);
      return;
    }

    // KÉO THẺ HỌC SINH TỪ PANEL -> tạo lesson mới
    handleDropToSlot(event);
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // handler cho dialog – chỉ đổi buổi này
  const handlePinnedMoveOnlyThis = () => {
    if (!pendingPinnedMove) return;
    const { lessonId, targetHour, targetDate } = pendingPinnedMove;

    moveSingleLesson(lessonId, targetHour, targetDate, { pinned: false });
    setPendingPinnedMove(null);
    toast.success("Đã đổi lịch cho buổi này");
  };

  // handler cho dialog – đổi cả chuỗi
  const handlePinnedMoveSeries = () => {
    if (!pendingPinnedMove) return;
    const { sourceLesson, targetHour, targetDate } = pendingPinnedMove;

    const sourceDate = dayjs(sourceLesson.date).startOf("day");
    const targetDay = dayjs(targetDate).startOf("day");

    const diffDays = targetDay.diff(sourceDate, "day");
    const diffHours = targetHour - sourceLesson.hour;

    setLessons((prev) =>
      prev.map((l) => {
        // cùng chuỗi: cùng học sinh, cùng giờ gốc, pinned
        if (
          l.studentId === sourceLesson.studentId &&
          l.pinned &&
          l.date &&
          l.hour === sourceLesson.hour
        ) {
          const newDate = dayjs(l.date)
            .startOf("day")
            .add(diffDays, "day")
            .toISOString();
          return {
            ...l,
            date: newDate,
            hour: l.hour + diffHours,
          };
        }

        // đảm bảo buổi gốc cũng được cập nhật chính xác
        if (l.id === sourceLesson.id) {
          return {
            ...l,
            date: targetDate,
            hour: targetHour,
          };
        }

        return l;
      })
    );

    setPendingPinnedMove(null);
    toast.success("Đã đổi lịch cho cả chuỗi buổi học");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <div className="h-16" />

      <DndWrapper
        activeStudent={activeStudent}
        activeLesson={activeLesson}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <main className="px-6 lg:px-12 pb-10 pt-4">
          <div
            className="grid items-start gap-6"
            style={{ gridTemplateColumns: "minmax(280px,340px) 1fr" }}
          >
            <StudentPanel
              students={filteredStudents}
              totalCount={students.length}
              query={studentQuery}
              onQueryChange={setStudentQuery}
              tagFilter={tagFilter}
              onTagFilterChange={setTagFilter}
              onOpenCreate={() => setCreateOpen(true)}
            />

            <CalendarGrid
              lessons={lessons}
              weekStart={weekStart}
              weekLabel={weekLabel}
              onPrevWeek={prevWeek}
              onNextWeek={nextWeek}
              onToday={todayWeek}
              onPinLesson={handlePinLesson}
              isDragging={!!activeStudent}
            />
          </div>
        </main>

        <CreateStudentModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          newName={newName}
          setNewName={setNewName}
          newNote={newNote}
          setNewNote={setNewNote}
          newTag={newTag}
          setNewTag={setNewTag}
          onSubmit={handleCreate}
        />

        <PinnedMoveDialog
          move={pendingPinnedMove}
          onCancel={() => setPendingPinnedMove(null)}
          onOnlyThis={handlePinnedMoveOnlyThis}
          onSeries={handlePinnedMoveSeries}
        />
      </DndWrapper>
    </div>
  );
}

// dialog chọn cách xử lý khi kéo lesson pinned
function PinnedMoveDialog({ move, onCancel, onOnlyThis, onSeries }) {
  if (!move) return null;

  const { sourceLesson } = move;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-1">
            Buổi học đã ghim
          </p>
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            Di chuyển buổi học
          </h2>
          <p className="text-[11px] text-slate-600">
            Bạn vừa kéo buổi học của{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-800">
              {sourceLesson.studentName}
            </span>{" "}
            sang vị trí mới. Áp dụng cho:
          </p>
        </div>

        {/* Options */}
        <div className="px-5 py-4 space-y-2">
          <button
            type="button"
            onClick={onOnlyThis}
            className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="font-medium text-slate-900">Chỉ buổi này</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tách buổi này khỏi chuỗi ghim, trở thành buổi lẻ.
            </p>
          </button>

          <button
            type="button"
            onClick={onSeries}
            className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="font-medium">Cả chuỗi buổi đã ghim</span>
            </div>
            <p className="text-[11px] text-slate-200">
              Dời toàn bộ các buổi ghim của học sinh này sang vị trí mới.
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-1 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
