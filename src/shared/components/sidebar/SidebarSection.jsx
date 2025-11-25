// src/shared/components/sidebar/SidebarSection.jsx
import React from "react";

export default function SidebarSection({ collapsed, children }) {
  return (
    <div
      className={
        collapsed
          ? "my-3 mx-auto w-8 border-t border-gray-200"
          : "my-3 border-t border-gray-200"
      }
    >
      {!collapsed && <div className="mt-3 space-y-1">{children}</div>}
      {collapsed && children && null}
    </div>
  );
}
