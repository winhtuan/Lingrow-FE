// /src/shared/components/navigation/ErrorPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../ui/Button";

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // error được truyền qua state khi navigate("/error", { state: { error } })
  const error = location.state?.error || {};

  const status = error.status ?? error.statusCode ?? undefined;

  // ƯU TIÊN message từ BE (nếu bạn map vào payload.message)
  const backendMessage =
    error.payload?.message ||
    error.payload?.error ||
    error.message ||
    "Đã xảy ra lỗi không xác định.";

  const requestId =
    error.payload?.traceId ||
    error.payload?.requestId ||
    error.payload?.correlationId ||
    null;

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 mt-10">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm px-8 py-10">
        <div className="mb-6">
          <div className="inline-flex items-center rounded-xl bg-rose-50 border border-rose-200 px-4 py-1">
            <span className="text-xs font-semibold text-rose-700">
              {status ? `ERROR ${status}` : "ERROR"}
            </span>
          </div>
        </div>

        <h1 className="text-base font-semibold text-slate-900 mb-2">
          {backendMessage}
        </h1>

        {requestId && (
          <p className="text-xs text-slate-500 mt-1">
            Mã yêu cầu: <span className="font-mono">{requestId}</span>
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Trang chủ
          </Button>
        </div>
      </div>
    </main>
  );
}
