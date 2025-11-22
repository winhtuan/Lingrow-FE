import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
/**
 * StepAnimator
 * - Chuyển cảnh mượt (slide + fade + nhẹ blur + scale) khi đổi step
 * - Tự co giãn chiều cao theo nội dung (auto-height)
 * - Cải thiện: Giảm độ slide/blur để thân thiện hơn, đồng bộ thời gian transition, thêm overlap nhẹ để mượt mà
 * - Sửa: Làm chuyển động chậm hơn bằng cách tăng thời gian transition (leave: 300ms, enter: 500ms, height: 500ms)
 *
 * Props:
 *  - step: số/bất kỳ (key để biết nội dung đổi)
 *  - direction: "next" | "back"
 *  - children: function (currStep) => JSX
 */
export default function StepAnimator({ step, direction = "next", children }) {
  const containerRef = useRef(null);
  const [renderedStep, setRenderedStep] = useState(step);
  const [phase, setPhase] = useState("idle"); // "idle" | "leave" | "enter"
  const [dir, setDir] = useState(direction);
  const ghostRef = useRef(null); // đo chiều cao nội dung mới
  const prevContentRef = useRef(null); // Lưu nội dung cũ để animate leave

  // Khi step đổi → lưu nội dung cũ, animate "leave" trước rồi mới render step mới và animate "enter"
  useEffect(() => {
    if (step === renderedStep) return;
    setDir(direction);
    // Lưu nội dung cũ vào ref để lớp leave sử dụng
    prevContentRef.current = children(renderedStep);
    setPhase("leave");
    const leaveTimeout = setTimeout(() => {
      setRenderedStep(step);
      setPhase("enter");
    }, 300); // Tăng thời gian leave lên 300ms để chậm hơn

    // Sau enter hoàn tất, reset phase về idle
    const enterTimeout = setTimeout(() => {
      setPhase("idle");
    }, 300 + 500); // Thời gian leave + enter

    return () => {
      clearTimeout(leaveTimeout);
      clearTimeout(enterTimeout);
    };
  }, [step, renderedStep, direction, children]);

  // Auto-height mượt
  useLayoutEffect(() => {
    const el = containerRef.current;
    const ghost = ghostRef.current;
    if (!el || !ghost || phase === "idle") return;

    const from = el.getBoundingClientRect().height;
    const to = ghost.getBoundingClientRect().height;

    el.style.height = `${from}px`;
    // Reflow
    el.getBoundingClientRect();
    el.style.transition = "height 500ms cubic-bezier(0.4, 0, 0.2, 1)"; // Tăng thời gian height lên 500ms
    el.style.height = `${to}px`;

    const reset = () => {
      el.style.transition = "";
      el.style.height = "auto";
    };
    const timeoutId = setTimeout(reset, 520);
    return () => clearTimeout(timeoutId);
  }, [renderedStep, phase]);

  return (
    <div className="relative">
      {/* Khung auto-height */}
      <div
        ref={containerRef}
        className="min-h-[220px] relative overflow-hidden"
      >
        {/* Lớp leave (nội dung cũ) - Chỉ hiển thị khi phase === "leave" */}
        {phase === "leave" && (
          <div
            className="absolute inset-0 z-10"
            style={{
              pointerEvents: "none",
              "--x-to": dir === "next" ? "-20px" : "20px",
            }}
          >
            <div className="fadeSlideOut active">{prevContentRef.current}</div>
          </div>
        )}

        {/* Ghost đo chiều cao tương lai (ẩn) */}
        <div ref={ghostRef} className="invisible absolute -z-10">
          {children(step)}
        </div>

        {/* Lớp enter (nội dung mới) */}
        <div
          style={{ "--x-from": dir === "next" ? "20px" : "-20px" }}
          className={`relative ${
            phase === "enter"
              ? "fadeSlideIn active"
              : phase === "leave"
              ? "fadeSlideIn"
              : ""
          }`}
        >
          {children(step)}
        </div>
      </div>
    </div>
  );
}
