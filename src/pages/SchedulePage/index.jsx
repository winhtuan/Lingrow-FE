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

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Hãy nhập tên học sinh");
      return;
    }

    const tag = newTag || null;

    // map màu theo tag
    let color = "blue"; // default
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

  // xử lý drop xuống ô lịch
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

    // ngày thực tế của buổi học trong tuần hiện tại
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
        if (!l.pinned) return true;
        if (l.id === lessonId) return true;

        const d = dayjs(l.date).startOf("day");
        return !(
          l.studentId === original.studentId &&
          l.hour === original.hour &&
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

  const handleDragEnd = (e) => {
    handleDropToSlot(e);
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <div className="h-16" />

      <DndWrapper
        activeStudent={activeStudent}
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
      </DndWrapper>
    </div>
  );
}
