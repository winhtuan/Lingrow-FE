// src/components/TopBar.jsx
import React, { useRef, useState } from "react";
import {
  LuMenu,
  LuBook,
  LuPlus,
  LuBell,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import UserMenu from "./UserMenu";
import NotificationMenu from "./NotificationMenu";

export default function TopBar({
  sidebarOpen,
  onToggleSidebar,
  sidebarCollapsed,
  onToggleCollapse,
  query,
  onQuery,
  onOpenCreate,
  searchRef,
  onOpenProfile,
  onOpenSettings,
  onOpenShortcuts,
  onLogout,
  theme = "system",
  onChangeTheme,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useAuth(); // lấy user từ context

  const notifications = [
    {
      id: 1,
      type: "message",
      title: "Giáo viên Hà Anh đã đăng bài mới",
      desc: "Lớp Speaking Boost A2→B1 có tài liệu mới.",
      time: "3 phút trước",
    },
    {
      id: 2,
      type: "success",
      title: "Bạn được thêm vào lớp Business English Pro",
      desc: "Giảng viên: Minh Nguyệt",
      time: "1 giờ trước",
    },
  ];

  const displayName = user?.fullName || user?.name || user?.email || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-white/80 backdrop-blur border-b border-gray-200 z-50">
      <div className="h-full px-4 flex items-center gap-4 justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
            aria-label={sidebarOpen ? "Đóng menu" : "Mở menu"}
          >
            <LuMenu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={
              sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"
            }
            title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {sidebarCollapsed ? (
              <LuChevronRight className="w-5 h-5 text-gray-700" />
            ) : (
              <LuChevronLeft className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 grid place-items-center shadow-sm">
              <LuBook className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg text-gray-800 font-semibold hidden sm:block">
              English Class
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreate}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Tạo lớp (phím N)"
            data-hotkey="n"
          >
            <LuPlus className="w-5 h-5 text-gray-700" />
          </button>

          <div className="relative">
            <button
              ref={bellRef}
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Thông báo"
            >
              <LuBell className="w-5 h-5 text-gray-700" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>
            <NotificationMenu
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              anchorRef={bellRef}
              notifications={notifications}
            />
          </div>

          {/* Nếu chưa login -> hiện nút Sign in */}
          {!user && (
            <Button
              onClick={() => navigate("/signin")}
              variant="outline"
              size="sm"
              className="rounded-full px-6"
            >
              Sign in
            </Button>
          )}

          {/* Nếu đã login -> hiện avatar + UserMenu */}
          {user && (
            <div className="relative ml-1">
              <button
                ref={avatarRef}
                onClick={() => setMenuOpen((v) => !v)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 grid place-items-center text-white text-sm font-medium cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-1"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Mở menu người dùng"
              >
                {avatarLetter}
              </button>

              <UserMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                anchorRef={avatarRef}
                user={user}
                theme={theme}
                onChangeTheme={onChangeTheme}
                onOpenProfile={onOpenProfile}
                onOpenSettings={onOpenSettings}
                onOpenShortcuts={onOpenShortcuts}
                onLogout={onLogout}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
