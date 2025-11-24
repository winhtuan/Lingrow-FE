// src/features/classroom/components/controls/SortSelect.jsx
import React from "react";

export default function SortSelect({ value, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-gray-500">Sắp xếp</span>
      <select
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="newest">Mới nhất</option>
        <option value="az">A → Z</option>
        <option value="teacher">Theo giáo viên</option>
      </select>
    </label>
  );
}
