// src/ui/Menu.jsx
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Menu({
  buttonRef,
  open,
  onClose,
  children,
  width = 100, // chiều rộng menu
  offsetY = 4, // khoảng cách từ nút xuống menu
}) {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({});

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;

    const btn = buttonRef.current.getBoundingClientRect();
    const menuWidth = width;

    // Căn cạnh trái của menu với button, sau đó lệch sang trái thêm 20px
    const left = btn.left;

    const top = btn.bottom + offsetY;

    setStyle({
      position: "fixed",
      top,
      left,
      width: menuWidth,
      zIndex: 20000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, width, offsetY]);

  // click ngoài
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };

    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={style}
      className="
        rounded-2xl
        bg-white
        border border-slate-200
        shadow-[0_12px_32px_rgba(0,0,0,0.08)]
        py-1
        text-[13px]
      "
    >
      <div className="flex flex-col gap-0.5 px-1.5">{children}</div>
    </div>,
    document.body
  );
}
