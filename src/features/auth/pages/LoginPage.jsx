// src/features/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Field from "../../../ui/Field";
import PasswordField from "../components/PasswordField";
import Button from "../../../ui/Button";
import { useToast } from "../../../ui/Toast";

import SocialButton from "../components/SocialButton";
import AccountLoginModal from "../components/AccountLoginModal";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import AuthLeft from "../components/AuthLeft";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fpOpen, setFpOpen] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const {
    loading,
    selectedAcc,
    setSelectedAcc,
    handlePasswordLogin,
    handleRecentLogin,
    handleSocialLogin,
  } = useLogin();

  const accounts = [
    {
      id: "1",
      name: "Minh Tuan",
      shortName: "Tuan",
      email: "minh.tuan@example.com",
      avatar: "https://placehold.co/400",
    },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Panel bên trái */}
      <AuthLeft
        brand="Lingrow"
        accounts={accounts}
        onRemove={(id) => console.log("remove recent", id)}
        onAddNew={() => console.log("add new recent")}
        onSelect={setSelectedAcc}
      />

      {/* Panel bên phải */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in stagger-1">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-slate-900 text-xl font-semibold">
              LoginHub
            </span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h2>
          <p className="text-slate-500 mb-10">
            Enter your credentials to continue
          </p>

          {/* Email */}
          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />

          {/* Password */}
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showForgot
            onForgot={() => setFpOpen(true)}
          />

          {/* Modal quên mật khẩu */}
          <ForgotPasswordModal
            open={fpOpen}
            onClose={() => setFpOpen(false)}
            defaultEmail={email}
            onResetSuccess={() => {
              setFpOpen(false);
              toast.info("Password reset email has been sent.");
            }}
          />

          {/* Nút đăng nhập */}
          <Button
            onClick={() => handlePasswordLogin(email, password)}
            fullWidth
            size="md"
            loading={loading}
          >
            Sign in
          </Button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-6">
            <SocialButton
              provider="google"
              fullWidth
              size="sm"
              onClick={() => handleSocialLogin("Google")}
            >
              Google
            </SocialButton>
            <SocialButton
              provider="facebook"
              fullWidth
              size="sm"
              onClick={() => handleSocialLogin("Facebook")}
            >
              Facebook
            </SocialButton>
            <SocialButton
              provider="aws"
              fullWidth
              size="sm"
              onClick={() => handleSocialLogin("AWS")}
            >
              Amazon
            </SocialButton>
          </div>

          {/* Link sang signup */}
          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button
              className="text-slate-900 font-semibold hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>

          {/* Modal đăng nhập nhanh bằng account gần đây */}
          <AccountLoginModal
            open={!!selectedAcc}
            account={selectedAcc}
            onClose={() => setSelectedAcc(null)}
            onSubmit={handleRecentLogin}
          />
        </div>
      </div>
    </div>
  );
}
