// src/features/schedule/components/CreateStudentModal.jsx
import React from "react";
import Modal from "../../../ui/Modal";
import TextField from "../../../ui/TextField";
import Button from "../../../ui/Button";
import Select from "../../../ui/Select";

export default function CreateStudentModal({
  open,
  onClose,
  newName,
  setNewName,
  newNote,
  setNewNote,
  newTag,
  setNewTag,
  onSubmit,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tạo thẻ học sinh"
      widthClass="max-w-lg"
    >
      <div className="space-y-4">
        <TextField
          id="student-name"
          label="Tên học sinh"
          value={newName}
          onChange={setNewName}
          placeholder="Nhập tên học sinh"
        />

        <TextField
          id="student-note"
          label="Ghi chú"
          value={newNote}
          onChange={setNewNote}
          placeholder="VD: Ielts, Toeic..."
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tag
            </label>
            <Select
              value={newTag}
              onChange={setNewTag}
              placeholder="Chọn tag"
              options={[
                { value: "eng", label: "Tiếng Anh" },
                { value: "code", label: "Tin Học" },
                { value: "math", label: "Toán Học" },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Hủy
          </Button>

          <Button onClick={onSubmit} className="text-sm">
            Lưu thẻ
          </Button>
        </div>
      </div>
    </Modal>
  );
}
