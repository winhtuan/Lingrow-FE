// components/auth/AuthLeft.jsx
import React from "react";
import RecentAccounts from "./RecentAccounts";
import fav from "../../../assets/images/fav.jpg";

export default function AuthLeft({
  brand = "Lingrow",
  accounts = [],
  onRemove,
  onAddNew,
  onSelect,
  heading = "Welcome back",
  subheading = "Access your account securely and continue where you left off.",
  showRecent = true,
}) {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-16 flex-col justify-between">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <img src={fav} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-white text-xl font-semibold">{brand}</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">{subheading}</p>
        </div>
      </div>

      {showRecent && (
        <RecentAccounts
          items={accounts}
          onRemove={onRemove}
          onAddNew={onAddNew}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
