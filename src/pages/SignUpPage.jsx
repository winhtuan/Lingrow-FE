// src/pages/SignUpPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLeft from "../components/auth/AuthLeft";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import PasswordField from "../components/ui/PasswordField";
import SocialButton from "../components/auth/SocialButton";
import DateOfBirthField from "../components/ui/DateOfBirthField";
import StepAnimator from "../components/motion/StepAnimator";
import Stepper from "../components/ui/Stepper";
import {
  passwordScore,
  strengthLabel,
  passwordChecks,
  allChecksOk,
} from "../utils/passwordStrength";
import { StrengthBar, Requirement } from "../components/ui/PasswordStrength";
import { useSignUp } from "../hooks/useSignUp";

export default function SignUpPage() {
  const navigate = useNavigate();

  // Step states
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("next");

  // Form states
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Hook xử lí signup
  const { loading, handleCreateAccount, handleConfirmOTP } = useSignUp();

  // Password checks (cho UI)
  const score = passwordScore(password);
  const checks = passwordChecks(password);
  const label = strengthLabel(score);
  const passValid = allChecksOk(checks);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  const goNext = () => {
    setDirection("next");
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(1, s - 1));
  };

  // Handler click cho nút Create account (gọi hook rồi chuyển step)
  const onCreateAccountClick = async () => {
    const ok = await handleCreateAccount({
      email,
      fullName,
      dateOfBirth,
      password,
    });
    if (ok) {
      goNext();
    }
  };

  // Handler click cho nút Confirm OTP
  const onConfirmOTPClick = () => {
    return handleConfirmOTP({
      email,
      password,
      otpCode,
    });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <AuthLeft
        brand="Lingrow"
        heading="Create your account"
        subheading="Join Lingrow to discover and manage your favorite plants."
        showRecent={false}
      />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-slate-900 text-xl font-semibold">
              Lingrow
            </span>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create an account
          </h2>
          <p className="text-slate-500 mb-8">
            Already have an account?{" "}
            <button
              className="text-slate-900 font-semibold hover:underline"
              onClick={() => navigate("/signin")}
            >
              Log in
            </button>
          </p>

          {/* Stepper */}
          <div className="mb-8">
            <Stepper step={step} total={4} />
          </div>

          <StepAnimator step={step} direction={direction}>
            {(current) => (
              <>
                {/* Step 1: Email */}
                {current === 1 && (
                  <>
                    <Field
                      id="signup-email"
                      label="What’s your email?"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                    <Button
                      onClick={goNext}
                      size="lg"
                      fullWidth
                      className={`rounded-full mt-4 ${
                        emailValid ? "" : "!bg-slate-300 cursor-not-allowed"
                      }`}
                      disabled={!emailValid}
                    >
                      Next
                    </Button>
                  </>
                )}

                {/* Step 2: Basic info */}
                {current === 2 && (
                  <>
                    <div className="col-span-4">
                      <Field
                        id="signup-fullname"
                        label="Your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Date of birth ở dưới, full width */}
                    <DateOfBirthField
                      id="signup-dob"
                      value={dateOfBirth}
                      onChange={setDateOfBirth}
                      minAge={13}
                      maxAge={100}
                    />

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="md"
                        className="rounded-full px-6"
                        onClick={goBack}
                      >
                        Back
                      </Button>

                      <Button
                        size="md"
                        className="rounded-full px-6"
                        onClick={goNext}
                        disabled={!fullName.trim() || !dateOfBirth}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Password */}
                {current === 3 && (
                  <>
                    <PasswordField
                      id="signup-password"
                      label="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showForgot={false}
                    />
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
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                      <Requirement ok={checks.len}>8+ characters</Requirement>
                      <Requirement ok={checks.digit}>
                        Contains number
                      </Requirement>
                      <Requirement ok={checks.upper}>
                        Uppercase letter
                      </Requirement>
                      <Requirement ok={checks.special}>
                        Special character
                      </Requirement>
                      <Requirement ok={checks.lower}>
                        Lowercase letter
                      </Requirement>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="md"
                        className="rounded-full px-6"
                        onClick={goBack}
                      >
                        Back
                      </Button>
                      <Button
                        size="md"
                        className="rounded-full px-6"
                        onClick={onCreateAccountClick}
                        disabled={!passValid}
                        loading={loading}
                      >
                        Create account
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 4: OTP Confirmation */}
                {current === 4 && (
                  <>
                    <Field
                      id="signup-otp"
                      label="Enter the verification code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter code sent to your email"
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      A 6-digit code has been sent to{" "}
                      <b>{email || "your email"}</b>. Please check your inbox.
                    </p>

                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="md"
                        className="rounded-full px-6"
                        onClick={goBack}
                      >
                        Back
                      </Button>
                      <Button
                        size="md"
                        className="rounded-full px-6"
                        onClick={onConfirmOTPClick}
                        disabled={!otpCode.trim()}
                        loading={loading}
                      >
                        Confirm
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </StepAnimator>

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

          {/* Social Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SocialButton
              provider="google"
              fullWidth
              size="md"
              className="rounded-full h-12"
            >
              Google
            </SocialButton>
            <SocialButton
              provider="facebook"
              fullWidth
              size="md"
              className="rounded-full h-12"
            >
              Facebook
            </SocialButton>
            <SocialButton
              provider="aws"
              fullWidth
              size="md"
              className="rounded-full h-12"
            >
              Amazon
            </SocialButton>
          </div>
        </div>
      </div>
    </div>
  );
}
