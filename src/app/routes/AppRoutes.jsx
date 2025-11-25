// src/app/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// AUTH
import LoginPage from "../../features/auth/pages/LoginPage";
import SignUpPage from "../../features/auth/pages/SignUpPage";
import AuthCallbackPage from "../../features/auth/pages/AuthCallbackPage";
import VerifyEmailPage from "../../features/auth/pages/VerifyEmailPage";
// CLASSROOM
import ClassroomHome from "../../features/classroom/pages/ClassroomHome";
// SCHEDULE
import SchedulePage from "../../features/schedule/pages/SchedulePage";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Guest only */}
      <Route
        path="/signin"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignUpPage />
          </GuestRoute>
        }
      />

      {/* Callback: thường để public, vì nó sẽ tự xử lý token rồi setUser */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Cần đăng nhập */}
      <Route
        path="/verify-email"
        element={
          <ProtectedRoute>
            <VerifyEmailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        }
      />

      <Route path="/home" element={<ClassroomHome />} />
      <Route path="/" element={<ClassroomHome />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
