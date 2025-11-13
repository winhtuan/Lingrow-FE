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

export default function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("next"); // "next" | "back"

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  // Strength & checks
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
    setStep((s) => Math.min(3, s + 1));
  };
  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Panel trái giống SignIn */}
      <AuthLeft
        brand="Plantpedia"
        heading="Create your account"
        subheading="Join Plantpedia to discover and manage your favorite plants."
        showRecent={false}
      />

      {/* Form phải */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-slate-900 text-xl font-semibold">
              Plantpedia
            </span>
          </div>

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

          <div className="mb-8">
            <Stepper step={step} />
          </div>

          {/* StepAnimator: mọi nội dung step nằm bên trong */}
          <StepAnimator step={step} direction={direction}>
            {(current) => (
              <>
                {current === 1 && (
                  <>
                    <Field
                      id="email"
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

                {current === 2 && (
                  <>
                    <Field
                      id="fullname"
                      label="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                    <DateOfBirthField
                      className="mt-4"
                      value={dateOfBirth}
                      onChange={setDateOfBirth}
                      minAge={13}
                      maxAge={100}
                    />
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
                        onClick={goNext}
                        disabled={!fullName.trim() || !dateOfBirth}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}

                {current === 3 && (
                  <>
                    <PasswordField
                      id="password"
                      label="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showForgot={false}
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
                        onClick={() =>
                          console.log("submit", {
                            email,
                            fullName,
                            dateOfBirth,
                            password,
                          })
                        }
                        disabled={!passValid}
                      >
                        Create account
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

          {/* Social */}
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
              provider="github"
              fullWidth
              size="md"
              className="rounded-full h-12"
            >
              Github
            </SocialButton>
          </div>
        </div>
      </div>
    </div>
  );
}
