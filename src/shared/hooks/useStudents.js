// src/shared/hooks/useStudents.js
import { useState, useMemo, useEffect, useCallback } from "react";
import { useToast } from "../../ui/Toast";
import { useAuth } from "../../app/providers/AuthProvider";
import {
  fetchStudentCards,
  createStudentCard,
  deleteStudentCard,
} from "../../features/schedule/utils/studentCardsApi";

function mapCardToStudent(card) {
  return {
    id: card.id,
    name: card.displayName,
    note: card.notes,
    tag: card.tags,
    color: card.color || "blue",
  };
}

export function useStudents(initial = []) {
  const toast = useToast();
  const { user } = useAuth();

  const [students, setStudents] = useState(initial);
  const [studentQuery, setStudentQuery] = useState("");

  // chỉ load 1 lần khi mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cards = await fetchStudentCards();
        if (cancelled) return;

        const mapped = (cards || []).map(mapCardToStudent);
        setStudents(mapped);
      } catch (err) {
        const msg =
          err?.message ||
          "Không thể tải danh sách thẻ học sinh. Vui lòng thử lại.";
        // không cho toast vào deps nên dùng bình thường ở đây
        toast.error(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredStudents = useMemo(
    () =>
      students.filter((s) =>
        `${s.name ?? ""} ${s.note ?? ""}`
          .toLowerCase()
          .includes(studentQuery.toLowerCase())
      ),
    [students, studentQuery]
  );

  const addStudent = useCallback(
    async ({ name, note, tag, color }) => {
      if (!user?.userId) {
        toast.error("Không xác định được studentId. Vui lòng đăng nhập lại.");
        return;
      }

      try {
        const payload = {
          studentId: user.userId,
          displayName: name,
          notes: note || null,
          tags: tag || null,
          color: color || "blue",
        };

        const card = await createStudentCard(payload);
        const student = mapCardToStudent(card);

        setStudents((prev) => [...prev, student]);
        toast.success("Đã tạo thẻ học sinh");
      } catch (err) {
        const msg = err?.message || "Không thể tạo thẻ học sinh.";
        toast.error(msg);
        throw err;
      }
    },
    [user, toast]
  );

  const deleteStudent = useCallback(
    async (studentId) => {
      try {
        await deleteStudentCard(studentId);
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
        toast.success("Đã xóa thẻ học sinh");
      } catch (err) {
        const msg = err?.message || "Không thể xóa thẻ học sinh.";
        toast.error(msg);
        throw err;
      }
    },
    [toast]
  );

  return {
    students,
    filteredStudents,
    studentQuery,
    setStudentQuery,
    addStudent,
    deleteStudent,
  };
}
