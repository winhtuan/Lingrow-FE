// src/features/schedule/components/PinnedMoveDialog.jsx
import React from "react";
import Button from "../../../ui/Button";

export default function PinnedMoveDialog({
  move,
  onCancel,
  onOnlyThis,
  onSeries,
}) {
  if (!move) return null;

  const { sourceLesson } = move;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 mt-4">
            Buổi học đã ghim
          </p>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Di chuyển buổi học
          </h2>

          <p className="text-xs leading-relaxed text-slate-600">
            Bạn vừa di chuyển buổi học của{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-800">
              {sourceLesson.studentName}
            </span>{" "}
            sang thời gian khác. Chọn phạm vi áp dụng:
          </p>
        </div>

        {/* Options */}
        <div className="px-6 py-4 space-y-3">
          {/* Only this lesson */}
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onOnlyThis}
            className="justify-start text-left rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 mb-3"
          >
            <div className="flex items-start gap-3 w-full">
              <div className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Chỉ buổi này
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tách buổi này khỏi chuỗi ghim và xem như buổi riêng lẻ.
                </div>
              </div>
            </div>
          </Button>

          {/* All pinned lessons */}
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onSeries}
            className="justify-start text-left rounded-xl border-emerald-300 bg-emerald-50/80 hover:bg-emerald-50"
          >
            <div className="flex items-start gap-3 w-full">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-emerald-900">
                    Cả chuỗi buổi đã ghim
                  </span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Dời toàn bộ các buổi ghim của học sinh này theo thời gian mới.
                </div>
              </div>
            </div>
          </Button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 pt-2 border-t border-slate-100 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-transparent hover:border-slate-200"
          >
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
}
