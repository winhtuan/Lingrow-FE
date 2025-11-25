// src/features/schedule/components/DndWrapper.jsx
import React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  DragOverlay,
} from "@dnd-kit/core";

import { snapCenterToCursor } from "@dnd-kit/modifiers";

import StudentCard from "./StudentCard";

function LessonOverlayCard({ lesson }) {
  if (!lesson) return null;

  const colorClass =
    lesson.colorClass || "bg-slate-900 text-white border border-slate-900";

  return (
    <div
      className={[
        "rounded-md text-xs px-3 py-3 pr-7 border shadow-lg",
        "min-w-[160px] max-w-[220px]",
        "flex flex-col justify-center",
        colorClass,
      ].join(" ")}
    >
      <div className="font-semibold truncate">{lesson.studentName}</div>
      {lesson.note && (
        <div className="text-[11px] opacity-80 truncate">{lesson.note}</div>
      )}
    </div>
  );
}

export default function DndWrapper({
  children,
  activeStudent,
  activeLesson,
  onDragStart,
  onDragEnd,
  onDragCancel,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}

      {/** ép overlay luôn neo chính giữa con trỏ */}
      <DragOverlay modifiers={[snapCenterToCursor]}>
        {activeStudent ? (
          <StudentCard
            student={activeStudent}
            isDragging
            showHandle={false}
            className="w-[165px] max-w-[165px] h-[60px]"
          />
        ) : activeLesson ? (
          <LessonOverlayCard lesson={activeLesson} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
