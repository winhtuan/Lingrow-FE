import React from "react";
import { motion } from "framer-motion";
import { LuBookmark, LuEllipsisVertical } from "react-icons/lu";

export default function ClassCard({ data }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.7 }}
      className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <div
        className="relative h-28 overflow-hidden"
        style={{ background: data.bgPattern }}
      >
        <img
          src={data.bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
        <div className="relative h-full p-4 flex flex-col justify-end">
          <h3 className="text-white font-semibold text-lg line-clamp-2 drop-shadow">
            {data.title}
          </h3>
        </div>
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-black/0 hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Tùy chọn"
        >
          <LuEllipsisVertical className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{data.teacher}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full grid place-items-center text-white text-xs font-semibold"
              style={{ background: data.bgPattern }}
            >
              {data.initials}
            </div>
            <span className="text-xs text-gray-500">{data.code}</span>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            title="Lưu lớp"
          >
            <LuBookmark className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
