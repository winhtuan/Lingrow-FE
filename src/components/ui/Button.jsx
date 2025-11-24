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

    blue: "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800",
    red: "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700",
    green:
      "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700",

    blueSoft: "bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100",
    redSoft:
      "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
    greenSoft:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
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
