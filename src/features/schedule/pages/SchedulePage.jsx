// src/features/schedule/pages/SchedulePage.jsx
import React, { useState } from "react";

import CalendarGrid from "../components/CalendarGrid";
import StudentPanel from "../components/StudentPanel";
import DndWrapper from "../components/DndWrapper";
import CreateStudentModal from "../components/CreateStudentModal";
import PinnedMoveDialog from "../components/PinnedMoveDialog";

import TopBar from "../../../shared/components/layout/TopBar";
import { useStudents } from "../../../shared/hooks/useStudents";
import { useWeekNavigation } from "../hooks/useWeekNavigation";
import { useToast } from "../../../ui/Toast";

import { useLessonsState } from "../hooks/useLessonsState";
import { usePinnedMove } from "../hooks/usePinnedMove";
import { useScheduleDnd } from "../hooks/useScheduleDnd";

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

  // filter theo tag cho StudentPanel
  const [tagFilter, setTagFilter] = useState("all");

  // modal tạo thẻ
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");

  // state + thao tác trên lessons
  const {
    lessons,
    createLessonFromStudentSlot,
    moveSingleLesson,
    togglePinLesson,
    movePinnedSeries,
  } = useLessonsState({ students, weekStart, toast });

  // quản lý dialog buổi đã ghim
  const {
    pendingPinnedMove,
    requestPinnedMove,
    handlePinnedMoveOnlyThis,
    handlePinnedMoveSeries,
    cancelPinnedMove,
  } = usePinnedMove({
    moveSingleLesson,
    movePinnedSeries,
    toast,
  });

  // quản lý DnD
  const {
    activeStudent,
    activeLesson,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useScheduleDnd({
    students,
    weekStart,
    lessons,
    createLessonFromStudentSlot,
    moveSingleLesson,
    requestPinnedMove,
    toast,
  });

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
              onPinLesson={togglePinLesson}
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
          onCancel={cancelPinnedMove}
          onOnlyThis={handlePinnedMoveOnlyThis}
          onSeries={handlePinnedMoveSeries}
        />
      </DndWrapper>
    </div>
  );
}
