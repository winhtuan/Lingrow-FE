import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Modal from "../../../ui/Modal";

const maskEmail = (s) => {
  if (!s) return "";
  const [name, dom] = s.split("@");
  const visible = name.slice(0, 2);
  const stars = "*".repeat(Math.max(1, name.length - 2));
  return `${visible}${stars}@${dom}`;
};

export default function AccountLoginModal({
  open,
  onClose,
  account, // { id, name, email, avatar }
  onSubmit, // (password, remember)=>void | Promise<void>
  allowRemember = true,
}) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password?.trim()) return;
    try {
      setLoading(true);
      await onSubmit?.(password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Sign in">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={account?.avatar}
          alt={account?.name}
          className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
        />
        <div className="min-w-0">
          <div className="text-slate-900 font-semibold truncate">
            {account?.name}
          </div>
          <div className="text-slate-500 text-sm truncate">
            {maskEmail(account?.email) || "Using saved account"}
          </div>
        </div>
      </div>

      <label className="block text-sm text-slate-600 mb-1">Password</label>
      <div className="relative mb-3">
        <input
          type={show ? "text" : "password"}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1"
          onClick={() => setShow((s) => !s)}
          type="button"
          aria-label="Toggle password"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          disabled={loading || !password}
          className="inline-flex justify-center items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 disabled:opacity-50"
        >
          {loading && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 0 1 8-8"
                stroke="currentColor"
              />
            </svg>
          )}
          Continue as {account?.name?.split(" ")[0] || "user"}
        </button>

        <button
          onClick={onClose}
          className="text-sm font-medium text-slate-700 hover:underline"
          type="button"
        >
          Not you?
        </button>
      </div>

      <div className="mt-3">
        <button
          onClick={() => {
            onClose?.();
            // bạn có thể điều hướng qua trang “Use another account” ở đây
          }}
          className="text-sm text-slate-600 hover:text-slate-900"
          type="button"
        >
          Use another account
        </button>
      </div>
    </Modal>
  );
}
