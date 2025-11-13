// Logic chấm điểm & nhãn độ mạnh mật khẩu

export const passwordScore = (pwd = "") => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 5);
};

export const strengthLabel = (score) => {
  if (score <= 1) return { text: "Very weak", cls: "text-red-600" };
  if (score === 2) return { text: "Weak", cls: "text-orange-500" };
  if (score === 3) return { text: "Fair", cls: "text-amber-600" };
  if (score === 4) return { text: "Strong", cls: "text-green-600" };
  return { text: "Very strong", cls: "text-emerald-600" };
};

// Trả về object các điều kiện đạt/không
export const passwordChecks = (pwd = "") => ({
  len: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  digit: /\d/.test(pwd),
  special: /[^A-Za-z0-9]/.test(pwd),
});

// Tất cả điều kiện đều đạt?
export const allChecksOk = (checks) => Object.values(checks).every(Boolean);
