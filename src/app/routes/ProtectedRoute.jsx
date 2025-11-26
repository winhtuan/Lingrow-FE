// src/app/routes/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import ClassroomHome from "../../features/classroom/pages/ClassroomHome";
import LoginRequiredModal from "../components/LoginRequiredModal";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  // Khi không còn loading và chưa có user => show modal yêu cầu đăng nhập
  useEffect(() => {
    if (loading) return;

    if (!user) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [user, loading]);

  // Đang load thông tin user -> chưa biết login hay chưa
  if (loading) return null;

  // Chưa login -> hiển thị ClassroomHome + modal yêu cầu đăng nhập
  if (!user) {
    return (
      <>
        <ClassroomHome />
        <LoginRequiredModal
          open={showPrompt}
          onClose={() => setShowPrompt(false)}
          fallbackPath="/home"
        />
      </>
    );
  }

  // Đã login -> render route được bảo vệ
  return children;
}
