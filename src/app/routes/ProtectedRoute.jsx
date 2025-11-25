// src/app/routes/ProtectedRoute.jsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import ClassroomHome from "../../features/classroom/pages/ClassroomHome";
import LoginRequiredModal from "../components/LoginRequiredModal";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  const initializedRef = useRef(false);
  const initialUserRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    // Ghi lại trạng thái user lần đầu tiên sau khi load xong
    if (!initializedRef.current) {
      initializedRef.current = true;
      initialUserRef.current = user; // null nếu ngay từ đầu đã là guest
    }

    if (!user) {
      if (initialUserRef.current == null) {
        // Case 1: ngay từ đầu đã không có user -> guest vào thẳng route bảo vệ
        setShowPrompt(true); // show modal "Yêu cầu đăng nhập"
      } else {
        // Case 2: ban đầu có user, giờ user = null -> đang logout
        setShowPrompt(false); // không show modal
      }
    } else {
      // Có user -> không cần modal
      setShowPrompt(false);
    }
  }, [user, loading]);

  if (loading) return null;

  // Chưa login
  if (!user) {
    if (!showPrompt) {
      // Trường hợp logout: không render gì ở ProtectedRoute,
      // để navigate() trong useLogout xử lý chuyển trang
      return null;
    }

    // Guest nhảy thẳng vào /schedule, /verify-email, ...
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

  // Đã login
  return children;
}
