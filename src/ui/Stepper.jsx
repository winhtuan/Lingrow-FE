// src/ui/Stepper.jsx
import React from "react";
import { Check } from "lucide-react";

export default function Stepper({
  step,
  items = [
    { id: 1, label: "Enter your email" },
    { id: 2, label: "Provide basic info" },
    { id: 3, label: "Create your password" },
  ],
}) {
  const n = items.length;
  const progress =
    n > 1 ? Math.min((step - 1) / (n - 1), 1) * 100 : step > 0 ? 100 : 0;

  return (
    <div className="w-full select-none">
      {/* Rail */}
      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-slate-200 rounded" />
        <div
          className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-green-600 rounded transition-[width] duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />

        {/* Markers (non-interactive) */}
        {items.map((it, idx) => {
          const pct = n > 1 ? (idx / (n - 1)) * 100 : 0;
          const state =
            it.id < step ? "done" : it.id === step ? "active" : "todo";
          return (
            <div
              key={it.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${pct}%`, top: "50%" }}
              role="presentation"
              aria-hidden="true"
              title={it.label}
            >
              <span
                className={[
                  "block rounded-full transition-all duration-300 ring-2",
                  state === "active"
                    ? "h-5 w-5 bg-slate-900 ring-slate-900"
                    : state === "done"
                    ? "h-4 w-4 bg-green-600 ring-green-600"
                    : "h-3.5 w-3.5 bg-white ring-slate-300",
                ].join(" ")}
              />
              {state === "done" && (
                <Check className="absolute -right-3 -top-3 h-3 w-3 text-green-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels (non-interactive) */}
      <div
        className="mt-2 grid"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {items.map((it, idx) => {
          const state =
            it.id < step ? "done" : it.id === step ? "active" : "todo";
          const alignClass =
            idx === 0
              ? "text-left"
              : idx === n - 1
              ? "text-right"
              : "text-center";
          return (
            <div key={it.id} className={`${alignClass} pointer-events-none`}>
              <span
                className={[
                  "leading-snug transition-all duration-300",
                  state === "active"
                    ? "text-slate-800 font-semibold text-base sm:text-lg"
                    : state === "done"
                    ? "text-green-600 text-sm font-medium"
                    : "text-slate-400 text-sm font-normal",
                ].join(" ")}
              >
                {it.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
