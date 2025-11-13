import React from "react";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook, SiGithub } from "react-icons/si";
import Button from "../ui/Button";

export default function SocialButton({
  provider = "google",
  children,
  onClick,
  size = "sm",
  fullWidth = false,
  className = "",
}) {
  const icons = {
    google: <FcGoogle className="w-5 h-5" />,
    facebook: <SiFacebook className="w-5 h-5 text-[#1877F2]" />,
    github: <SiGithub className="w-5 h-5 text-slate-800" />,
  };

  const IconElm = icons[provider] ?? null;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label={`Continue with ${provider}`}
    >
      {IconElm}
      <span className="font-medium">{children}</span>
    </Button>
  );
}
