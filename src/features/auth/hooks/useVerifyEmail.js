// src/features/auth/hooks/useVerifyEmail.js
import { useState, useCallback } from "react";
import { useToast } from "../../../ui/Toast";
import { cognitoConfirmSignUp } from "../utils/cognitoAuth";

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleConfirmEmail = useCallback(
    async (email, code) => {
      if (!email || !code) {
        toast.error("Please enter both email and verification code.");
        return;
      }

      try {
        setLoading(true);
        await cognitoConfirmSignUp(email, code);
        toast.success("Email verified successfully. You can now sign in.");
        return true;
      } catch (err) {
        console.error("Confirm sign up error:", err);
        toast.error(err.message || "Verification failed.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, handleConfirmEmail };
}
