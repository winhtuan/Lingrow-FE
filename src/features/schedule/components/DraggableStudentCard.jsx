// src/features/schedule/components/DraggableStudentCard.jsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import StudentCard from "./StudentCard";

export default function DraggableStudentCard({ student, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: student.id,
    });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <StudentCard
        student={student}
        isDragging={isDragging}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
