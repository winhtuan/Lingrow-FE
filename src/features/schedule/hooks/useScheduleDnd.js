// src/features/schedule/hooks/useScheduleDnd.js
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";

export function useScheduleDnd({
  students,
  weekStart,
  lessons,
  createLessonFromStudentSlot,
  moveSingleLesson,
  requestPinnedMove,
  toast,
}) {
  const [activeId, setActiveId] = useState(null);

  const activeStudent = useMemo(
    () => students.find((s) => String(s.id) === String(activeId)) || null,
    [students, activeId]
  );

  const activeLesson = useMemo(
    () => lessons.find((l) => String(l.id) === String(activeId)) || null,
    [lessons, activeId]
  );

  const handleDragStart = useCallback((e) => {
    setActiveId(e.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      const overId = over ? String(over.id) : null;

      // thả vào thùng rác -> hủy kéo
      if (overId === "trash") {
        toast?.info?.("Đã hủy kéo thẻ");
        setActiveId(null);
        return;
      }

      // không có target hợp lệ
      if (!over) {
        setActiveId(null);
        return;
      }

      const activeIdStr = String(active.id);

      // KÉO LESSON TRONG LỊCH
      if (activeIdStr.startsWith("lesson-")) {
        const lesson = lessons.find((l) => String(l.id) === activeIdStr);
        if (!lesson) {
          setActiveId(null);
          return;
        }

        // chỉ quan tâm khi thả lên 1 slot
        if (!overId.startsWith("slot-")) {
          setActiveId(null);
          return;
        }

        const [, dayIndexStr, hourStr] = overId.split("-");
        const targetDayIndex = Number(dayIndexStr);
        const targetHour = Number(hourStr);

        const targetDate = weekStart
          .add(targetDayIndex, "day")
          .startOf("day")
          .toISOString();

        const sameDay =
          lesson.date && dayjs(lesson.date).isSame(targetDate, "day");
        const sameHour = lesson.hour === targetHour;
        const isSameSlot = sameDay && sameHour;

        // nếu không đổi slot thì thôi
        if (isSameSlot) {
          setActiveId(null);
          return;
        }

        // LESSON ĐANG GHIM -> mở dialog
        if (lesson.pinned) {
          requestPinnedMove(lesson, targetHour, targetDate);
        } else {
          // lesson thường -> move luôn
          moveSingleLesson(lesson.id, targetHour, targetDate);
        }

        setActiveId(null);
        return;
      }

      // KÉO THẺ HỌC SINH TỪ PANEL -> tạo lesson mới khi thả lên slot
      if (overId.startsWith("slot-")) {
        const [, dayIndexStr, hourStr] = overId.split("-");
        const dayIndex = Number(dayIndexStr);
        const hour = Number(hourStr);

        createLessonFromStudentSlot({
          studentId: active.id,
          dayIndex,
          hour,
        });
      }

      setActiveId(null);
    },
    [
      lessons,
      weekStart,
      moveSingleLesson,
      requestPinnedMove,
      createLessonFromStudentSlot,
      toast,
    ]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    activeStudent,
    activeLesson,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
