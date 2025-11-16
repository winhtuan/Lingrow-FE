// src/hooks/useSignUp.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import {
  cognitoSignUp,
  cognitoConfirmSignUp,
  cognitoLogin,
} from "../utils/cognitoAuth";
import { api } from "../utils/apiClient";
import { passwordChecks, allChecksOk } from "../utils/passwordStrength";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Create account (Cognito signup)
  const handleCreateAccount = useCallback(
    async ({ email, fullName, dateOfBirth, password }) => {
      const emailValid = emailRegex.test(email);
      const checks = passwordChecks(password);
      const passValid = allChecksOk(checks);

      if (!emailValid) {
        toast.error("Please enter a valid email.");
        return false;
      }
      if (!fullName.trim()) {
        toast.error("Please enter your full name.");
        return false;
      }
      if (!dateOfBirth) {
        toast.error("Please select your date of birth.");
        return false;
      }
      if (!passValid) {
        toast.error("Password does not meet requirements.");
        return false;
      }

      setLoading(true);
      try {
        await cognitoSignUp(
          email.trim(),
          password,
          fullName.trim(),
          dateOfBirth
        );
        toast.info("Verification code sent to your email!");
        return true;
      } catch (err) {
        toast.error(err.message || "Signup failed.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Confirm OTP + login + sync DB
  const handleConfirmOTP = useCallback(
    async ({ email, password, otpCode }) => {
      if (!otpCode.trim()) {
        toast.error("Please enter the verification code.");
        return false;
      }

      setLoading(true);
      try {
        // 1. Confirm OTP
        await cognitoConfirmSignUp(email.trim(), otpCode.trim());

        // Delay for Cognito activation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 2. Login to get tokens
        const tokens = await cognitoLogin(email.trim(), password);

        // 3. Save tokens
        localStorage.setItem("idToken", tokens.idToken);
        localStorage.setItem("access_token", tokens.idToken);
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        // 4. Sync user into DB
        await api.get("/auth/me");

        toast.success("Account verified successfully!");
        navigate("/signin");

        return true;
      } catch (err) {
        toast.error(err.message || "Verification failed.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast, navigate]
  );

  return { loading, handleCreateAccount, handleConfirmOTP };
}
