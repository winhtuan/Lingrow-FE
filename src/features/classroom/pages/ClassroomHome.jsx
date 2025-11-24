// src/features/classroom/pages/ClassroomHome.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

import TopBar from "../../../shared/components/layout/TopBar";
import Sidebar from "../components/Sidebar";
import CreateClassModal from "../components/CreateClassModal";

import SortSelect from "../components/controls/SortSelect";
import ViewToggle from "../components/controls/ViewToggle";
import ClassCard from "../components/ClassCard";
import ClassRow from "../components/ClassRow";
import EmptyState from "../components/EmptyState";
import SkeletonGrid from "../components/SkeletonGrid";

// --- Demo seed ---
const demoSeed = [
  {
    id: "1",
    title: "IELTS Fundamentals",
    teacher: "Minh Nguyet",
    code: "SWRT_05_2025",
    initials: "MN",
    bgImage: "https://gstatic.com/classroom/themes/img_backtoschool.jpg",
  },
  {
    id: "2",
    title: "Speaking Boost A2→B1",
    teacher: "Hà Anh",
    code: "SPK_A2_B1",
    initials: "HA",
    bgImage: "https://gstatic.com/classroom/themes/img_graduation.jpg",
  },
];

const bgPatterns = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
];

const sorters = {
  newest: (a, b) => (a._createdAt < b._createdAt ? 1 : -1),
  az: (a, b) => a.title.localeCompare(b.title, "vi"),
  teacher: (a, b) => a.teacher.localeCompare(b.teacher, "vi"),
};

export default function ClassroomHome() {
  const [query, setQuery] = useState("");
  const [classes, setClasses] = useState(() =>
    demoSeed.map((cls, i) => ({
      ...cls,
      bgPattern: bgPatterns[i % bgPatterns.length],
      _createdAt: Date.now() - i * 3600_000,
    }))
  );

  const [loading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // NEW: trạng thái mobile-drawer và desktop-collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop

  const [sortKey, setSortKey] = useState("newest");
  const [view, setView] = useState("grid");
  const searchRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = [...classes];
    if (q) {
      arr = arr.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.teacher.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );
    }
    return arr.slice().sort(sorters[sortKey]);
  }, [query, classes, sortKey]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.key === "n" || e.key === "N") && !showCreate) {
        setShowCreate(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCreate]);

  const createClass = async (payload) => {
    setCreating(true);
    try {
      const created = {
        id: crypto.randomUUID(),
        ...payload,
        initials:
          payload.initials ||
          payload.teacher?.slice(0, 2).toUpperCase() ||
          "CL",
        bgPattern: bgPatterns[Math.floor(Math.random() * bgPatterns.length)],
        _createdAt: Date.now(),
      };
      setClasses((arr) => [created, ...arr]);
    } finally {
      setCreating(false);
      setShowCreate(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900">
      <TopBar
        // mobile drawer
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        // desktop collapsed
        sidebarCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        // search & actions
        query={query}
        onQuery={setQuery}
        onOpenCreate={() => setShowCreate(true)}
        searchRef={searchRef}
      />

      <div className="flex pt-16">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          classes={classes}
          active="home"
        />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 p-5 lg:p-8">
          <div className="flex items-center justify-end gap-2 mb-5">
            <SortSelect value={sortKey} onChange={setSortKey} />
            <ViewToggle value={view} onChange={setView} />
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : filtered.length ? (
            <LayoutGroup>
              {view === "grid" ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  <AnimatePresence>
                    {filtered.map((cls) => (
                      <ClassCard key={cls.id} data={cls} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="divide-y divide-gray-200 bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <AnimatePresence>
                    {filtered.map((cls) => (
                      <ClassRow key={cls.id} data={cls} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </LayoutGroup>
          ) : (
            <EmptyState
              onClear={() => setQuery("")}
              onCreate={() => setShowCreate(true)}
            />
          )}
        </main>
      </div>

      {showCreate && (
        <CreateClassModal
          onClose={() => setShowCreate(false)}
          onSubmit={createClass}
          loading={creating}
        />
      )}
    </div>
  );
}
