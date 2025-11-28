// src/features/schedule/components/CalendarGrid.jsx
import React, { useMemo } from "react";
import dayjs from "dayjs";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ScheduleCell from "./ScheduleCell";
import Button from "../../../ui/Button";
import Select from "../../../ui/Select";

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

const FREE_PERIOD_OPTIONS = [
  { value: "morning", label: "Buổi Sáng" },
  { value: "afternoon", label: "Buổi Chiều" },
  { value: "evening", label: "Buổi Tối" },
];

export default function CalendarGrid({
  lessons = [],
  weekStart,
  weekLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
  onPinLesson,
  isDragging,
  onOpenFreeSlots, // callback mở modal lịch trống
}) {
  const today = dayjs();

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day")),
    [weekStart]
  );

  // gom lessons theo slot dayIndex-hour
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
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header lịch (tiêu đề + nút tuần trước / sau / lịch trống) */}
      <div className="border-b border-slate-200 px-6 py-4 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Lịch tuần
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{weekLabel}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={onToday} variant="redSoft" size="sm">
                Hôm nay
              </Button>
            </div>
          </div>

          {/* Bên phải: dropdown lịch trống + điều hướng tuần */}
          <div className="flex items-center gap-3">
            {/* Dropdown Lịch trống */}
            <div className="w-52">
              <Select
                options={FREE_PERIOD_OPTIONS}
                placeholder="Xem lịch trống"
                value={undefined}
                onChange={(val) => {
                  if (!val) return;
                  onOpenFreeSlots?.(val);
                }}
                align="right"
              />
            </div>

            {/* Buttons tuần trước / tuần sau */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevWeek}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-slate-700 hover:bg-slate-100"
              >
                <LuChevronLeft className="w-4 h-4" />
                <span>Tuần trước</span>
              </Button>

              <Button
                variant="greenSoft"
                size="sm"
                onClick={onNextWeek}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full"
              >
                <span>Tuần sau</span>
                <LuChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* HÀNG THỨ / NGÀY */}
      <div
        className="grid border-b border-slate-200 bg-white"
        style={{
          gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))",
        }}
      >
        {/* Ô "Giờ" */}
        <div className="h-16 border-r border-slate-200 bg-slate-50 flex items-center justify-center text-[11px] font-semibold text-slate-500">
          Giờ
        </div>

        {days.map((day) => {
          const weekdayIndex = day.day();
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

      {/* PHẦN THÂN (CUỘN) */}
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

                {/* 7 ô ngày */}
                {days.map((day, dayIndex) => {
                  const key = `${dayIndex}-${hour}`;
                  const slotLessons = lessonsBySlot[key] || [];

                  // ngày trong quá khứ
                  const isPastDay = day.isBefore(today, "day");

                  return (
                    <ScheduleCell
                      key={key}
                      dayIndex={dayIndex}
                      hour={hour}
                      lessons={slotLessons}
                      isAltRow={isAltRow}
                      onPinLesson={onPinLesson}
                      isPastDay={isPastDay}
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
