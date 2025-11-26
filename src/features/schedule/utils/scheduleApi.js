// src/features/schedule/api/scheduleApi.js
import { api } from "../../../utils/apiClient.js";
import dayjs from "dayjs";

// map từ backend ScheduleResponse -> lesson cho UI
export function mapScheduleToLesson(schedule, student, colorClass) {
  const start = dayjs(schedule.startTime);
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
    pinned: false,
  };
}

export async function createSchedule({ student, weekStart, dayIndex, hour }) {
  const day = weekStart.add(dayIndex, "day");
  const start = day.hour(hour).minute(0).second(0).millisecond(0);
  const end = start.add(60, "minute");

  const body = {
    studentCardId: student.id,
    title: student.note || student.name,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    type: 0, // tuỳ enum của bạn, tạm thời = 0
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
  const start = day.hour(hour).minute(0).second(0).millisecond(0);
  const end = start.add(60, "minute");

  const body = {
    // giữ nguyên title + type, FE không sửa ở đây
    title: lesson.studentName,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    type: 0,
  };

  await api.put(`/schedules/${lesson.scheduleId}`, body);
}

export async function deleteSchedule(lesson) {
  if (!lesson.scheduleId) return;
  await api.del(`/schedules/${lesson.scheduleId}`);
}
