// src/features/schedule/utils/studentCardsApi.js
import { api } from "../../../utils/apiClient";

// Lấy danh sách thẻ học sinh của tutor hiện tại
export async function fetchStudentCards() {
  // BE nên trả về List<StudentCardResponse>
  return api.get("/student-cards");
}

// Tạo thẻ mới
export async function createStudentCard(payload) {
  // payload: { studentId, displayName, notes, tags, color }
  return api.post("/student-cards", payload);
}

// (sau này nếu cần)
export async function updateStudentCard(id, payload) {
  return api.put(`/student-cards/${id}`, payload);
}

export async function deleteStudentCard(id) {
  return api.del(`/student-cards/${id}`);
}
