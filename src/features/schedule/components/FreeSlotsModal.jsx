// src/features/schedule/components/FreeSlotsModal.jsx
import React, { useMemo } from "react";
import dayjs from "dayjs";
import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";

const VN_DAY_FULL = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

const PERIOD_CONFIG = {
  morning: {
    key: "morning",
    label: "buổi sáng",
    timeRangeLabel: "6:00 – 12:00",
    // 6..11
    hours: Array.from({ length: 6 }, (_, i) => 6 + i),
  },
  afternoon: {
    key: "afternoon",
    label: "buổi chiều",
    timeRangeLabel: "12:00 – 18:00",
    // 12..17
    hours: Array.from({ length: 6 }, (_, i) => 12 + i),
  },
  evening: {
    key: "evening",
    label: "buổi tối",
    timeRangeLabel: "18:00 – 24:00",
    // 18..22 (slot 22:00–23:00)
    hours: Array.from({ length: 6 }, (_, i) => 18 + i),
  },
};

export default function FreeSlotsModal({
  open,
  onClose,
  period = "morning", // "morning" | "afternoon" | "evening"
  weekStart,
  lessons = [],
}) {
  const cfg = PERIOD_CONFIG[period] || PERIOD_CONFIG.morning;

  // 7 ngày trong tuần hiện tại
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day")),
    [weekStart]
  );

  // Gom lesson theo slot dayIndex-hour giống CalendarGrid
  const lessonsBySlot = useMemo(() => {
    const map = {};
    const weekEnd = weekStart.add(7, "day");

    for (const lesson of lessons) {
      if (!lesson.date) continue;

      const d = dayjs(lesson.date).startOf("day");
      if (d.isBefore(weekStart, "day") || !d.isBefore(weekEnd, "day")) continue;

      const dayIndex = d.diff(weekStart.startOf("day"), "day");
      if (dayIndex < 0 || dayIndex > 6) continue;

      const key = `${dayIndex}-${lesson.hour}`;
      if (!map[key]) map[key] = [];
      map[key].push(lesson);
    }

    return map;
  }, [lessons, weekStart]);

  const title =
    period === "morning"
      ? "Lịch trống buổi sáng"
      : period === "afternoon"
      ? "Lịch trống buổi chiều"
      : "Lịch trống buổi tối";

  return (
    <Modal open={open} onClose={onClose} title={title} widthClass="max-w-4xl">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Bảng dưới đây hiển thị lịch của {cfg.label} trong tuần. Các ô
          <span className="inline-flex items-center px-2 py-0.5 mx-1 rounded-md bg-rose-50 border border-rose-200 text-[11px] text-rose-700">
            redSoft
          </span>
          biểu thị thời điểm đã có lịch học, trong khi các ô
          <span className="inline-flex items-center px-2 py-0.5 mx-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700">
            greenSoft
          </span>
          cho biết thời điểm còn trống.
        </p>

        {/* Grid header: hàng ngày */}
        <div
          className="grid border border-slate-200 rounded-lg overflow-hidden text-xs"
          style={{
            gridTemplateColumns: "80px repeat(7, minmax(0, 1fr))",
          }}
        >
          {/* Cột tiêu đề "Giờ" */}
          <div className="bg-slate-50 border-r border-slate-200 h-12 flex items-center justify-center font-semibold text-slate-600">
            Giờ
          </div>

          {days.map((day) => {
            const weekdayIndex = day.day();
            return (
              <div
                key={day.toString()}
                className="bg-slate-50 border-r border-slate-200 h-12 flex flex-col items-center justify-center"
              >
                <span className="uppercase text-[10px] font-medium text-slate-500 tracking-wide">
                  {VN_DAY_FULL[weekdayIndex]}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {day.date()}
                </span>
              </div>
            );
          })}

          {/* Body: từng giờ trong buổi */}
          {cfg.hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Cột giờ */}
              <div className="border-t border-r border-slate-200 bg-slate-50/70 h-12 flex items-center justify-center font-semibold text-slate-700">
                {hour}:00
              </div>

              {/* 7 ô ngày */}
              {days.map((_, dayIndex) => {
                const key = `${dayIndex}-${hour}`;
                const hasLesson = (lessonsBySlot[key] || []).length > 0;

                const cellClass = hasLesson
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700";

                return (
                  <div
                    key={key}
                    className={[
                      "border-t border-r border-slate-200 h-12 px-1.5 py-1",
                      "flex items-center justify-center",
                      "text-[11px] font-medium rounded-none",
                      cellClass,
                    ].join(" ")}
                  >
                    {hasLesson ? "Bận" : "Trống"}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
