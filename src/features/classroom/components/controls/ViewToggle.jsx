// src/features/classroom/components/controls/ViewToggle.jsx
import React from "react";
import { LuLayoutGrid, LuList } from "react-icons/lu";

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => onChange("grid")}
        className={`px-3 py-2 text-sm flex items-center gap-1 ${
          value === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
        }`}
        aria-pressed={value === "grid"}
      >
        <LuLayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`px-3 py-2 text-sm flex items-center gap-1 ${
          value === "list" ? "bg-gray-100" : "hover:bg-gray-50"
        }`}
        aria-pressed={value === "list"}
      >
        <LuList className="w-5 h-5" />
      </button>
    </div>
  );
}
