// src/features/auth/hooks/usePasswordLogin.js
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../ui/Toast";
import { useAuth } from "../../../app/providers/AuthProvider";
import { cognitoLogin } from "../utils/cognitoAuth";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5189/api";

export function usePasswordLogin() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const loginWithPassword = useCallback(
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

        localStorage.setItem("idToken", idToken);
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${idToken}` },
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

  return { loading, loginWithPassword };
}
