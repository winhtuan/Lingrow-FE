// src/features/auth/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../ui/Button";
import { useToast } from "../../../ui/Toast";

function parseJwt(token) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded;
  } catch {
    return null;
  }
}

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");

    if (!idToken) {
      toast.error("Session expired. Please sign in again.");
      navigate("/signin", { replace: true });
      return;
    }

    const payload = parseJwt(idToken);
    if (!payload) {
      toast.error("Invalid session. Please sign in again.");
      navigate("/signin", { replace: true });
      return;
    }

    const emailFromToken = payload.email || "";
    const verified = Boolean(
      payload.email_verified ?? payload["custom:email_verified"]
    );

    setEmail(emailFromToken);
    setEmailVerified(verified);
    setLoading(false);
  }, [navigate, toast]);

  const handleContinue = () => {
    toast.success("Signed in successfully.");
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">Checking your email status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl shadow-sm px-8 py-10 max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Verify your email
        </h1>

        {email && (
          <p className="text-sm text-slate-600 mb-6">
            We are using the email{" "}
            <span className="font-semibold text-slate-900">{email}</span> for
            your account.
          </p>
        )}

        {emailVerified ? (
          <>
            <p className="text-sm text-emerald-600 mb-6">
              Your email is already verified. You can continue to your
              classroom.
            </p>
            <Button fullWidth size="md" onClick={handleContinue}>
              Continue to home
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-4">
              Your email is not marked as verified in your identity provider.
              Please make sure your account email is active.
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Once you are ready, click the button below to continue.
            </p>
            <Button fullWidth size="md" onClick={handleContinue}>
              Continue to home
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
