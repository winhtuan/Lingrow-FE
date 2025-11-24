// src/features/schedule/components/ScheduleCell.jsx
import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Pin } from "lucide-react";

function LessonDraggable({ lesson, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lesson.id,
  });

  const style = {
    // rất quan trọng: ẩn card gốc khi đang kéo,
    // để chỉ còn overlay nhìn, không bị cắt giữa 2 hàng
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function ScheduleCell({
  dayIndex,
  hour,
  lessons,
  isAltRow,
  onPinLesson,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${dayIndex}-${hour}`,
  });

  const baseBg = isAltRow ? "bg-slate-50/40" : "bg-white";
  const bgClass = isOver
    ? "bg-sky-50 outline outline-2 outline-sky-200"
    : baseBg;

  return (
    <div
      ref={setNodeRef}
      className={`relative border-t border-slate-100 border-r min-h-[64px] px-1.5 py-1 transition-colors duration-150 ${bgClass}`}
    >
      {lessons.map((lesson) => {
        const colorClass =
          lesson.colorClass ||
          "bg-slate-900 text-white border border-slate-900";

        const pinned = lesson.pinned;

        return (
          <LessonDraggable key={lesson.id} lesson={lesson}>
            <div
              className={[
                "relative rounded-md text-xs px-2 py-3 pr-7 shadow-sm border",
                "transition-all duration-150",
                "min-h-[56px] flex flex-col justify-center",
                colorClass,
                pinned ? "ring-1 ring-slate-900/20" : "",
              ].join(" ")}
            >
              <div className="font-semibold truncate">{lesson.studentName}</div>
              {lesson.note && (
                <div className="text-[11px] opacity-80 truncate">
                  {lesson.note}
                </div>
              )}

              <button
                type="button"
                onClick={() => onPinLesson?.(lesson.id)}
                className={[
                  "absolute top-1.5 right-1.5 inline-flex items-center justify-center",
                  "w-5 h-5 rounded-full bg-white/90 text-slate-500",
                  "hover:bg-white hover:text-slate-700 shadow-sm",
                ].join(" ")}
              >
                <Pin
                  className={[
                    "w-3 h-3",
                    pinned ? "fill-rose-600 text-rose-400" : "",
                  ].join(" ")}
                />
              </button>
            </div>
          </LessonDraggable>
        );
      })}
    </div>
  );
}
