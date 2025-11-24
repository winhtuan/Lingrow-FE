// src/features/schedule/hooks/usePinnedMove.js
import { useState, useCallback } from "react";

export function usePinnedMove({ moveSingleLesson, movePinnedSeries, toast }) {
  const [pendingPinnedMove, setPendingPinnedMove] = useState(null);

  // gọi khi kéo 1 lesson pinned sang slot mới -> mở dialog
  const requestPinnedMove = useCallback((lesson, targetHour, targetDate) => {
    setPendingPinnedMove({
      lessonId: lesson.id,
      sourceLesson: lesson,
      targetHour,
      targetDate,
    });
  }, []);

  // handler cho dialog – chỉ đổi buổi này
  const handlePinnedMoveOnlyThis = useCallback(() => {
    if (!pendingPinnedMove) return;
    const { lessonId, targetHour, targetDate } = pendingPinnedMove;

    moveSingleLesson(lessonId, targetHour, targetDate, { pinned: false });
    setPendingPinnedMove(null);
    toast?.success?.("Đã đổi lịch cho buổi này");
  }, [pendingPinnedMove, moveSingleLesson, toast]);

  // handler cho dialog – đổi cả chuỗi
  const handlePinnedMoveSeries = useCallback(() => {
    if (!pendingPinnedMove) return;
    const { sourceLesson, targetHour, targetDate } = pendingPinnedMove;

    movePinnedSeries(sourceLesson, targetHour, targetDate);
    setPendingPinnedMove(null);
    toast?.success?.("Đã đổi lịch cho cả chuỗi buổi học");
  }, [pendingPinnedMove, movePinnedSeries, toast]);

  const cancelPinnedMove = useCallback(() => {
    setPendingPinnedMove(null);
  }, []);

  return {
    pendingPinnedMove,
    requestPinnedMove,
    handlePinnedMoveOnlyThis,
    handlePinnedMoveSeries,
    cancelPinnedMove,
  };
}
