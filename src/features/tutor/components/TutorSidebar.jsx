// src/features/tutor/components/TutorSidebar.jsx
import React from "react";
import {
  LuLayoutDashboard,
  LuCalendar,
  LuBookOpen,
  LuUsers,
  LuFileText,
  LuChartBar,
  LuClipboardList,
  LuMessageCircle,
  LuCreditCard,
  LuSettings,
} from "react-icons/lu";

import Sidebar from "../../../shared/components/layout/Sidebar";

/**
 * TutorSidebar: Sidebar dành riêng cho vai trò Gia sư
 *
 * Props forward y chang Sidebar:
 * - open, onClose, collapsed, classes, activeKey
 */
const tutorMainMenu = [
  {
    key: "dashboard",
    label: "Tổng quan",
    icon: <LuLayoutDashboard className="w-5 h-5" />,
    to: "/dashboard", // ví dụ: trang tổng quan TR-06, SY-05
  },
  {
    key: "schedule",
    label: "Lịch dạy",
    icon: <LuCalendar className="w-5 h-5" />,
    to: "/schedule", // TR-02, TR-07
  },
  {
    key: "classes",
    label: "Lớp học",
    icon: <LuBookOpen className="w-5 h-5" />,
    to: "/classes", // TR-03, TR-09
  },
  {
    key: "students",
    label: "Học sinh",
    icon: <LuUsers className="w-5 h-5" />,
    to: "/students", // TR-01, TR-06
  },
  {
    key: "materials",
    label: "Tài liệu",
    icon: <LuFileText className="w-5 h-5" />,
    to: "/materials", // TR-04
  },
  {
    key: "assignments",
    label: "Bài tập & kiểm tra",
    icon: <LuClipboardList className="w-5 h-5" />,
    to: "/assignments", // TR-05, TR-08
  },
  {
    key: "community",
    label: "Cộng đồng / Chat",
    icon: <LuMessageCircle className="w-5 h-5" />,
    to: "/community", // SR-08, TR-09
  },
];

const tutorFooterMenu = [
  {
    key: "analytics",
    label: "Báo cáo & phân tích",
    icon: <LuChartBar className="w-5 h-5" />,
    to: "/analytics", // TR-06, SY-05
  },
  {
    key: "billing",
    label: "Thanh toán",
    icon: <LuCreditCard className="w-5 h-5" />,
    to: "/billing", // TR-10, SY-06
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: <LuSettings className="w-5 h-5" />,
    to: "/settings", // SY-01, SY-02, SY-03, SY-07
  },
];

export default function TutorSidebar(props) {
  const { activeKey } = props;

  return (
    <Sidebar
      {...props}
      menuItems={tutorMainMenu}
      footerItems={tutorFooterMenu}
      activeKey={activeKey}
    />
  );
}
