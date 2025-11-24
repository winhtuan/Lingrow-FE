// src/ui/DateOfBirthField.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import Select from "../ui/Select";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const pad = (n) => String(n).padStart(2, "0");
const parseISO = (v) =>
  !v || !ISO_RE.test(v)
    ? { y: "", m: "", d: "" }
    : { y: +v.slice(0, 4), m: +v.slice(5, 7), d: +v.slice(8, 10) };

function daysInMonth(y, m) {
  return new Date(y || 2000, m || 1, 0).getDate();
}

export default function DateOfBirthField({
  id = "dob",
  label = "Date of birth",
  value = "",
  onChange,
  minAge = 13,
  maxAge = 100,
  className = "",
}) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const maxYear = currentYear - minAge;
  const minYear = currentYear - maxAge;

  const init = parseISO(value);
  const [y, setY] = useState(init.y);
  const [m, setM] = useState(init.m);
  const [d, setD] = useState(init.d);

  // Sync từ value -> state chỉ khi value là ISO đầy đủ
  useEffect(() => {
    if (!value || !ISO_RE.test(value)) return;
    const p = parseISO(value);
    setY(p.y);
    setM(p.m);
    setD(p.d);
  }, [value]);

  // Options
  const dayOptions = useMemo(
    () => Array.from({ length: 31 }, (_, i) => i + 1),
    []
  );
  const years = useMemo(() => {
    const arr = [];
    for (let yy = maxYear; yy >= minYear; yy--) arr.push(yy);
    return arr;
  }, [maxYear, minYear]);

  // Nếu đổi Month/Year làm Day vượt số ngày hợp lệ => clamp
  useEffect(() => {
    if (!d) return;
    const md = daysInMonth(y, m);
    if (d > md) setD(md);
  }, [y, m, d]);

  // Emit chỉ khi đủ
  const tryEmit = (ny, nm, nd) => {
    if (ny && nm && nd) {
      const md = daysInMonth(ny, nm);
      onChange?.(`${ny}-${pad(nm)}-${pad(Math.min(nd, md))}`);
    }
  };

  const hint = `You must be between ${minAge} and ${maxAge} years old.`;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        {/* calendar icon */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Calendar className="w-5 h-5" />
        </div>

        {/* compact layout */}
        <div className="pl-10 grid grid-cols-3 gap-3">
          <Select
            options={dayOptions.map((d) => ({ value: d, label: d }))}
            value={d}
            onChange={(v) => {
              setD(v);
              tryEmit(y, m, v);
            }}
            placeholder="Day"
          />
          <Select
            options={months.map((m) => ({ value: m.value, label: m.label }))}
            value={m}
            onChange={(v) => {
              setM(v);
              tryEmit(y, v, d);
            }}
            placeholder="Month"
          />
          <Select
            options={years.map((y) => ({ value: y, label: y }))}
            value={y}
            onChange={(v) => {
              setY(v);
              tryEmit(v, m, d);
            }}
            placeholder="Year"
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
