// src/features/schedule/hooks/useLessonsState.js
import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import {
  fetchWeekSchedules,
  mapScheduleToLesson,
  createSchedule,
  updateScheduleTime,
  deleteSchedule,
  updateSchedulePinned,
} from "../utils/scheduleApi";

const STUDENT_COLOR_TO_CLASS = {
  blue: "bg-sky-50 border-sky-200 text-sky-900",
  purple: "bg-violet-50 border-violet-200 text-violet-900",
  green: "bg-emerald-50 border-emerald-200 text-emerald-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  rose: "bg-rose-50 border-rose-200 text-rose-900",
};

export function useLessonsState({ weekStart, students, toast }) {
  const [lessons, setLessons] = useState([]);
  // để phân biệt "chưa load" và "đã load nhưng không có schedule"
  const [schedules, setSchedules] = useState(null);

  // 1) CHỈ fetch schedules khi weekStart đổi
  useEffect(() => {
    if (!weekStart) return;

    let cancelled = false;

    const load = async () => {
      try {
        const weekStartIso = weekStart.startOf("day").toISOString();
        const data = await fetchWeekSchedules(weekStartIso);
        if (cancelled) return;
        setSchedules(data || []);
      } catch (err) {
        const msg = err?.message || "Không thể tải lịch học. Vui lòng thử lại.";
        toast?.error?.(msg);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [weekStart, toast]);

  // 2) Map schedules + students thành lessons, giữ lại trạng thái pinned
  useEffect(() => {
    // chưa load xong hoặc chưa gọi API
    if (schedules === null) return;

    // tuần này BE không có schedule → giữ nguyên state cũ (không xóa pin)
    if (schedules.length === 0) {
      return;
    }

    const mapped = schedules.map((s) => {
      const student = students.find(
        (st) => String(st.id) === String(s.studentCardId)
      );

      const colorClass =
        STUDENT_COLOR_TO_CLASS[student?.color] ?? STUDENT_COLOR_TO_CLASS.blue;

      return mapScheduleToLesson(s, student, colorClass);
    });

    setLessons((prev) => {
      // Tạo Set các studentId còn tồn tại
      const validStudentIds = new Set(students.map((s) => String(s.id)));

      // lesson cũ có scheduleId → dùng để giữ pinned
      const prevByScheduleId = new Map();
      for (const l of prev) {
        if (l.scheduleId) {
          prevByScheduleId.set(l.scheduleId, l);
        }
      }

      // gộp trạng thái pinned từ prev vào mapped
      const mappedWithPinned = mapped.map((m) => {
        const old = prevByScheduleId.get(m.scheduleId);
        if (!old) return m;
        return {
          ...m,
          pinned: old.pinned ?? false,
          isGeneratedFromPin: old.isGeneratedFromPin ?? false,
        };
      });

      const newScheduleIds = new Set(mappedWithPinned.map((l) => l.scheduleId));

      // giữ lại:
      // - lesson local (scheduleId null, ví dụ series từ pin)
      // - lesson cũ có scheduleId nhưng không còn trong batch mới
      // NHƯNG CHỈ GIỮ NẾU student còn tồn tại
      const localLessons = prev.filter(
        (l) =>
          validStudentIds.has(String(l.studentId)) &&
          (!l.scheduleId || !newScheduleIds.has(l.scheduleId))
      );

      // Lọc bỏ các lesson của student đã bị xóa
      const validMapped = mappedWithPinned.filter((l) =>
        validStudentIds.has(String(l.studentId))
      );

      return [...localLessons, ...validMapped];
    });
  }, [schedules, students]);

  // 3) Tạo lesson mới khi kéo thả thẻ học sinh
  const createLessonFromStudentSlot = useCallback(
    async ({ studentId, dayIndex, hour }) => {
      const student = students.find((s) => String(s.id) === String(studentId));
      if (!student) return;

      try {
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

  // 4) Di chuyển 1 buổi (update FE trước, rồi gọi API)
  const moveSingleLesson = useCallback(
    async (lessonId, targetHour, targetDate, extra = {}) => {
      setLessons((prev) => {
        const exists = prev.find((l) => l.id === lessonId);
        if (!exists) return prev;

        return prev.map((l) =>
          l.id === lessonId
            ? { ...l, hour: targetHour, date: targetDate, ...extra }
            : l
        );
      });

      try {
        const targetDayIndex = dayjs(targetDate)
          .startOf("day")
          .diff(weekStart.startOf("day"), "day");

        const current = lessons.find((l) => l.id === lessonId);
        if (!current?.scheduleId) return;

        await updateScheduleTime({
          lesson: current,
          weekStart,
          dayIndex: targetDayIndex,
          hour: targetHour,
        });
      } catch (err) {
        const msg = err?.message || "Không thể cập nhật buổi học.";
        toast?.error?.(msg);
      }
    },
    [lessons, weekStart, toast]
  );

  // 5) Ghim / bỏ ghim (sync với DB)
  const togglePinLesson = useCallback(
    async (lessonId) => {
      const original = lessons.find((l) => l.id === lessonId);
      if (!original || !original.date) return;

      const baseDate = dayjs(original.date).startOf("day");
      const endDate = baseDate.add(3, "month");

      // TÌM student từ danh sách students để tạo lịch mới khi ghim
      const student = students.find(
        (s) => String(s.id) === String(original.studentId)
      );

      // ===== CASE 1: GHIM (từ false -> true) =====
      if (!original.pinned) {
        // 1) update buổi gốc trên DB
        if (original.scheduleId) {
          await updateSchedulePinned(original, true);
        }

        const newLessons = [];

        if (student) {
          // 2) tạo các buổi lặp 1 tuần / lần trong 3 tháng trên DB
          let cursor = baseDate.add(1, "week");

          while (
            cursor.isBefore(endDate, "day") ||
            cursor.isSame(endDate, "day")
          ) {
            // "chụp" giá trị ngày hiện tại của cursor ra 1 biến riêng
            const targetDateStr = cursor.format("YYYY-MM-DD");

            const exists = lessons.some((l) => {
              if (!l.date) return false;

              return (
                String(l.studentId) === String(original.studentId) &&
                l.hour === original.hour &&
                dayjs(l.date).format("YYYY-MM-DD") === targetDateStr
              );
            });

            if (!exists && student) {
              const created = await createSchedule({
                student,
                weekStart: cursor,
                dayIndex: 0,
                hour: original.hour,
                isPinned: true,
              });
              newLessons.push(created);
            }

            cursor = cursor.add(1, "week");
          }
        }

        // 3) update state: buổi gốc pinned:true + thêm các buổi mới
        setLessons((prev) => [
          ...prev.map((l) => (l.id === lessonId ? { ...l, pinned: true } : l)),
          ...newLessons,
        ]);

        return;
      }

      // ===== CASE 2: HUỶ GHIM (từ true -> false) =====
      // 1) Bỏ ghim buổi gốc trên DB
      if (original.scheduleId) {
        await updateSchedulePinned(original, false);
      }

      // 2) tìm tất cả buổi pinned về sau (cùng student, cùng hour, trong 3 tháng tới)
      const toDelete = lessons.filter((l) => {
        if (!l.pinned) return false;
        if (!l.scheduleId) return false;
        if (!l.date) return false;
        if (String(l.studentId) !== String(original.studentId)) return false;
        if (l.hour !== original.hour) return false;

        const d = dayjs(l.date).startOf("day");
        // chỉ xóa các buổi sau ngày gốc
        return (
          d.isAfter(baseDate, "day") &&
          (d.isBefore(endDate, "day") || d.isSame(endDate, "day"))
        );
      });

      // 3) Xóa khỏi DB (song song)
      await Promise.all(toDelete.map((l) => deleteSchedule(l)));

      const idsToDelete = new Set(toDelete.map((l) => l.id));

      // 4) Cập nhật state: xoá các buổi pinned về sau + set pinned=false cho buổi gốc
      setLessons((prev) =>
        prev
          .filter((l) => !idsToDelete.has(l.id))
          .map((l) => (l.id === lessonId ? { ...l, pinned: false } : l))
      );
    },
    [lessons, students]
  );

  // 6) Di chuyển cả chuỗi ghim (local)
  const movePinnedSeries = useCallback(
    (sourceLesson, targetHour, targetDate) => {
      const sourceDate = dayjs(sourceLesson.date).startOf("day");
      const targetDay = dayjs(targetDate).startOf("day");
      const diffDays = targetDay.diff(sourceDate, "day");
      const diffHours = targetHour - sourceLesson.hour;

      setLessons((prev) =>
        prev.map((l) => {
          if (
            String(l.studentId) === String(sourceLesson.studentId) &&
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
            return { ...l, date: targetDate, hour: targetHour };
          }

          return l;
        })
      );
    },
    []
  );

  // 7) Xóa 1 buổi
  const removeLesson = useCallback(
    async (lessonId) => {
      let targetLesson = null;

      setLessons((prev) => {
        targetLesson = prev.find((l) => l.id === lessonId) || null;
        if (!targetLesson) return prev;
        return prev.filter((l) => l.id !== lessonId);
      });

      if (!targetLesson?.scheduleId) return;

      try {
        await deleteSchedule(targetLesson);
        toast?.success?.("Đã xoá buổi học");
      } catch (err) {
        const msg = err?.message || "Không thể xoá buổi học.";
        toast?.error?.(msg);
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
