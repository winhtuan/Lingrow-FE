// src/features/tutor/pages/TutorHomePage.jsx
import React, { useState } from "react";
import dayjs from "dayjs";

import TopBar from "../../../shared/components/layout/TopBar";
import TutorSidebar from "../components/TutorSidebar";
import { Button } from "../../../ui/index";

const demoClasses = [
  {
    id: "1",
    title: "IELTS Fundamentals",
    teacher: "Minh Nguyet",
    code: "SWRT_05_2025",
    initials: "MN",
    bgPattern: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 40%, #0369a1 100%)",
  },
  {
    id: "2",
    title: "Speaking Boost A2—B1",
    teacher: "Hà Anh",
    code: "SPK_A2_B1",
    initials: "HA",
    bgPattern: "linear-gradient(135deg, #fb7185 0%, #f97373 40%, #e11d48 100%)",
  },
];

const demoActivities = [
  {
    id: 1,
    title: "Bài tập đọc #3 đến hạn",
    classTitle: "IELTS Fundamentals",
    meta: "Hạn chót: Ngày mai, 11:59 CH",
    badge: "Sắp đến hạn",
    badgeVariant: "danger",
  },
  {
    id: 2,
    title: "Thông báo: Thay đổi lịch học",
    classTitle: "Speaking Boost A2—B1",
    meta: "Đăng 2 giờ trước",
    badge: "Mới",
    badgeVariant: "info",
  },
  {
    id: 3,
    title: "Đã chấm điểm Bài tập viết #2",
    classTitle: "IELTS Fundamentals",
    meta: "9.0 / 10",
    badge: "Đã chấm điểm",
    badgeVariant: "success",
  },
];

const demoSchedule = [
  {
    id: 1,
    classTitle: "IELTS Fundamentals",
    time: "09:00 - 10:30",
    startHour: "09:00",
    colorClass: "bg-sky-50 border-sky-200 text-sky-900",
  },
  {
    id: 2,
    classTitle: "Speaking Boost A2—B1",
    time: "14:00 - 15:00",
    startHour: "14:00",
    colorClass: "bg-rose-50 border-rose-200 text-rose-900",
  },
];

export default function TutorHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const today = dayjs();
  const weekday = today.format("dddd");
  const dateLabel = today.format("DD/MM");

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const toggleCollapse = () => setSidebarCollapsed((v) => !v);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TopBar cố định */}
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        onOpenCreate={() => {
          // sau này mở modal tạo lớp/buổi học
        }}
      />

      <div className="pt-16 flex">
        {/* Sidebar gia sư */}
        <TutorSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapse}
          activeKey="classes" // trang home cho gia sư xoay quanh lớp học
        />

        {/* Nội dung chính */}
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header chào mừng */}
            <section>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Chào mừng trở lại!
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý lớp học, lịch dạy và bài tập của bạn trong một nơi.
              </p>
            </section>

            {/* Lưới 2 cột: trái = lớp + hoạt động, phải = lịch */}
            <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-6">
              {/* Cột trái */}
              <div className="space-y-6">
                {/* Lớp học của tôi */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-900">
                      Lớp học của tôi
                    </h2>
                    <button className="text-xs font-medium text-sky-600 hover:text-sky-700">
                      Xem tất cả
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {demoClasses.map((cls) => (
                      <article
                        key={cls.id}
                        className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col"
                      >
                        <div className="h-24 bg-slate-100 flex items-center justify-center text-slate-300 text-xs">
                          Hình minh họa lớp
                        </div>
                        <div className="flex-1 p-4 flex flex-col gap-3">
                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                              {cls.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {cls.teacher}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-semibold text-white"
                                style={{ background: cls.bgPattern }}
                              >
                                {cls.initials}
                              </div>
                              <span className="text-[11px] text-slate-600">
                                {cls.code}
                              </span>
                            </div>
                            <Button
                              variant="blueSoft"
                              size="sm"
                              className="text-[11px] px-3 py-1 rounded-full"
                            >
                              Vào lớp
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Bài tập & Thông báo */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-900">
                      Bài tập & Thông báo
                    </h2>
                    <button className="text-xs font-medium text-sky-600 hover:text-sky-700">
                      Xem tất cả
                    </button>
                  </div>

                  <div className="space-y-3">
                    {demoActivities.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.classTitle} · {item.meta}
                          </p>
                        </div>
                        <span
                          className={
                            "ml-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold " +
                            (item.badgeVariant === "danger"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : item.badgeVariant === "success"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-sky-50 text-sky-700 border border-sky-200")
                          }
                        >
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cột phải: Lịch sắp tới */}
              <aside className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Lịch sắp tới
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {weekday}, {dateLabel}
                    </p>
                  </div>
                  <button className="text-xs font-medium text-sky-600 hover:text-sky-700">
                    Xem lịch
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  {demoSchedule.map((slot) => (
                    <div
                      key={slot.id}
                      className={
                        "flex flex-col gap-1 rounded-2xl border px-4 py-3 " +
                        slot.colorClass
                      }
                    >
                      <span className="text-[11px] font-medium text-slate-500">
                        {slot.startHour}
                      </span>
                      <p className="text-sm font-semibold">{slot.classTitle}</p>
                      <span className="text-xs opacity-80">{slot.time}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
