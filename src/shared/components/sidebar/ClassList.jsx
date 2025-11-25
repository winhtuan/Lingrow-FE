// src/shared/components/sidebar/ClassList.jsx
import React from "react";

export default function ClassList({ classes = [], collapsed }) {
  return (
    <div className={collapsed ? "py-2" : "space-y-1"}>
      {classes.slice(0, 4).map((cls) =>
        collapsed ? (
          <button
            key={cls.id}
            title={cls.title}
            className="w-full flex items-center justify-center py-3"
          >
            <div
              className="w-6 h-6 rounded-full grid place-items-center text-white text-[10px] font-semibold"
              style={{ background: cls.bgPattern }}
            >
              {cls.initials}
            </div>
          </button>
        ) : (
          <button
            key={cls.id}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <div
              className="w-6 h-6 rounded-full grid place-items-center text-white text-[10px] font-semibold"
              style={{ background: cls.bgPattern }}
            >
              {cls.initials}
            </div>
            <span className="text-sm truncate">{cls.title}</span>
          </button>
        )
      )}
    </div>
  );
}
