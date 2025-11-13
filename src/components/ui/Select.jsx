import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

export default function Select({
  options = [],
  placeholder = "Select...",
  value,
  onChange,
  className = "",
  align = "left", // "left" | "right"
  maxMenuHeight = 280, // px
  itemHeight = 36, // px (ước lượng, dùng để tính chiều cao menu)
}) {
  const [open, setOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );
  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        options.findIndex((o) => o.value === value)
      ),
    [options, value]
  );

  // --- Ước lượng chiều cao menu để quyết định mở lên/xuống (trước khi render menu thật)
  const estimatedMenuHeight = Math.min(
    maxMenuHeight,
    options.length * itemHeight + 8 // padding top/bottom ~8px
  );

  // --- Định vị lần đầu bằng useLayoutEffect để tránh giật
  useLayoutEffect(() => {
    if (!open) return;
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const width = r.width;

    const left =
      align === "right" ? Math.max(8, r.right - width) : Math.max(8, r.left);

    // Ưu tiên mở xuống; nếu không đủ chỗ, flip lên
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < estimatedMenuHeight + 8;

    const top = openUp ? r.top - estimatedMenuHeight - 4 : r.bottom + 4;

    setMenuStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      zIndex: 1000,
      // để browser tối ưu compositing
      willChange: "transform, top, left",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, align, estimatedMenuHeight]);

  // --- Sau khi mở ổn định, theo dõi scroll/resize & cập nhật vị trí (không còn rung)
  const updatePosition = useCallback(() => {
    if (!btnRef.current || !menuRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const width = r.width;
    const left =
      align === "right" ? Math.max(8, r.right - width) : Math.max(8, r.left);

    const menuH = Math.min(
      maxMenuHeight,
      menuRef.current.getBoundingClientRect().height || estimatedMenuHeight
    );
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < menuH + 8;
    const top = openUp ? r.top - menuH - 4 : r.bottom + 4;

    setMenuStyle((s) => ({
      ...s,
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
    }));
  }, [align, estimatedMenuHeight, maxMenuHeight]);

  useEffect(() => {
    if (!open) return;
    // cập nhật nhẹ sau khi mount để đồng bộ chiều cao thật của menu
    requestAnimationFrame(updatePosition);

    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  // Đóng khi click ngoài / ESC
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) setHoverIndex(activeIndex);
  }, [open, activeIndex]);

  // Keyboard
  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoverIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoverIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[hoverIndex];
      if (opt) {
        onChange?.(opt.value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex justify-between items-center w-full h-10 px-3 rounded-lg
                   border-2 border-slate-200 bg-slate-50 text-sm text-slate-900
                   hover:bg-slate-100 transition-all
                   focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Portal menu */}
      {open &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={menuStyle}
            className="rounded-lg border border-slate-200 bg-white shadow-2xl text-sm"
          >
            <div
              className="py-1 overflow-auto"
              style={{ maxHeight: `${maxMenuHeight}px` }}
            >
              {options.map((opt, idx) => {
                const isActive = opt.value === value;
                const isHover = idx === hoverIndex;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer transition-colors
                      ${isHover ? "bg-slate-100" : ""}
                      ${
                        isActive
                          ? "font-medium text-slate-900"
                          : "text-slate-700"
                      }`}
                    style={{ lineHeight: "1.15" }}
                  >
                    {opt.label}
                  </li>
                );
              })}
            </div>
          </ul>,
          document.body
        )}
    </div>
  );
}
