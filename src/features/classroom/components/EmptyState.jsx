// src/features/classroom/components/EmptyState.jsx
import React from "react";
import { LuSmile } from "react-icons/lu";

export default function EmptyState({ onClear, onCreate }) {
  return (
    <div className="text-center py-20">
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 grid place-items-center mb-4">
        <LuSmile className="text-emerald-600 w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold mb-1">Không tìm thấy lớp học</h3>
      <p className="text-gray-500 mb-5">
        Hãy thử từ khóa khác hoặc tạo lớp mới.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
        >
          Xóa tìm kiếm
        </button>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Tạo lớp mới
        </button>
      </div>
    </div>
  );
}
