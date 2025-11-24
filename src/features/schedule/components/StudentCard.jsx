// src/features/schedule/components/StudentCard.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";

const COLOR_MAP = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    ring: "ring-blue-200",
    avatarBg: "bg-blue-100",
    avatarBorder: "border-blue-400",
    avatarRing: "ring-blue-300",
    tagBg: "bg-blue-100/80",
    tagBorder: "border-blue-200",
    tagText: "text-blue-900",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    ring: "ring-purple-200",
    avatarBg: "bg-purple-100",
    avatarBorder: "border-purple-400",
    avatarRing: "ring-purple-300",
    tagBg: "bg-purple-100/80",
    tagBorder: "border-purple-200",
    tagText: "text-purple-900",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    ring: "ring-green-200",
    avatarBg: "bg-green-100",
    avatarBorder: "border-green-400",
    avatarRing: "ring-green-300",
    tagBg: "bg-green-100/80",
    tagBorder: "border-green-200",
    tagText: "text-green-900",
  },
};

const TAG_LABELS = {
  eng: "Tiếng Anh",
  code: "Tin học",
  math: "Toán học",
};

export default function StudentCard({
  student,
  isDragging = false,
  showHandle = true,
  className = "",
  onEdit,
  onDelete,
}) {
  const colorKey =
    student?.color && COLOR_MAP[student.color] ? student.color : "blue";
  const color = COLOR_MAP[colorKey];

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const handleRef = useRef(null);

  const initials = useMemo(() => {
    if (!student?.name) return "";
    return student.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .join("");
  }, [student?.name]);

  const tagLabel =
    student?.tag && TAG_LABELS[student.tag]
      ? TAG_LABELS[student.tag]
      : student?.tag || "";

  // đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuOpen) return;

      const menuEl = menuRef.current;
      const handleEl = handleRef.current;

      // nếu click không nằm trong menu và cũng không nằm trong nút handle => đóng
      if (
        menuEl &&
        !menuEl.contains(e.target) &&
        handleEl &&
        !handleEl.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const wrapper = [
    "group relative flex items-stretch rounded-xl z-0 hover:z-20",
    "overflow-visible",
    color.bg,
    "border",
    color.border,
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

  const tagClasses = [
    "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium",
    color.tagBg,
    color.tagBorder,
    color.tagText,
  ].join(" ");

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.(student);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(student);
  };

  return (
    <div className={wrapper}>
      <div className="flex items-center gap-3 px-4 py-3 w-full relative z-10">
        <div className={avatarClasses}>
          <span className="text-[10px] font-semibold tracking-wide text-slate-700">
            {initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {student.name}
            </h3>

            {showHandle && (
              <div className="relative">
                <button
                  type="button"
                  ref={handleRef}
                  onClick={handleMenuToggle}
                  className="p-1 rounded-md text-slate-300 hover:text-slate-500 hover:bg-white/70 transition"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 w-32 rounded-xl bg-white border border-slate-100 shadow-lg py-1 text-xs z-20"
                  >
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      Sửa thẻ
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600"
                    >
                      Xoá thẻ
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {tagLabel && (
            <div className="mt-1">
              <span className={tagClasses}>{tagLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
