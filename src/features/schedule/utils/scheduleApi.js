// src/features/schedule/utils/scheduleApi.js
import { api } from "../../../utils/apiClient.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Enable UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to Asia/Ho_Chi_Minh (UTC+7)
const TIMEZONE = "Asia/Ho_Chi_Minh";

export async function unpinSeries(lesson) {
  if (!lesson.scheduleId) return;
  await api.post(`/schedules/${lesson.scheduleId}/unpin-series`);
}

export async function fetchWeekSchedules(weekStartIso) {
    const qs = new URLSearchParams({ start: weekStartIso }).toString();
    return await api.get(`/schedules/week?${qs}`);
}

// map từ backend ScheduleResponse -> lesson cho UI
export function mapScheduleToLesson(schedule, student, colorClass) {
  // Convert UTC time from backend to local timezone
  const start = dayjs.utc(schedule.startTime).tz(TIMEZONE);
  const date = start.startOf("day").toISOString();
  const hour = start.hour();

  return {
    id: `lesson-${schedule.id}`, // id dùng cho DnD
    scheduleId: schedule.id, // id thật của schedule trên server
    studentId: student?.id ?? schedule.studentCardId,
    studentName: student?.name ?? schedule.title,
    note: student?.note ?? "",
    hour,
    date,
    colorClass,

    // ĐỌC TRẠNG THÁI GHIM TỪ DB
    pinned: !!schedule.isPinned,
    isGeneratedFromPin: false,
  };
}

export async function createSchedule({
  student,
  weekStart,
  dayIndex,
  hour,
  isPinned = false,
}) {
  // Create datetime in local timezone (Asia/Ho_Chi_Minh)
  const day = weekStart.add(dayIndex, "day");
  const start = dayjs.tz(
    `${day.format("YYYY-MM-DD")} ${hour}:00:00`,
    "YYYY-MM-DD HH:mm:ss",
    TIMEZONE
  );
  const end = start.add(60, "minute");

  const body = {
    studentCardId: student.id,
    title: student.note || student.name,
    startTime: start.utc().format(), // Convert to UTC for backend
    endTime: end.utc().format(),
    type: 0, // tùy enum của bạn
    isPinned,
  };

  const schedule = await api.post("/schedules", body);

  // màu block bám theo màu thẻ học sinh
  const STUDENT_COLOR_TO_CLASS = {
    blue: "bg-sky-50 border-sky-200 text-sky-900",
    purple: "bg-violet-50 border-violet-200 text-violet-900",
    green: "bg-emerald-50 border-emerald-200 text-emerald-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    rose: "bg-rose-50 border-rose-200 text-rose-900",
  };

  const colorClass =
    STUDENT_COLOR_TO_CLASS[student.color] ?? STUDENT_COLOR_TO_CLASS.blue;

  return mapScheduleToLesson(schedule, student, colorClass);
}

export async function updateSchedulePinned(lesson, isPinned) {
  if (!lesson.scheduleId) return;

  // Tính lại start/end từ lesson.date + lesson.hour in local timezone
  const dateStr = dayjs(lesson.date).format("YYYY-MM-DD");
  const start = dayjs.tz(
    `${dateStr} ${lesson.hour}:00:00`,
    "YYYY-MM-DD HH:mm:ss",
    TIMEZONE
  );
  const end = start.add(60, "minute");

  const body = {
    title: lesson.studentName,
    startTime: start.utc().format(),
    endTime: end.utc().format(),
    type: 0,
    isPinned,
  };

  await api.put(`/schedules/${lesson.scheduleId}`, body);
}

export async function updateScheduleTime({
  lesson,
  weekStart,
  dayIndex,
  hour,
}) {
  if (!lesson.scheduleId) {
    // lesson chưa sync server → bỏ qua (local only)
    return;
  }

  const day = weekStart.add(dayIndex, "day");
  const dateStr = day.format("YYYY-MM-DD");
  const start = dayjs.tz(
    `${dateStr} ${hour}:00:00`,
    "YYYY-MM-DD HH:mm:ss",
    TIMEZONE
  );
  const end = start.add(60, "minute");

  const body = {
    // giữ nguyên title + type, FE không sửa ở đây
    title: lesson.studentName,
    startTime: start.utc().format(),
    endTime: end.utc().format(),
    type: 0,
  };

  await api.put(`/schedules/${lesson.scheduleId}`, body);
}

export async function deleteSchedule(lesson) {
  if (!lesson.scheduleId) return;
  await api.del(`/schedules/${lesson.scheduleId}`);
}
