// src/ui/PasswordStrength.jsx
import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export function StrengthBar({ score = 0 }) {
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded ${
              i < score ? "bg-green-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Requirement({ ok, children }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      ) : (
        <Circle className="w-4 h-4 text-slate-300" />
      )}
      <span className={ok ? "text-slate-700" : "text-slate-400"}>
        {children}
      </span>
    </div>
  );
}

/** Component gộp nhãn + thanh strength (tuỳ chọn dùng) */
export function StrengthHeader({ score, label }) {
  return (
    <div className="flex items-center justify-between mt-1">
      <span className={`text-xs ${label.cls}`}>{label.text}</span>
      <span className="text-xs text-slate-400">Score: {score}/5</span>
    </div>
  );
}
