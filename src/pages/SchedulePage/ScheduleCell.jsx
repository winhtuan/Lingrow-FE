import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function ScheduleCell({ dayIndex, hour, lessons, isAltRow }) {
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

        return (
          <div
            key={lesson.id}
            className={[
              "rounded-md text-xs px-2 py-3 shadow-sm border transition-all duration-150",
              colorClass,
            ].join(" ")}
          >
            <div className="font-semibold truncate">{lesson.studentName}</div>
            {lesson.note && (
              <div className="text-[11px] opacity-80 truncate">
                {lesson.note}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
