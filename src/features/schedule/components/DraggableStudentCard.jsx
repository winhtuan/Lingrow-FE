// src/features/schedule/components/DraggableStudentCard.jsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import StudentCard from "./StudentCard";

export default function DraggableStudentCard({ student, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: student.id,
  });

  const style = {
    // Ẩn thẻ gốc khi đang kéo, để chỉ còn DragOverlay
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
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
