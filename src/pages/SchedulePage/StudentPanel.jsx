// src/pages/SchedulePage/StudentPanel.jsx
import { Plus, Search, User } from "lucide-react";
import DraggableStudentCard from "./DraggableStudentCard";

export default function StudentPanel({
  students,
  totalCount,
  query,
  onQueryChange,
  onOpenCreate,
}) {
  const filtered =
    students?.filter((s) => {
      const q = query.toLowerCase();
      const name = s.name.toLowerCase();
      const note = (s.note || "").toLowerCase();
      return name.includes(q) || note.includes(q);
    }) ?? [];

  const total = totalCount ?? students?.length ?? 0;

  return (
    <section
      className="
        bg-white 
        rounded-3xl
        border border-slate-200
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        flex flex-col overflow-hidden
      "
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 bg-white">
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

        {/* Search bar kiểu Notion */}
        <div className="relative mb-2">
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
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto px-4 py-4 bg-white">
        {filtered.length === 0 ? (
          <div className="mt-10 text-center text-sm text-slate-500">
            Không tìm thấy học sinh
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((student) => (
              <DraggableStudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
