// src/features/classroom/components/NavItem.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NavItem({ icon, label, active, collapsed, to = "#" }) {
  // MINI SIDEBAR
  if (collapsed) {
    return (
      <Link
        to={to}
        title={label}
        aria-label={label}
        className="w-full flex items-center justify-center py-2.5"
      >
        <span
          className={[
            "inline-grid place-items-center w-9 h-9 rounded-lg transition-colors",
            active
              ? "bg-emerald-100 text-black-700 ring-1 ring-emerald-200"
              : "text-gray-700 hover:bg-gray-100",
          ].join(" ")}
        >
          {icon}
        </span>
      </Link>
    );
  }

  // FULL SIDEBAR
  return (
    <Link
      to={to}
      className={[
        "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-gray-700 hover:bg-gray-100",
      ].join(" ")}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-emerald-500 rounded-r" />
      )}

      <span
        className={[
          "inline-grid place-items-center w-8 h-8 rounded-md",
          active ? "bg-emerald-100 text-emerald-700" : "",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
