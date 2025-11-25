// src/app/components/LoginRequiredModal.jsx
import React from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yêu cầu đăng nhập"
      widthClass="max-w-md"
      overlayClass="backdrop-blur-[2px] bg-black/20"
    >
      <div className="space-y-6">
        <p className="text-slate-600 text-sm leading-relaxed">
          Bạn cần đăng nhập để tiếp tục sử dụng tính năng này.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              onClose?.();
              navigate("/home");
            }}
          >
            Hủy
          </Button>

          <Button
            variant="greenSoft"
            onClick={() => {
              onClose?.();
              navigate("/signin");
            }}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </Modal>
  );
}
