// src/app/routes/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import LoginRequiredModal from "../components/LoginRequiredModal";
import ClassroomHome from "../../features/classroom/pages/ClassroomHome";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [loading, user]);

  if (loading) return null;

  // Chưa đăng nhập: hiển thị trang Home + modal chồng lên
  if (!user) {
    return (
      <>
        <ClassroomHome />

        <LoginRequiredModal
          open={showPrompt}
          onClose={() => setShowPrompt(false)}
        />
      </>
    );
  }

  // Đã đăng nhập: cho vào trang được bảo vệ
  return children;
}
