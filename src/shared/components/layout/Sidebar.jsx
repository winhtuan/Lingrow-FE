// src/shared/components/layout/Sidebar.jsx
import React from "react";
import { LuX, LuChevronsLeft, LuChevronsRight } from "react-icons/lu";

import { NavItem } from "../sidebar/index";

/**
 * Sidebar layout dùng chung.
 *
 * Props:
 * - open, onClose, collapsed
 * - classes: danh sách lớp để hiển thị quick access
 * - menuItems: [{ key, label, icon, to }]
 * - footerItems: [{ key, label, icon, to }]
 * - activeKey / active: key đang active (ưu tiên activeKey)
 * - onToggleCollapse: hàm toggle thu gọn/mở rộng sidebar (desktop)
 */
export default function Sidebar({
  open,
  onClose,
  collapsed = false,
  classes = [],
  menuItems = [],
  footerItems = [],
  activeKey,
  active, // để backward-compatible nếu chỗ khác vẫn dùng
  onToggleCollapse,
}) {
  const width = collapsed ? "lg:w-[72px]" : "lg:w-62";
  const currentActive = activeKey ?? active ?? menuItems[0]?.key;

  return (
    <aside
      className={[
        "fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40",
        "bg-white border-r border-gray-200",
        "transition-all duration-200 overflow-hidden",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        width,
      ].join(" ")}
      aria-hidden={!open && undefined}
    >
      <nav className={collapsed ? "py-3" : "p-3 space-y-1"}>
        <NavItem
          key="__collapse"
          icon={
            collapsed ? (
              <LuChevronsRight className="w-5 h-5" />
            ) : (
              <LuChevronsLeft className="w-5 h-5" />
            )
          }
          label={collapsed ? "Mở" : "Thu gọn"}
          onClick={onToggleCollapse}
          collapsed={collapsed}
          active={false}
        />

        {/* Main menu */}
        {menuItems.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={currentActive === item.key}
            collapsed={collapsed}
          />
        ))}

        {/* Footer menu */}
        {footerItems.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={currentActive === item.key}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 p-2 rounded-full hover:bg-gray-100 lg:hidden"
        aria-label="Đóng menu"
      >
        <LuX className="w-5 h-5" />
      </button>
    </aside>
  );
}
