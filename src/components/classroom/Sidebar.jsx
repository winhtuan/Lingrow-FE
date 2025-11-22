import React from "react";
import {
  LuHouse,
  LuCalendar,
  LuArchive,
  LuSettings,
  LuX,
} from "react-icons/lu";
import NavItem from "./NavItem";

export default function Sidebar({
  open,
  onClose,
  collapsed = false,
  classes = [],
  active = "home",
}) {
  const baseDesktopWidth = collapsed ? "lg:w-[72px]" : "lg:w-72";

  return (
    <aside
      className={[
        "fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40",
        "bg-white border-r border-gray-200",
        "transition-all duration-200 ease-out overflow-hidden",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        baseDesktopWidth,
      ].join(" ")}
      aria-hidden={!open && undefined}
    >
      <nav
        className={`h-full overflow-y-auto ${
          collapsed ? "py-3" : "p-3 space-y-1"
        }`}
      >
        <NavItem
          icon={<LuHouse className="w-5 h-5" />}
          label="Lớp học"
          active={active === "home"}
          to="/"
          collapsed={collapsed}
        />
        <NavItem
          icon={<LuCalendar className="w-5 h-5" />}
          label="Lịch"
          to="/schedule"
          active={active === "calendar"}
          collapsed={collapsed}
        />

        {!collapsed ? (
          <>
            <div className="my-3 border-t border-gray-200" />
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase">
              Đã dạy
            </p>
          </>
        ) : (
          <div className="my-3 mx-auto w-8 border-t border-gray-200" />
        )}

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

        {!collapsed ? (
          <div className="my-3 border-t border-gray-200" />
        ) : (
          <div className="my-3 mx-auto w-8 border-t border-gray-200" />
        )}

        <NavItem
          icon={<LuArchive className="w-5 h-5" />}
          label="Lớp đã lưu trữ"
          active={active === "archive"}
          collapsed={collapsed}
        />
        <NavItem
          icon={<LuSettings className="w-5 h-5" />}
          label="Cài đặt"
          active={active === "settings"}
          collapsed={collapsed}
        />
      </nav>

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
