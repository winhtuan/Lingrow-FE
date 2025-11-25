// src/shared/components/layout/UserMenu.jsx
import React, { useEffect, useRef } from "react";
import {
  LuUser,
  LuSettings,
  LuKeyboard,
  LuSunMedium,
  LuMoon,
  LuMonitor,
  LuLogOut,
} from "react-icons/lu";

export default function UserMenu({
  open,
  onClose,
  anchorRef,
  user,
  theme = "system",
  onChangeTheme,
  onOpenProfile,
  onOpenSettings,
  onOpenShortcuts,
  onLogout,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const displayName = user?.fullName || user?.name || user?.email || "User";
  const displayEmail = user?.email || "";
  const initial = (displayName || "U").charAt(0).toUpperCase();

  const Item = ({ icon: Icon, label, onClick, hotkey, active = false }) => (
    <button
      onClick={onClick}
      type="button"
      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
      ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "text-slate-800 hover:bg-slate-50"
      }`}
      role="menuitem"
    >
      <span className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${
            active ? "text-emerald-700" : "text-slate-600"
          }`}
        />
        <span className="whitespace-nowrap">{label}</span>
      </span>
      {hotkey ? (
        <kbd className="text-[11px] text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
          {hotkey}
        </kbd>
      ) : null}
    </button>
  );

  const ThemeItem = ({ value, label, icon }) => (
    <Item
      icon={icon}
      label={label}
      onClick={() => {
        onChangeTheme?.(value);
        onClose?.();
      }}
      active={theme === value}
    />
  );

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Menu người dùng"
      className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl p-2 z-50"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-semibold">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {displayName}
          </p>
          {displayEmail && (
            <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
          )}
        </div>
      </div>

      <div className="my-2 h-px bg-slate-100" />

      {/* Actions */}
      <div className="space-y-1 px-1">
        <Item
          icon={LuUser}
          label="Trang cá nhân"
          onClick={() => {
            onOpenProfile?.();
            onClose?.();
          }}
        />
        <Item
          icon={LuSettings}
          label="Cài đặt"
          onClick={() => {
            onOpenSettings?.();
            onClose?.();
          }}
        />
        <Item
          icon={LuKeyboard}
          label="Phím tắt"
          hotkey="?"
          onClick={() => {
            onOpenShortcuts?.();
            onClose?.();
          }}
        />
      </div>

      <div className="my-2 h-px bg-slate-100" />

      {/* Theme section */}
      <div className="px-3 pb-1 pt-1 text-[11px] font-medium tracking-wide text-slate-400">
        GIAO DIỆN
      </div>
      <div className="space-y-1 px-1">
        <ThemeItem value="light" label="Sáng" icon={LuSunMedium} />
        <ThemeItem value="dark" label="Tối" icon={LuMoon} />
        <ThemeItem value="system" label="Theo hệ thống" icon={LuMonitor} />
      </div>

      <div className="my-2 h-px bg-slate-100" />

      {/* Logout */}
      <div className="px-1">
        <Item
          icon={LuLogOut}
          label="Đăng xuất"
          onClick={() => {
            onLogout?.();
            onClose?.();
          }}
        />
      </div>
    </div>
  );
}
