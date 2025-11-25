// src/features/auth/hooks/useLogin.js
import { useState, useCallback } from "react";
import { useToast } from "../../../ui/Toast";
import { usePasswordLogin } from "./usePasswordLogin";
import { useSocialLogin } from "./useSocialLogin";

export function useLogin() {
  const [selectedAcc, setSelectedAcc] = useState(null);
  const toast = useToast();

  const { loading, loginWithPassword } = usePasswordLogin();
  const { loginWithSocial } = useSocialLogin();

  const handlePasswordLogin = loginWithPassword;

  const handleRecentLogin = useCallback(
    async (account) => {
      if (!account?.email || !account?.password) {
        toast.error("Saved account is invalid.");
        return;
      }
      await loginWithPassword(account.email, account.password);
    },
    [loginWithPassword, toast]
  );

  const handleSocialLogin = loginWithSocial;

  return {
    loading,
    selectedAcc,
    setSelectedAcc,
    handlePasswordLogin,
    handleRecentLogin,
    handleSocialLogin,
  };
}
