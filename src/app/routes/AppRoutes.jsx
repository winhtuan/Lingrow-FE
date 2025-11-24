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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route path="/schedule" element={<SchedulePage />} />
      {/* <Route path="/error" element={<ErrorPage />} /> */}

      <Route path="/" element={<ClassroomHome />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
