// src/features/classroom/components/ClassCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { LuBookmark, LuEllipsisVertical } from "react-icons/lu";

export default function ClassRow({ data }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-4 p-4 hover:bg-gray-50"
    >
      <div
        className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0"
        style={{ background: data.bgPattern }}
      >
        <img
          src={data.bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{data.title}</h3>
          <span className="text-xs text-gray-500">{data.code}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{data.teacher}</p>
      </div>

      <button className="p-2 rounded-full hover:bg-gray-100" title="Lưu lớp">
        <LuBookmark className="w-5 h-5 text-gray-600" />
      </button>
      <button className="p-2 rounded-full hover:bg-gray-100" title="Tùy chọn">
        <LuEllipsisVertical className="w-5 h-5 text-gray-600" />
      </button>
    </motion.div>
  );
}
