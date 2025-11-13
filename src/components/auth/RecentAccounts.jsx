import React from "react";
import { X } from "lucide-react";

export default function RecentAccounts({
  items = [],
  onRemove = () => {},
  onAddNew = () => {},
  onSelect = () => {},
}) {
  return (
    <div className="animate-slide-in stagger-3">
      <h3 className="text-white text-sm font-semibold mb-6 uppercase tracking-wider">
        Recent Accounts
      </h3>
      <div className="flex gap-4">
        {items.map((u) => (
          <div
            key={u.id}
            className="group cursor-pointer"
            onClick={() => onSelect(u)}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-slate-700 group-hover:ring-white transition-all duration-300">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <button
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(u.id)}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
            <p className="text-slate-300 text-xs mt-2 text-center font-medium">
              {u.shortName}
            </p>
          </div>
        ))}

        <button
          className="group cursor-pointer"
          onClick={onAddNew}
          type="button"
        >
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-600 group-hover:border-white transition-colors duration-300 flex items-center justify-center">
            <span className="text-slate-400 group-hover:text-white text-2xl">
              +
            </span>
          </div>
          <p className="text-slate-400 group-hover:text-white text-xs mt-2 text-center font-medium transition-colors">
            Add
          </p>
        </button>
      </div>
    </div>
  );
}
