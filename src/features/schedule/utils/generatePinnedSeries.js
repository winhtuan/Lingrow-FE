// src/features/schedule/utils/generatePinnedSeries.js
import dayjs from "dayjs";

const PIN_RANGE_MONTHS = 3;

export function generatePinnedSeries(baseLesson, existingLessons) {
  const result = [];

  const startDate = dayjs(baseLesson.date).startOf("day");
  const endDate = startDate.add(PIN_RANGE_MONTHS, "month");

  let cursor = startDate.add(1, "week");

  while (cursor.isBefore(endDate) || cursor.isSame(endDate, "day")) {
    const cursorDay = cursor;

    const sameSlotExists = existingLessons.some((l) => {
      return (
        String(l.studentId) === String(baseLesson.studentId) &&
        dayjs(l.date).isSame(cursorDay, "day") &&
        l.hour === baseLesson.hour
      );
    });

    if (!sameSlotExists) {
      result.push({
        ...baseLesson,
        id: `${baseLesson.id}-pin-${cursorDay.format("YYYYMMDD")}`,
        date: cursorDay.toISOString(),
        pinned: true,
        isGeneratedFromPin: true,
        scheduleId: null, // bản local, không sync BE
      });
    }

    cursor = cursor.add(1, "week");
  }

  return result;
}
