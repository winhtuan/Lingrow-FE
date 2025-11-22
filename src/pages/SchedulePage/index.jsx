// src/pages/SchedulePage/index.jsx
import React, { useState, useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import dayjs from "dayjs";

import TopBar from "../../components/shared/TopBar";

import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import TextField from "../../components/ui/TextField";
import { useToast } from "../../components/ui/Toast";

import StudentPanel from "./StudentPanel";
import CalendarGrid from "./CalendarGrid";
import StudentCard from "./StudentCard";

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

  const [students, setStudents] = useState([
    {
      id: "s-1",
      name: "Minh Nguyet",
      note: "IELTS Fundamentals",
      color: "blue",
    },
    {
      id: "s-2",
      name: "Hà Anh",
      note: "Speaking Boost A2 → B1",
      color: "amber",
    },
    { id: "s-3", name: "Nam", note: "Grammar B1", color: "green" },
  ]);

  const [lessons, setLessons] = useState([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newColor, setNewColor] = useState("blue");

  const [activeId, setActiveId] = useState(null);
  const [studentQuery, setStudentQuery] = useState("");

  // tuần hiện tại: bắt đầu từ thứ hai
  const [weekStart, setWeekStart] = useState(
    dayjs().startOf("week").add(1, "day")
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  const activeStudent = useMemo(
    () => students.find((s) => s.id === activeId) || null,
    [activeId, students]
  );

  const weekLabel = useMemo(() => {
    const end = weekStart.add(6, "day");
    return `${weekStart.format("DD/MM")} – ${end.format("DD/MM/YYYY")}`;
  }, [weekStart]);

  const filteredStudents = useMemo(
    () =>
      students.filter((s) =>
        `${s.name} ${s.note ?? ""}`
          .toLowerCase()
          .includes(studentQuery.toLowerCase())
      ),
    [students, studentQuery]
  );

  const handleCreateStudent = () => {
    if (!newName.trim()) {
      toast.error("Hãy nhập tên học sinh");
      return;
    }

    setStudents((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        name: newName.trim(),
        note: newNote.trim(),
        tag: newTag || null,
        color: newColor || "blue",
      },
    ]);

    setNewName("");
    setNewNote("");
    setNewTag("");
    setNewColor("blue");
    setCreateOpen(false);
    toast.success("Đã tạo thẻ học sinh");
  };

  const handleDropToSlot = (event) => {
    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith("slot-")) return;

    const [, dayIndexStr, hourStr] = overId.split("-");
    const dayIndex = Number(dayIndexStr);
    const hour = Number(hourStr);

    const student = students.find((s) => s.id === active.id);
    if (!student) return;

    const id = `lesson-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    // lấy màu từ student.color, fallback blue
    const colorClass =
      STUDENT_COLOR_TO_CLASS[student.color] ?? STUDENT_COLOR_TO_CLASS.blue;

    setLessons((prev) => [
      ...prev,
      {
        id,
        studentId: student.id,
        studentName: student.name,
        note: student.note,
        dayIndex,
        hour,
        colorClass,
      },
    ]);

    toast.success(`Đã sắp lịch cho ${student.name}`);
  };

  const handlePrevWeek = () => setWeekStart((prev) => prev.subtract(1, "week"));
  const handleNextWeek = () => setWeekStart((prev) => prev.add(1, "week"));
  const handleTodayWeek = () =>
    setWeekStart(dayjs().startOf("week").add(1, "day"));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TopBar fixed, nằm ngoài flow */}
      <TopBar />
      {/* Spacer cao đúng bằng TopBar để đẩy nội dung xuống dưới */}
      <div className="h-16" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        modifiers={[snapCenterToCursor]}
        onDragStart={(e) => setActiveId(e.active.id)}
        onDragEnd={(e) => {
          handleDropToSlot(e);
          setActiveId(null);
        }}
        onDragCancel={() => setActiveId(null)}
      >
        <main className="px-6 lg:px-12 pb-10 pt-4">
          {/* Header trang */}
          <div className="gap-4 mb-6"></div>

          {/* StudentPanel bên trái – CalendarGrid bên phải */}
          <div
            className="grid items-start gap-6"
            style={{
              gridTemplateColumns: "minmax(280px, 340px) minmax(0, 1fr)",
            }}
          >
            <StudentPanel
              students={filteredStudents}
              totalCount={students.length}
              query={studentQuery}
              onQueryChange={setStudentQuery}
              onOpenCreate={() => setCreateOpen(true)}
            />

            <CalendarGrid
              lessons={lessons}
              weekStart={weekStart}
              weekLabel={weekLabel}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToday={handleTodayWeek}
            />
          </div>
        </main>

        <Modal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Tạo thẻ học sinh"
          widthClass="max-w-lg"
        >
          <div className="space-y-4">
            <TextField
              id="student-name"
              label="Tên học sinh"
              value={newName}
              onChange={setNewName}
              placeholder="Nhập tên học sinh"
            />
            <TextField
              id="student-note"
              label="Ghi chú"
              value={newNote}
              onChange={setNewNote}
              placeholder="VD: IELTS,..."
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tag
                </label>
                <Select
                  value={newTag}
                  onChange={setNewTag}
                  placeholder="Chọn tag"
                  options={[
                    { value: "eng", label: "Tiếng Anh" },
                    { value: "code", label: "Tin Học" },
                    { value: "math", label: "Toán Học" },
                  ]}
                  align="left"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Màu
                </label>
                <Select
                  value={newColor}
                  onChange={setNewColor}
                  placeholder="Chọn màu"
                  options={[
                    { value: "blue", label: "Xanh dương" },
                    { value: "purple", label: "Tím" },
                    { value: "green", label: "Xanh lá" },
                    { value: "amber", label: "Vàng" },
                    { value: "rose", label: "Hồng" },
                  ]}
                  align="right"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
                className="text-sm"
              >
                Hủy
              </Button>
              <Button onClick={handleCreateStudent} className="text-sm">
                Lưu thẻ
              </Button>
            </div>
          </div>
        </Modal>

        <DragOverlay>
          {activeStudent ? (
            <StudentCard student={activeStudent} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
