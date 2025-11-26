// src/shared/components/sidebar/NavItem.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NavItem({
  icon,
  label,
  active,
  collapsed,
  to = "#",
  onClick,
}) {
  // Nếu có onClick → dùng button thay vì Link
  const Component = onClick ? "button" : Link;
  const baseProps = onClick ? { onClick, type: "button" } : { to };

  // Màu sắc chuẩn hoá xám
  const activeClasses = "bg-gray-100 text-gray-900";
  const inactiveClasses = "text-gray-700 hover:bg-gray-100";

  // MINI SIDEBAR (collapsed)
  if (collapsed) {
    return (
      <Component
        {...baseProps}
        title={label}
        aria-label={label}
        className="w-full flex items-center justify-center py-2.5"
      >
        <span
          className={[
            "inline-grid place-items-center w-9 h-9 rounded-lg transition-colors",
            active ? activeClasses : inactiveClasses,
          ].join(" ")}
        >
          {icon}
        </span>
      </Component>
    );
  }

  // FULL SIDEBAR
  return (
    <Component
      {...baseProps}
      className={[
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        active ? activeClasses : inactiveClasses,
      ].join(" ")}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Component>
  );
}
