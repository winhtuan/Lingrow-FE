import { useState, useMemo } from "react";
import { useToast } from "../components/ui/Toast";

export function useStudents(initial = []) {
  const toast = useToast();

  const [students, setStudents] = useState(initial);
  const [studentQuery, setStudentQuery] = useState("");

  const filteredStudents = useMemo(
    () =>
      students.filter((s) =>
        `${s.name ?? ""} ${s.note ?? ""}`
          .toLowerCase()
          .includes(studentQuery.toLowerCase())
      ),
    [students, studentQuery]
  );

  const addStudent = ({ name, note, tag, color }) => {
    const id = `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setStudents((prev) => [
      ...prev,
      {
        id,
        name,
        note,
        tag: tag || null,
        color: color || "blue",
      },
    ]);

    toast.success("Đã tạo thẻ học sinh");
  };

  return {
    students,
    filteredStudents,
    studentQuery,
    setStudentQuery,
    addStudent,
  };
}
