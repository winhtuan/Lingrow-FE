import React, { useEffect, useRef } from "react";
import { LuMessageSquare, LuInfo, LuX, LuCircleCheck } from "react-icons/lu";

/**
 * NotificationMenu — dropdown hiển thị thông báo
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - anchorRef: ref của nút chuông
 * - notifications: [{ id, type, title, desc, time }]
 */
export default function NotificationMenu({
  open,
  onClose,
  anchorRef,
  notifications = [],
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

  const IconByType = ({ type }) => {
    switch (type) {
      case "success":
        return <LuCircleCheck className="w-5 h-5 text-emerald-500" />;
      case "message":
        return <LuMessageSquare className="w-5 h-5 text-sky-500" />;
      default:
        return <LuInfo className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-2xl z-50"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <h3 className="font-semibold text-sm text-gray-800">Thông báo</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-full"
          aria-label="Đóng"
        >
          <LuX className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">
          Không có thông báo mới
        </div>
      ) : (
        <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-3 p-4 hover:bg-gray-50"
            >
              <IconByType type={n.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                {n.desc && (
                  <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                )}
                {n.time && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
