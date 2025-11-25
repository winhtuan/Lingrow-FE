// src/features/schedule/components/StudentCard.jsx
import React, { useMemo, useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Menu from "../../../ui/Menu";

const COLOR_MAP = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
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
    <div
      className={[
        "group relative flex items-stretch rounded-xl",
        "overflow-visible z-0 hover:z-20",
        color.bg,
        "border",
        color.border,
        "shadow-sm transition-all duration-150",
        isDragging
          ? "opacity-60 cursor-grabbing"
          : "cursor-grab hover:shadow-md hover:-translate-y-[1px]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3 px-4 py-3 w-full relative z-10">
        <div
          className={[
            "flex items-center justify-center w-9 h-9 rounded-full",
            color.avatarBg,
            "border",
            color.avatarBorder,
            "ring-2",
            color.avatarRing,
            "shadow-sm flex-shrink-0",
          ].join(" ")}
        >
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
                  className="inline-flex items-center justify-center w-7 h-7
                             rounded-full bg-white/80 shadow-sm ring-1 ring-slate-200
                             text-slate-800 hover:text-white hover:bg-slate-900 transition"
                >
                  <HiDotsVertical />
                </button>

                {/* Menu đặt ngay dưới, thẳng hàng nút */}
                <Menu
                  open={menuOpen}
                  buttonRef={handleRef}
                  onClose={() => setMenuOpen(false)}
                  width={140}
                  offsetY={8}
                  offsetX={-20}
                >
                  {/* Sửa thẻ → pastel trung tính */}
                  <button
                    onClick={handleEditClick}
                    className="
                      w-full flex items-center px-3 h-8 rounded-xl
                      text-slate-700 bg-slate-50/50
                      hover:bg-slate-100 transition
                    "
                  >
                    Sửa thẻ
                  </button>

                  {/* Xoá lịch → pastel amber */}
                  <button
                    onClick={handleDeleteClick}
                    className="
                      w-full flex items-center px-3 h-8 rounded-xl
                      text-slate-700 bg-slate-50/50
                      hover:bg-sky-100 transition
                    "
                  >
                    Xoá lịch
                  </button>

                  {/* Xoá thẻ → pastel rose */}
                  <button
                    onClick={handleDeleteClick}
                    className="
                      w-full flex items-center px-3 h-8 rounded-xl
                      text-slate-700 bg-slate-50/50
                      hover:bg-rose-100 transition
                    "
                  >
                    Xoá thẻ
                  </button>
                </Menu>
              </div>
            )}
          </div>

          {tagLabel && (
            <div className="mt-1">
              <span
                className={[
                  "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium",
                  color.tagBg,
                  color.tagBorder,
                  color.tagText,
                ].join(" ")}
              >
                {tagLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
