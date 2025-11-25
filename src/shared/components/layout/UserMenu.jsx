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

  // display name = phần trước @
  const displayName = user?.email ? user.email.split("@")[0] : "User";

  const avatarSrc = user?.avatar;
  const initial = displayName.charAt(0).toUpperCase();

  const Item = ({ icon: Icon, label, onClick, hotkey, active = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
        ${
          active
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-800 hover:bg-slate-50"
        }`}
    >
      <span className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${
            active ? "text-emerald-700" : "text-slate-600"
          }`}
        />
        {label}
      </span>

      {hotkey && (
        <kbd className="text-[11px] text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
          {hotkey}
        </kbd>
      )}
    </button>
  );

  const ThemeItem = ({ value, label, icon }) => (
    <Item
      icon={icon}
      label={label}
      active={theme === value}
      onClick={() => {
        onChangeTheme?.(value);
        onClose?.();
      }}
    />
  );

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl p-2 z-50"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-3">
        {/* Avatar */}
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold">
            {initial}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {displayName}
          </p>
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
            onClose();
          }}
        />
        <Item
          icon={LuSettings}
          label="Cài đặt"
          onClick={() => {
            onOpenSettings?.();
            onClose();
          }}
        />
        <Item
          icon={LuKeyboard}
          label="Phím tắt"
          hotkey="?"
          onClick={() => {
            onOpenShortcuts?.();
            onClose();
          }}
        />
      </div>

      <div className="my-2 h-px bg-slate-100" />

      {/* Theme */}
      <div className="px-3 pb-1 pt-1 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
        Giao diện
      </div>

      <div className="space-y-1 px-1">
        <ThemeItem value="light" label="Sáng" icon={LuSunMedium} />
        <ThemeItem value="dark" label="Tối" icon={LuMoon} />
        <ThemeItem value="system" label="Theo hệ thống" icon={LuMonitor} />
      </div>

      <div className="my-2 h-px bg-slate-100" />

      {/* Logout */}
      <div className="px-1 pb-1">
        <Item
          icon={LuLogOut}
          label="Đăng xuất"
          onClick={() => {
            onLogout?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
