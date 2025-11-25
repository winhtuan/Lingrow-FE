// src/features/auth/hooks/useSocialLogin.js
import { useCallback } from "react";
import { getSocialLoginUrl } from "../utils/cognitoHostedUi";

export function useSocialLogin() {
  const loginWithSocial = useCallback((provider) => {
    const url = getSocialLoginUrl(provider);
    window.location.href = url;
  }, []);

  return { loginWithSocial };
}
