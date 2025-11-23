import { useState, useMemo } from "react";
import { useToast } from "../components/ui/Toast";

export function useStudents(initial = []) {
  const toast = useToast();

  const [students, setStudents] = useState(initial);
  const [studentQuery, setStudentQuery] = useState("");

  const filteredStudents = useMemo(
    () =>
      students.filter((s) =>
        `${s.name} ${s.note ?? ""}`
          .toLowerCase()
          .includes(studentQuery.toLowerCase())
      ),
    [students, studentQuery]
  );

  const addStudent = ({ name, note, tag, color }) => {
    setStudents((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
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
