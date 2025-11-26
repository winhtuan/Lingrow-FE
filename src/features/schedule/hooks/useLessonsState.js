// src/features/schedule/hooks/useLessonsState.js
import { useState, useCallback } from "react";
import dayjs from "dayjs";
import {
  createSchedule,
  updateScheduleTime,
  deleteSchedule,
} from "../utils/scheduleApi";

const STUDENT_COLOR_TO_CLASS = {
  blue: "bg-sky-50 border-sky-200 text-sky-900",
  purple: "bg-violet-50 border-violet-200 text-violet-900",
  green: "bg-emerald-50 border-emerald-200 text-emerald-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  rose: "bg-rose-50 border-rose-200 text-rose-900",
};

export function useLessonsState({ students, weekStart, toast }) {
  const [lessons, setLessons] = useState([]);

  // tạo lesson mới khi thả 1 student card xuống 1 slot
  const createLessonFromStudentSlot = useCallback(
    async ({ studentId, dayIndex, hour }) => {
      const student = students.find((s) => String(s.id) === String(studentId));
      if (!student) return;

      try {
        // gọi BE tạo schedule, map về lesson cho FE
        const lesson = await createSchedule({
          student,
          weekStart,
          dayIndex,
          hour,
        });

        setLessons((prev) => [...prev, lesson]);
        toast?.success?.(`Đã sắp lịch cho ${student.name}`);
      } catch (err) {
        const msg = err?.message || "Không thể tạo buổi học. Vui lòng thử lại.";
        toast?.error?.(msg);
      }
    },
    [students, weekStart, toast]
  );

  // move 1 lesson
  const moveSingleLesson = useCallback(
    async (lessonId, targetHour, targetDate, extra = {}) => {
      setLessons((prev) => {
        const exists = prev.find((l) => l.id === lessonId);
        if (!exists) return prev;
        // optimistic update trước
        return prev.map((l) =>
          l.id === lessonId
            ? {
                ...l,
                hour: targetHour,
                date: targetDate,
                ...extra,
              }
            : l
        );
      });

      try {
        const targetDayIndex = dayjs(targetDate)
          .startOf("day")
          .diff(weekStart.startOf("day"), "day");

        const lesson = ((prev) => prev.find((l) => l.id === lessonId))(lessons);

        // nếu lesson chưa sync server (scheduleId null) thì bỏ qua phần API
        if (!lesson?.scheduleId) return;

        await updateScheduleTime({
          lesson,
          weekStart,
          dayIndex: targetDayIndex,
          hour: targetHour,
        });
      } catch (err) {
        const msg = err?.message || "Không thể cập nhật buổi học.";
        toast?.error?.(msg);

        // rollback đơn giản: reload lại tuần / gọi lại API list sau này
        // hiện tại chưa có API GET nên tạm thời không rollback chi tiết
      }
    },
    [lessons, weekStart, toast]
  );

  // toggle ghim 1 buổi (tạo chuỗi / bỏ chuỗi) – tạm thời chỉ local
  const togglePinLesson = useCallback((lessonId) => {
    setLessons((prev) => {
      const original = prev.find((l) => l.id === lessonId);
      if (!original || !original.date) return prev;

      const startDate = dayjs(original.date).startOf("day");
      const endDate = startDate.add(3, "month");

      // Ghim
      if (!original.pinned) {
        const newLessons = [];
        let cursor = startDate.add(1, "week");

        while (
          cursor.isBefore(endDate, "day") ||
          cursor.isSame(endDate, "day")
        ) {
          const cursorDay = cursor;

          const exists = prev.some(
            (l) =>
              l.studentId === original.studentId &&
              l.hour === original.hour &&
              l.date &&
              dayjs(l.date).isSame(cursorDay, "day")
          );

          if (!exists) {
            const colorClass =
              original.colorClass || STUDENT_COLOR_TO_CLASS.blue;

            newLessons.push({
              ...original,
              id: `lesson-${cursor.valueOf()}-${Math.random()
                .toString(16)
                .slice(2)}`,
              date: cursor.toISOString(),
              pinned: true,
              // pinned clone hiện chưa có scheduleId → chưa sync BE
              scheduleId: null,
              colorClass,
            });
          }

          cursor = cursor.add(1, "week");
        }

        const updated = prev.map((l) =>
          l.id === lessonId ? { ...l, pinned: true } : l
        );

        return [...updated, ...newLessons];
      }

      // Bỏ ghim: chỉ thao tác local
      const filtered = prev.filter((l) => {
        if (l.id === lessonId) return true;
        if (
          l.studentId !== original.studentId ||
          l.hour !== original.hour ||
          !l.date
        )
          return true;

        const d = dayjs(l.date).startOf("day");

        return !(
          d.isAfter(startDate, "day") &&
          (d.isBefore(endDate, "day") || d.isSame(endDate, "day"))
        );
      });

      return filtered.map((l) =>
        l.id === lessonId ? { ...l, pinned: false } : l
      );
    });
  }, []);

  // đổi cả chuỗi buổi ghim dựa trên 1 buổi gốc – hiện tại chỉ local
  const movePinnedSeries = useCallback(
    (sourceLesson, targetHour, targetDate) => {
      const sourceDate = dayjs(sourceLesson.date).startOf("day");
      const targetDay = dayjs(targetDate).startOf("day");

      const diffDays = targetDay.diff(sourceDate, "day");
      const diffHours = targetHour - sourceLesson.hour;

      setLessons((prev) =>
        prev.map((l) => {
          if (
            l.studentId === sourceLesson.studentId &&
            l.pinned &&
            l.date &&
            l.hour === sourceLesson.hour
          ) {
            const newDate = dayjs(l.date)
              .startOf("day")
              .add(diffDays, "day")
              .toISOString();
            return {
              ...l,
              date: newDate,
              hour: l.hour + diffHours,
            };
          }

          if (l.id === sourceLesson.id) {
            return {
              ...l,
              date: targetDate,
              hour: targetHour,
            };
          }

          return l;
        })
      );

      // TODO: sau này có thể sync BE cho cả chuỗi
    },
    []
  );

  const removeLesson = useCallback(
    async (lessonId) => {
      let targetLesson = null;

      setLessons((prev) => {
        targetLesson = prev.find((l) => l.id === lessonId) || null;
        if (!targetLesson) return prev;

        // Optimistic: xoá khỏi UI trước
        return prev.filter((l) => l.id !== lessonId);
      });

      if (!targetLesson) return;

      try {
        await deleteSchedule(targetLesson);
        toast?.success?.("Đã xoá buổi học");
      } catch (err) {
        const msg = err?.message || "Không thể xoá buổi học.";
        toast?.error?.(msg);
        // Có thể cần reload lại lịch từ server để đồng bộ
      }
    },
    [toast]
  );

  return {
    lessons,
    createLessonFromStudentSlot,
    moveSingleLesson,
    togglePinLesson,
    movePinnedSeries,
    removeLesson,
  };
}
