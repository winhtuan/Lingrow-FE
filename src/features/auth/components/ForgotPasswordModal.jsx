import React, { useState } from "react";
import Modal from "../../../ui/Modal";
import Field from "../../../ui/Field";
import PasswordField from "./PasswordField";
import Button from "../../../ui/Button";
import OtpInput from "./OtpInput";
import { useToast } from "../../../ui/Toast";
import {
  passwordScore,
  strengthLabel,
  passwordChecks,
  allChecksOk,
} from "../../../utils/passwordStrength";
import { StrengthBar, Requirement } from "./PasswordStrength";

export default function ForgotPasswordModal({
  open,
  onClose,
  defaultEmail = "",
  onResetSuccess,
}) {
  const toast = useToast();

  const [step, setStep] = useState(1); // 1: email, 2: code, 3: reset
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const codeValid = code.length === 6;

  // Strength & checks
  const score = passwordScore(password);
  const checks = passwordChecks(password);
  const label = strengthLabel(score);

  // Hợp lệ khi đáp ứng đủ policy + confirm khớp
  const passValid =
    allChecksOk(checks) && password === confirm && password.length > 0;

  // Reset all when modal opens
  React.useEffect(() => {
    if (open) {
      setStep(1);
      setLoading(false);
      setCode("");
      setPassword("");
      setConfirm("");
    }
  }, [open]);

  // Refocus an toàn sau render nếu caret bị mất
  const safeRefocus = (id) => {
    // double RAF đảm bảo DOM commit xong
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el && document.activeElement !== el) el.focus();
      })
    );
  };

  const sendEmail = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      toast.info("We sent a 6-digit code to your email.");
      setStep(2);
    } catch {
      toast.error("Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setStep(3);
      // auto focus ô password khi vào step 3
      safeRefocus("new-password");
    } catch {
      toast.error("Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      toast.success("Password reset successfully!");
      onClose?.();
      onResetSuccess?.(email);
    } catch {
      toast.error("Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => (!loading ? onClose?.() : null)}
      title="Forgot password"
      description={
        step === 1
          ? "Enter your email to receive a verification code."
          : step === 2
          ? "Enter the 6-digit code we sent to your email."
          : "Create a new password for your account."
      }
    >
      <div className="[&_[aria-label*='password']]:cursor-pointer">
        {/* Step 1: Email */}
        {step === 1 && (
          <div className="space-y-4">
            <Field
              id="fp-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && emailValid && !loading) sendEmail();
              }}
              placeholder="name@company.com"
              autoFocus
            />
            <Button
              onClick={sendEmail}
              fullWidth
              size="md"
              disabled={!emailValid || loading}
            >
              {loading ? "Sending..." : "Send code"}
            </Button>
          </div>
        )}

        {/* Step 2: Code */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Verification code
              </label>
              <OtpInput
                value={code}
                onChange={setCode}
                onComplete={(completedCode) => {
                  if (completedCode.length === 6) {
                    verifyCode();
                  }
                }}
              />
              <p className="mt-2 text-xs text-slate-500">
                Didn't get the code{" "}
                <button
                  className="underline hover:text-slate-900"
                  onClick={sendEmail}
                  disabled={loading}
                >
                  Resend
                </button>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                className="rounded-full px-6"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                size="md"
                className="rounded-full px-6"
                onClick={verifyCode}
                disabled={!codeValid || loading}
              >
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: New password */}
        {step === 3 && (
          <div className="space-y-4">
            {/* New password */}
            <div>
              <PasswordField
                id="new-password"
                label="New password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.replace(/\s/g, ""));
                  safeRefocus("new-password");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && passValid && !loading)
                    resetPassword();
                }}
                showForgot={false}
                autoComplete="new-password"
                autoFocus
              />

              {/* Strength meter (luôn chiếm chỗ để tránh layout shift) */}
              <div className="flex items-center justify-between mt-1.5">
                <span
                  className={`text-xs font-medium ${
                    password.length > 0 ? label.cls : "text-transparent"
                  }`}
                >
                  {password.length > 0 ? label.text : "Placeholder"}
                </span>
              </div>
              <StrengthBar score={score} />

              {/* Requirements checklist */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                <Requirement ok={checks.len}>8+ characters</Requirement>
                <Requirement ok={checks.digit}>Contains number</Requirement>
                <Requirement ok={checks.upper}>Uppercase letter</Requirement>
                <Requirement ok={checks.special}>Special character</Requirement>
                <Requirement ok={checks.lower}>Lowercase letter</Requirement>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <PasswordField
                id="confirm-password"
                label="Confirm password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value.replace(/\s/g, ""));
                  safeRefocus("confirm-password");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && passValid && !loading)
                    resetPassword();
                }}
                showForgot={false}
                autoComplete="new-password"
              />
              {confirm.length > 0 && (
                <p
                  className={`text-xs mt-1.5 font-medium ${
                    password === confirm ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {password === confirm
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                className="rounded-full px-6"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                size="md"
                className="rounded-full px-6 flex-1"
                onClick={resetPassword}
                disabled={!passValid || loading}
              >
                {loading ? "Saving..." : "Reset password"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
