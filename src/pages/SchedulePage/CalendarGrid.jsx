import React, { useMemo } from "react";
import dayjs from "dayjs";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ScheduleCell from "./ScheduleCell";
import Button from "../../components/ui/Button";

const HOURS = Array.from({ length: 18 }, (_, i) => 6 + i);
const VN_DAY_FULL = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

export default function CalendarGrid({
  lessons,
  weekStart,
  weekLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
  onPinLesson,
}) {
  const today = dayjs();

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day")),
    [weekStart]
  );

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

  return (
    <section className="mt-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header lịch (tiêu đề + nút tuần trước / sau) */}
      <div className="border-b border-slate-200 px-6 py-4 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Lịch tuần
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{weekLabel}</p>
            </div>

            <button
              onClick={onToday}
              className="hidden sm:inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Hôm nay
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Nút tuần trước */}
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevWeek}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-slate-700 hover:bg-slate-100"
              >
                <LuChevronLeft className="w-4 h-4" />
                <span>Tuần trước</span>
              </Button>

              {/* Nút tuần sau */}
              <Button
                variant="primary"
                size="sm"
                onClick={onNextWeek}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800"
              >
                <span>Tuần sau</span>
                <LuChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* HÀNG THỨ / NGÀY – LUÔN CỐ ĐỊNH, KHÔNG NẰM TRONG VÙNG CUỘN */}
      <div
        className="grid border-b border-slate-200 bg-white"
        style={{
          gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))",
        }}
      >
        {/* Ô "Giờ" bên trái */}
        <div className="h-16 border-r border-slate-200 bg-slate-50 flex items-center justify-center text-[11px] font-semibold text-slate-500">
          Giờ
        </div>

        {/* Các cột thứ / ngày */}
        {days.map((day) => {
          const weekdayIndex = day.day(); // 0-6
          const isToday = day.isSame(today, "day");
          return (
            <div
              key={day.toString()}
              className={[
                "h-16 flex flex-col items-center justify-center border-r border-slate-200 transition",
                isToday ? "bg-red-50" : "bg-slate-50",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[10px] uppercase font-medium tracking-wide",
                  isToday ? "text-red-600" : "text-slate-500",
                ].join(" ")}
              >
                {VN_DAY_FULL[weekdayIndex]}
              </span>
              <div className="mt-0.5 flex items-center gap-1">
                <span
                  className={[
                    "text-lg font-bold",
                    isToday ? "text-red-600" : "text-slate-800",
                  ].join(" ")}
                >
                  {day.date()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* PHẦN THÂN – CHỈ PHẦN NÀY ĐƯỢC CUỘN */}
      <div className="overflow-auto max-h-[calc(100vh-16rem)] scrollbar-none">
        <div
          className="grid bg-white"
          style={{
            gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))",
          }}
        >
          {HOURS.map((hour, rowIndex) => {
            const isAltRow = rowIndex % 2 === 1;
            const timeBg = isAltRow ? "bg-slate-50" : "bg-slate-50/70";

            return (
              <React.Fragment key={hour}>
                {/* Cột giờ bên trái */}
                <div
                  className={[
                    "border-t border-slate-200 border-r px-3 py-2 text-xs font-semibold text-slate-600",
                    "flex items-center justify-center",
                    timeBg,
                  ].join(" ")}
                >
                  {hour}:00
                </div>

                {/* 7 ô cho mỗi ngày */}
                {days.map((_, dayIndex) => {
                  const key = `${dayIndex}-${hour}`;
                  const slotLessons = lessonsBySlot[key] || [];
                  return (
                    <ScheduleCell
                      key={key}
                      dayIndex={dayIndex}
                      hour={hour}
                      lessons={slotLessons}
                      isAltRow={isAltRow}
                      onPinLesson={onPinLesson} // THÊM
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
