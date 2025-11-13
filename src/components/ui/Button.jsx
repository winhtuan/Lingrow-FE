export default function Button({
  children,
  variant = "primary",
  size = "sm", // sm | md | lg
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  ...rest
}) {
  // chỉ giữ data-/aria- prop để không rơi prop lạ xuống DOM
  const passthrough = Object.fromEntries(
    Object.entries(rest).filter(
      ([k]) => k.startsWith("data-") || k.startsWith("aria-")
    )
  );

  const base =
    "rounded-lg font-medium transition duration-200 active:scale-[0.98]";
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3",
    lg: "px-5 py-4 text-base",
  };
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "border border-slate-200 text-slate-700 hover:bg-slate-50 bg-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...passthrough}
    >
      {children}
    </button>
  );
}
