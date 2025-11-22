// src/pages/SchedulePage/StudentCard.jsx
import React, { useMemo } from "react";
import { Book, GripVertical } from "lucide-react";

const COLOR_MAP = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "bg-blue-500",
    ring: "ring-blue-200",
    avatarBg: "bg-blue-100",
    avatarBorder: "border-blue-400",
    avatarRing: "ring-blue-300",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "bg-purple-500",
    ring: "ring-purple-200",
    avatarBg: "bg-purple-100",
    avatarBorder: "border-purple-400",
    avatarRing: "ring-purple-300",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "bg-green-500",
    ring: "ring-green-200",
    avatarBg: "bg-green-100",
    avatarBorder: "border-green-400",
    avatarRing: "ring-green-300",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "bg-amber-500",
    ring: "ring-amber-200",
    avatarBg: "bg-amber-100",
    avatarBorder: "border-amber-400",
    avatarRing: "ring-amber-300",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "bg-rose-500",
    ring: "ring-rose-200",
    avatarBg: "bg-rose-100",
    avatarBorder: "border-rose-400",
    avatarRing: "ring-rose-300",
  },
};

export default function StudentCard({
  student,
  isDragging = false,
  showHandle = true,
  className = "",
}) {
  // CHỈ lấy theo student.color, nếu không có thì fallback "blue"
  const colorKey =
    student?.color && COLOR_MAP[student.color] ? student.color : "blue";
  const color = COLOR_MAP[colorKey];

  const initials = useMemo(() => {
    if (!student?.name) return "";
    return student.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .join("");
  }, [student?.name]);

  const courseText = student.course || student.note;

  const wrapper = [
    "group relative flex items-stretch rounded-xl",
    color.bg, // pastel gia sư chọn
    "border",
    color.border, // viền đậm hơn pastel 100
    "shadow-sm",
    "transition-all duration-150",
    isDragging
      ? "opacity-60 cursor-grabbing"
      : "cursor-grab hover:shadow-md hover:-translate-y-[1px]",
    className,
  ].join(" ");

  const avatarClasses = [
    "flex items-center justify-center w-9 h-9",
    "rounded-full",
    color.avatarBg || "bg-white",
    "border",
    color.avatarBorder || "border-slate-200",
    "ring-2",
    color.avatarRing || color.ring || "",
    "shadow-sm flex-shrink-0",
  ].join(" ");

  return (
    <div className={wrapper}>
      {/* thanh bar accent nhỏ bên trái */}
      <div
        className={`absolute left-2 top-2 bottom-2 w-1 rounded-full ${color.accent}`}
      />

      <div className="flex items-center gap-3 px-4 py-3 w-full relative z-10">
        {/* Avatar đậm hơn màu nền */}
        <div className={avatarClasses}>
          <span className="text-[10px] font-semibold tracking-wide text-slate-700">
            {initials}
          </span>
        </div>

        {/* Nội dung */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {student.name}
            </h3>

            {showHandle && (
              <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-slate-400 transition" />
            )}
          </div>

          {courseText && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
              <Book className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{courseText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
