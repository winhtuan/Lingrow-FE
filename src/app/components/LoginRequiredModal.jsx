// src/app/components/LoginRequiredModal.jsx
import React from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

export default function LoginRequiredModal({
  open,
  onClose,
  fallbackPath = "/",
}) {
  const navigate = useNavigate();

  const handleDismiss = () => {
    onClose?.();

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const handleLogin = () => {
    onClose?.();
    navigate("/signin");
  };

  return (
    <Modal
      open={open}
      onClose={handleDismiss} // X, overlay, Esc
      title="Yêu cầu đăng nhập"
      widthClass="max-w-md"
    >
      <div className="space-y-6">
        <p className="text-slate-600 text-sm leading-relaxed">
          Bạn cần đăng nhập để tiếp tục sử dụng tính năng này.
        </p>

        <div className="flex justify-end gap-3 pr-2 mt-6">
          <Button variant="outline" onClick={handleDismiss}>
            Hủy
          </Button>

          <Button variant="greenSoft" onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      </div>
    </Modal>
  );
}
