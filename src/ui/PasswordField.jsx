// src/ui/PasswordField.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Field from "./Field";

export default function PasswordField({
  id = "password",
  label = "Password",
  value,
  onChange,
  showForgot = true,
  onForgot,
}) {
  const [show, setShow] = useState(false);

  const handleForgot = () => {
    if (onForgot) onForgot();
    else window?.dispatchEvent(new CustomEvent("auth:forgot"));
  };

  return (
    <Field
      id={id}
      label={
        <div className="flex items-center justify-between">
          <span>{label}</span>
          {showForgot && (
            <button
              type="button"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              onClick={handleForgot}
            >
              Forgot your password?
            </button>
          )}
        </div>
      }
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder="••••••••"
      rightSlot={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      }
    />
  );
}
