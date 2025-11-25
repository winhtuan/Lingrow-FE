// src/features/auth/pages/AuthCallbackPage.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../ui/Toast";

const RAW_BASE = (process.env.REACT_APP_API_BASE_URL ?? "").trim();
const API_BASE = RAW_BASE === "" ? "/api" : RAW_BASE;

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");
    const idToken = params.get("id_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken && !idToken) {
      toast.error("Social login failed. Please try again.");
      navigate("/signin", { replace: true });
      return;
    }

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (idToken) {
      localStorage.setItem("idToken", idToken);
    }
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    const syncUser = async () => {
      try {
        const bearer = idToken || accessToken;

        const res = await fetch(`${API_BASE.replace(/\/+$/, "")}/auth/me`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${bearer}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          navigate("/error", {
            replace: true,
            state: {
              error: {
                status: res.status,
                message: text || "Sync user failed.",
              },
            },
          });
          return;
        }

        // ok thì về home
        navigate("/", { replace: true });
      } catch (e) {
        navigate("/error", {
          replace: true,
          state: { error: e },
        });
      }
    };

    syncUser();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-slate-600">Signing you in, please wait...</p>
    </div>
  );
}
