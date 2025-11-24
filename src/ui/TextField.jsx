// src/ui/TextField.jsx
import React from "react";

export default function TextField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  rightSlot = null,
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
                     focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 
                     transition-all text-gray-900 ${rightSlot ? "pr-12" : ""}`}
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
