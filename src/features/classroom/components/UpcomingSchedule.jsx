import React from "react";

export default function UpcomingSchedule() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Lịch sắp tới
      </h2>

      <p className="text-sm text-gray-500 mb-4">Thứ Ba, 25/11</p>

      <div className="flex flex-col gap-6 text-sm">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 w-[2px] h-full bg-sky-300" />
          <p className="text-gray-500">9:00</p>
          <div className="mt-1 bg-sky-50 border border-sky-200 rounded-lg p-3">
            <h4 className="font-semibold text-sky-900">IELTS Fundamentals</h4>
            <p className="text-xs text-sky-700">9:00 - 10:30</p>
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-0 top-0 w-[2px] h-full bg-rose-300" />
          <p className="text-gray-500">14:00</p>
          <div className="mt-1 bg-rose-50 border border-rose-200 rounded-lg p-3">
            <h4 className="font-semibold text-rose-900">
              Speaking Boost A2—B1
            </h4>
            <p className="text-xs text-rose-700">14:00 - 15:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
