import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../components/ui/Field";
import PasswordField from "../components/ui/PasswordField";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import SocialButton from "../components/auth/SocialButton";
import AccountLoginModal from "../components/auth/AccountLoginModal";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import AuthLeft from "../components/auth/AuthLeft";
import { api } from "../utils/apiClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [fpOpen, setFpOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const accounts = [
    {
      id: "1",
      name: "Minh Tuan",
      shortName: "Tuan",
      email: "minh.tuan@example.com",
      avatar: "https://placehold.co/400",
    },
  ];

  // Đăng nhập bằng form bên phải
  async function handleLoginForm() {
    try {
      const res = await api.post("/auth/login", {
        UsernameOrEmail: email.trim(),
        Password: password,
      });
      // res.user => { userId, username, email, role }
      localStorage.setItem("auth_user", JSON.stringify(res?.user ?? res));
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (e) {
      if (e.status === 401) toast.error("Invalid credentials.");
      else if (e.status === 404) toast.error("User not found.");
      else if (e.status === 423) toast.error(e.message || "Account locked.");
      else toast.error(e.message || "Login failed.");
    }
  }

  // Đăng nhập qua modal Recent Account
  const handleLoginRecent = async (pwd, remember) => {
    try {
      // TODO: call API: await api.login({ usernameOrEmail: selectedAcc.email, password: pwd, remember })
      setSelectedAcc(null);
      toast.success("Signed in successfully!");
    } catch (e) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <AuthLeft
        brand="Plantpedia"
        accounts={accounts}
        onRemove={(id) => console.log("remove recent", id)}
        onAddNew={() => console.log("add new recent")}
        onSelect={setSelectedAcc}
      />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in stagger-1">
          {/* Mobile logo */}
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

          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />

          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showForgot
            onForgot={() => setFpOpen(true)}
          />

          <ForgotPasswordModal
            open={fpOpen}
            onClose={() => setFpOpen(false)}
            defaultEmail={email}
            onResetSuccess={() => {
              setFpOpen(false);
            }}
          />

          <Button onClick={handleLoginForm} fullWidth size="md">
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

          {/* Social (ngang – bằng nhau) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-6">
            <SocialButton provider="google" fullWidth size="sm">
              Google
            </SocialButton>
            <SocialButton provider="facebook" fullWidth size="sm">
              Facebook
            </SocialButton>
            <SocialButton provider="github" fullWidth size="sm">
              Github
            </SocialButton>
          </div>

          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button
              className="text-slate-900 font-semibold hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>

          {/* Modal đăng nhập nhanh giống Facebook */}
          <AccountLoginModal
            open={!!selectedAcc}
            account={selectedAcc}
            onClose={() => setSelectedAcc(null)}
            onSubmit={handleLoginRecent}
          />
        </div>
      </div>
    </div>
  );
}
