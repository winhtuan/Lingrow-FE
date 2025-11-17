// src/hooks/useLogin.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import { cognitoLogin } from "../utils/cognitoAuth";
import { getSocialLoginUrl } from "../utils/cognitoHostedUi";
import { useAuth } from "../contexts/AuthContext";

export function useLogin() {
  const { setUser } = useAuth(); // dùng thật
  const [loading, setLoading] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  // Đăng nhập email/password qua Cognito (SRP)
  const handlePasswordLogin = useCallback(
    async (email, password) => {
      if (!email || !password) {
        toast.error("Please enter both email and password.");
        return;
      }

      try {
        setLoading(true);

        const { idToken, accessToken, refreshToken } = await cognitoLogin(
          email,
          password
        );

        // Lưu token
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Lấy thông tin user thật từ BE rồi đẩy vào context
        // Dùng idToken vì có đầy đủ thông tin (email, name, sub)
        const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5189/api";
        
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            console.warn("Fetch /auth/me after login failed");
          }
        } catch (err) {
          console.error("Fetch /auth/me error:", err);
        }

        toast.success("Signed in successfully.");
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Login error:", err);
        toast.error(err.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    },
    [navigate, toast, setUser]
  );

  // Đăng nhập nhanh bằng account gần đây
  const handleRecentLogin = useCallback(
    async (account) => {
      if (!account?.email || !account?.password) {
        toast.error("Saved account is invalid.");
        return;
      }

      await handlePasswordLogin(account.email, account.password);
    },
    [handlePasswordLogin, toast]
  );

  // Đăng nhập qua social (Google, Facebook, AWS...)
  const handleSocialLogin = useCallback((idpName) => {
    const url = getSocialLoginUrl(idpName);
    window.location.href = url;
  }, []);

  return {
    loading,
    selectedAcc,
    setSelectedAcc,
    handlePasswordLogin,
    handleRecentLogin,
    handleSocialLogin,
  };
}
