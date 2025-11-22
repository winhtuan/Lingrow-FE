// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ClassroomHome from "../pages/ClassroomHome";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ErrorPage from "../pages/ErrorPage";
import SchedulePage from "../pages/SchedulePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/" element={<ClassroomHome />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
