// src/features/auth/hooks/useLogout.js
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToast } from "../../../ui/Toast";

const domain = process.env.REACT_APP_COGNITO_DOMAIN;
const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
const logoutRedirectUri =
  process.env.REACT_APP_COGNITO_LOGOUT_REDIRECT_URI || window.location.origin;

export function useLogout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const clearLocalSession = useCallback(() => {
    // Xóa token lưu ở FE
    localStorage.removeItem("idToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, [setUser]);

  const logout = useCallback(
    ({
      redirectTo = "/signin",
      logoutFromCognito = true,
      withToast = true,
    } = {}) => {
      // Xóa session phía FE
      clearLocalSession();

      if (withToast) {
        toast.info("Bạn đã đăng xuất.");
      }

      // Nếu cấu hình đầy đủ, gọi luôn logout của Cognito Hosted UI
      if (logoutFromCognito && domain && clientId) {
        const url = new URL(`${domain}/logout`);
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("logout_uri", logoutRedirectUri);
        window.location.href = url.toString();
        return;
      }

      // Fallback: chỉ redirect trong app
      navigate(redirectTo, { replace: true });
    },
    [clearLocalSession, navigate, toast]
  );

  return { logout };
}
