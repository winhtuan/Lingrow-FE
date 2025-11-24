// src/features/schedule/hooks/useWeekNavigation.js
import { useState, useMemo } from "react";
import dayjs from "dayjs";

export function useWeekNavigation() {
  const [weekStart, setWeekStart] = useState(
    dayjs().startOf("week").add(1, "day")
  );

  const weekLabel = useMemo(() => {
    const end = weekStart.add(6, "day");
    return `${weekStart.format("DD/MM")} – ${end.format("DD/MM/YYYY")}`;
  }, [weekStart]);

  return {
    weekStart,
    weekLabel,
    prevWeek: () => setWeekStart((w) => w.subtract(1, "week")),
    nextWeek: () => setWeekStart((w) => w.add(1, "week")),
    todayWeek: () => setWeekStart(dayjs().startOf("week").add(1, "day")),
  };
}
