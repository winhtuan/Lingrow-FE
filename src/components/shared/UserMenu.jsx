// src/components/UserMenu.jsx
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

  const Item = ({ icon: Icon, label, onClick, hotkey, active = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50"
      }`}
      role="menuitem"
    >
      <span className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${active ? "text-emerald-700" : "text-gray-700"}`}
        />
        <span className="text-gray-800">{label}</span>
      </span>
      {hotkey ? (
        <kbd className="text-[11px] text-gray-500 border border-gray-200 rounded px-1 py-0.5">
          {hotkey}
        </kbd>
      ) : null}
    </button>
  );

  const ThemeItem = ({ value, label, icon: Icon }) => (
    <Item
      icon={Icon}
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
      className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-2xl p-2 z-50"
    >
      {/* Header */}
      <div className="px-3 py-2">
        <p className="text-sm font-semibold text-gray-900">{displayName}</p>
        {displayEmail && (
          <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
        )}
      </div>
      <div className="my-2 h-px bg-gray-100" />

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

      <div className="my-2 h-px bg-gray-100" />

      <div className="px-3 pb-1 pt-1 text-[11px] uppercase tracking-wide text-gray-400">
        Giao diện
      </div>
      <ThemeItem value="light" label="Sáng" icon={LuSunMedium} />
      <ThemeItem value="dark" label="Tối" icon={LuMoon} />
      <ThemeItem value="system" label="Theo hệ thống" icon={LuMonitor} />

      <div className="my-2 h-px bg-gray-100" />

      <Item
        icon={LuLogOut}
        label="Đăng xuất"
        onClick={() => {
          onLogout?.();
          onClose?.();
        }}
      />
    </div>
  );
}
