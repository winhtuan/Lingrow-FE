import React from "react";

export default function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  rightSlot = null,
}) {
  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg
                     focus:outline-none focus:border-slate-900
                     transition-all pr-12"
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-auto">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
