// src/features/schedule/components/StudentPanel.jsx
import React from "react";
import { Plus, Search, User } from "lucide-react";
import DraggableStudentCard from "./DraggableStudentCard";
import Select from "../../../ui/Select";

const TAG_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "eng", label: "Tiếng Anh" },
  { value: "code", label: "Tin học" },
  { value: "math", label: "Toán học" },
];

export default function StudentPanel({
  students,
  totalCount,
  query,
  onQueryChange,
  tagFilter,
  onTagFilterChange,
  onOpenCreate,
  onEditStudent,
  onDeleteStudent,
}) {
  const q = (query || "").toLowerCase().trim();

  const filtered =
    students?.filter((s) => {
      const name = (s.name || "").toLowerCase();
      const note = (s.note || "").toLowerCase();
      const tag = (s.tag || "").toLowerCase();

      const matchesSearch =
        q === "" || name.includes(q) || note.includes(q) || tag.includes(q);

      const matchesTag =
        !tagFilter ||
        tagFilter === "all" ||
        (s.tag && s.tag.toLowerCase() === tagFilter.toLowerCase());

      return matchesSearch && matchesTag;
    }) ?? [];

  const total = totalCount ?? students?.length ?? 0;

  return (
    <section
      className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        flex flex-col
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 bg-transparent">
        <div className="flex items-center justify-between mb-3 pt-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-500" />
              Thẻ học sinh
            </h2>
            <p className="text-xs text-slate-500 mt-1">Kéo để xếp lịch học</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200">
              {filtered.length}/{total}
            </span>

            <button
              onClick={onOpenCreate}
              className="
                w-8 h-8 flex items-center justify-center
                rounded-full bg-white border border-slate-200
                hover:bg-slate-100 shadow-sm transition
              "
            >
              <Plus className="w-4 h-4 text-slate-800" />
            </button>
          </div>
        </div>

        {/* Search + Tag filter */}
        <div className="flex items-center gap-2 mb-2">
          {/* Search bên trái, chiếm rộng */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Tìm kiếm học sinh..."
              className="
        w-full rounded-xl
        border border-slate-200
        bg-white
        pl-10 pr-4 py-2.5
        text-sm text-slate-900
        placeholder:text-slate-400
        outline-none
        focus:ring-2 focus:ring-slate-200 focus:border-slate-300
        transition
      "
            />
          </div>

          {/* Dropdown Tag bên phải */}
          <div className="shrink-0 w-[120px]">
            <Select
              options={TAG_OPTIONS}
              value={tagFilter}
              onChange={onTagFilterChange}
              placeholder="Tag"
              align="right"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className="
          flex-1 px-4 py-4 bg-transparent
          overflow-auto 
          max-h-[545px]
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {filtered.length === 0 ? (
          <div className="mt-10 text-center text-sm text-slate-500">
            Không tìm thấy học sinh
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((student) => (
              <DraggableStudentCard
                key={student.id}
                student={student}
                onEdit={onEditStudent}
                onDelete={onDeleteStudent}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
