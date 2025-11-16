// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">L</span>
          </div>
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-slate-900 mb-2">404</h1>
          <div className="h-1 w-24 bg-slate-900 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Trang không tồn tại
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. 
          Có thể trang đã bị xóa hoặc đường dẫn không chính xác.
        </p>

        {/* Illustration */}
        <div className="mb-10">
          <svg
            className="w-64 h-64 mx-auto text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="rounded-full px-8"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </div>

        {/* Help text */}
        <p className="text-sm text-slate-500 mt-8">
          Cần hỗ trợ?{" "}
          <button
            className="text-slate-900 font-semibold hover:underline"
            onClick={() => navigate("/contact")}
          >
            Liên hệ với chúng tôi
          </button>
        </p>
      </div>
    </div>
  );
}
