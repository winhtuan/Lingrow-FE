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
  removeLesson,
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
      const activeIdStr = String(active.id);

      // 1) KÉO RA NGOÀI MỌI DROPPABLE
      if (!over) {
        // lesson trên lịch -> xóa
        if (activeIdStr.startsWith("lesson-")) {
          removeLesson?.(activeIdStr);
        }
        // thẻ học sinh -> chỉ hủy kéo
        setActiveId(null);
        return;
      }

      // 2) KÉO LESSON TRONG LỊCH
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

        if (isSameSlot) {
          setActiveId(null);
          return;
        }

        if (lesson.pinned) {
          requestPinnedMove(lesson, targetHour, targetDate);
        } else {
          moveSingleLesson(lesson.id, targetHour, targetDate);
        }

        setActiveId(null);
        return;
      }

      // 3) KÉO THẺ HỌC SINH TỪ PANEL -> tạo lesson mới khi thả lên slot
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
      removeLesson,
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
