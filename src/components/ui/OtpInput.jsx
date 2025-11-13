import React, { useRef } from "react";

export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete, // optional
  autoFocusFirst = true,
}) {
  const inputs = useRef([]);

  const vals = Array.from({ length }, (_, i) => value?.[i] ?? "");
  const setCombined = (arr) => {
    const v = arr.join("").replace(/\s/g, "");
    onChange(v);
    if (onComplete && v.length === length) onComplete(v);
  };

  // double RAF đảm bảo focus sau khi React re-render xong
  const defer = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));
  const focusIndex = (i) => defer(() => inputs.current[i]?.focus());

  const handleChange = (i, e) => {
    const raw = e.target.value;
    const ch = (raw.match(/\d/g) || []).pop() || ""; // lấy số cuối
    const next = [...vals];
    next[i] = ch;
    setCombined(next);
    if (ch && i < length - 1) focusIndex(i + 1);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...vals];
      if (next[i]) {
        next[i] = "";
        setCombined(next);
      } else if (i > 0) {
        next[i - 1] = "";
        setCombined(next);
        focusIndex(i - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusIndex(i - 1);
      return;
    }
    if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault();
      focusIndex(i + 1);
      return;
    }
    // chặn ký tự không phải số
    if (e.key.length === 1 && !/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (i, e) => {
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!text) return;
    e.preventDefault();
    const next = [...vals];
    for (let k = 0; k < text.length && i + k < length; k++)
      next[i + k] = text[k];
    setCombined(next);
    const last = Math.min(i + text.length, length - 1);
    focusIndex(last);
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          value={vals[idx]}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={(e) => handlePaste(idx, e)}
          onFocus={(e) => e.target.select()}
          type="tel"
          inputMode="numeric"
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          name={`otp-${idx}`}
          maxLength={1}
          className="w-12 h-12 text-center text-lg font-semibold rounded-lg
                     bg-slate-50 border-2 border-slate-200
                     focus:outline-none focus:border-slate-900
                     transition-colors duration-200"
          {...(autoFocusFirst && idx === 0 && !vals[0]
            ? { autoFocus: true }
            : {})}
        />
      ))}
    </div>
  );
}
