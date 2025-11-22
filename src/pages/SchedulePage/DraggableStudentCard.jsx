import React from "react";
import { useDraggable } from "@dnd-kit/core";
import StudentCard from "./StudentCard";

export default function DraggableStudentCard({ student }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: student.id,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <StudentCard student={student} mode="panel" isDragging={isDragging} />
    </div>
  );
}
