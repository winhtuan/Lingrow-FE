import React from "react";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { FaAws } from "react-icons/fa";
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
    aws: (
      <div className="w-5 h-5 flex items-center justify-center bg-black rounded">
        <FaAws className="text-white w-5 h-5" />
      </div>
    ),
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
