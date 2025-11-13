import React from "react";
import {
  LuHouse,
  LuCalendar,
  LuArchive,
  LuSettings,
  LuX,
} from "react-icons/lu";

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
          collapsed={collapsed}
        />
        <NavItem
          icon={<LuCalendar className="w-5 h-5" />}
          label="Lịch"
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

function NavItem({ icon, label, active, collapsed }) {
  if (collapsed) {
    // MINI: chỉ icon; khi active đổi nền của "nút" icon
    return (
      <button
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
      </button>
    );
  }

  // FULL: cả hàng có nền khi active + chỉ báo trái
  return (
    <button
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
    </button>
  );
}
