// src/pages/SchedulePage/DndWrapper.jsx
import React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import StudentCard from "./StudentCard";

export default function DndWrapper({
  children,
  activeStudent,
  onDragStart,
  onDragEnd,
  onDragCancel,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[snapCenterToCursor]}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}

      <DragOverlay>
        {activeStudent ? (
          <StudentCard
            student={activeStudent}
            isDragging
            showHandle={false}
            // thẻ nhỏ ngang 1 ô lịch
            className="w-[165px] max-w-[165px] h-[60px]"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
