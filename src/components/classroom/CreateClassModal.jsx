// src/components/classroom/CreateClassModal.jsx
import React, { useState } from "react";
import Modal from "../ui/Modal";
import TextField from "../ui/TextField";

export default function CreateClassModal({ onClose, onSubmit, loading }) {
  const [title, setTitle] = useState("");
  const [teacher, setTeacher] = useState("");
  const [code, setCode] = useState("");

  const valid = title.trim() && teacher.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSubmit({
      title: title.trim(),
      teacher: teacher.trim(),
      code: code.trim() || Math.random().toString(36).slice(2, 8).toUpperCase(),
      initials: teacher
        .trim()
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });
  };

  return (
    <Modal open onClose={onClose} title="Tạo lớp mới" widthClass="max-w-lg">
      <form onSubmit={submit} className="space-y-6">
        <TextField
          label="Tên lớp"
          value={title}
          onChange={setTitle}
          placeholder="VD: IELTS Fundamentals"
        />
        <TextField
          label="Giáo viên"
          value={teacher}
          onChange={setTeacher}
          placeholder="VD: Cô Minh Nguyệt"
        />
        <TextField
          label="Mã lớp (tùy chọn)"
          value={code}
          onChange={setCode}
          placeholder="Tự sinh nếu để trống"
        />

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!valid || loading}
            className="px-4 py-2 rounded-full bg-emerald-600 text-white disabled:opacity-50 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            {loading ? "Đang tạo…" : "Tạo lớp"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
