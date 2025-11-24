// src/features/schedule/hooks/useLessonsState.js
import { useState, useCallback } from "react";
import dayjs from "dayjs";

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
    ({ studentId, dayIndex, hour }) => {
      const student = students.find((s) => String(s.id) === String(studentId));
      if (!student) return;

      const id = `lesson-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const colorClass =
        STUDENT_COLOR_TO_CLASS[student.color] ?? STUDENT_COLOR_TO_CLASS.blue;

      const slotDate = weekStart
        .add(dayIndex, "day")
        .startOf("day")
        .toISOString();

      setLessons((prev) => [
        ...prev,
        {
          id,
          studentId: student.id,
          studentName: student.name,
          note: student.note,
          hour,
          date: slotDate,
          colorClass,
          pinned: false,
        },
      ]);

      toast?.success?.(`Đã sắp lịch cho ${student.name}`);
    },
    [students, weekStart, toast]
  );

  // move 1 lesson
  const moveSingleLesson = useCallback(
    (lessonId, targetHour, targetDate, extra = {}) => {
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId
            ? {
                ...l,
                hour: targetHour,
                date: targetDate,
                ...extra,
              }
            : l
        )
      );
    },
    []
  );

  // toggle ghim 1 buổi (tạo chuỗi / bỏ chuỗi)
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
            newLessons.push({
              ...original,
              id: `lesson-${cursor.valueOf()}-${Math.random()
                .toString(16)
                .slice(2)}`,
              date: cursor.toISOString(),
              pinned: true,
            });
          }

          cursor = cursor.add(1, "week");
        }

        const updated = prev.map((l) =>
          l.id === lessonId ? { ...l, pinned: true } : l
        );

        return [...updated, ...newLessons];
      }

      // Bỏ ghim
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

  // đổi cả chuỗi buổi ghim dựa trên 1 buổi gốc
  const movePinnedSeries = useCallback(
    (sourceLesson, targetHour, targetDate) => {
      const sourceDate = dayjs(sourceLesson.date).startOf("day");
      const targetDay = dayjs(targetDate).startOf("day");

      const diffDays = targetDay.diff(sourceDate, "day");
      const diffHours = targetHour - sourceLesson.hour;

      setLessons((prev) =>
        prev.map((l) => {
          // cùng chuỗi: cùng học sinh, cùng giờ gốc, pinned
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

          // đảm bảo buổi gốc cũng được cập nhật chính xác
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
    },
    []
  );

  const removeLesson = useCallback((lessonId) => {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  }, []);

  return {
    lessons,
    createLessonFromStudentSlot,
    moveSingleLesson,
    togglePinLesson,
    movePinnedSeries,
    removeLesson,
  };
}
