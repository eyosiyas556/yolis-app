"use client";

import React, { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useShop } from "../context/ShopContext";

export interface UserProfileMenuProps {
  onSignOut?: () => void;
  variant?: "dark" | "light";
}

export function CustomerProfileDropdown({
  onSignOut,
  variant = "light",
}: UserProfileMenuProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logoutUser } = useShop();

  // Compute initials and names dynamically or fallback to snippet defaults
  const fullName = currentUser?.fullName || "fiker yilkal";
  const email = currentUser?.email || "fiker@gmail.com";
  const firstName = fullName.split(" ")[0].toLowerCase() || "fiker";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "FI";

  const memberBadge =
    currentUser?.role === "ADMIN" ? "ADMINISTRATOR" : "SALON PRO MEMBER";

  const handleSignOut = () => {
    setIsOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      logoutUser();
    }
  };

  const isDark = variant === "dark";

  return (
    <div className="relative">
      {/* Trigger Pill ("FI fiker") */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-9 pl-1.5 pr-2.5 rounded-full active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer ${
          isDark
            ? "bg-[#2D1C14]/80 hover:bg-[#2D1C14] border border-white/10 text-[#FFFFFF] shadow-xs"
            : "bg-[#FFFFFF] hover:bg-[#FCFAF6] border border-[#4F2D1C]/12 text-[#4F2D1C] shadow-[0_4px_12px_-2px_rgba(79,45,28,0.08)]"
        }`}
      >
        <span
          className={`w-6 h-6 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
            isDark
              ? "bg-[#FAF6F0] text-[#4F2D1C]"
              : "bg-[#4F2D1C] text-[#FFFFFF]"
          }`}
        >
          {initials}
        </span>
        <span
          className={`text-xs font-extrabold max-w-[65px] sm:max-w-[85px] truncate ${
            isDark ? "text-[#FFFFFF]" : "text-[#4F2D1C]"
          }`}
        >
          {firstName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            isDark ? "text-white/80" : "text-[#4F2D1C]"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Backdrop for outside tap on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-[26px] bg-[#FFFFFF] p-2.5 border border-[#4F2D1C]/10 shadow-[0_18px_40px_-10px_rgba(79,45,28,0.22)] z-50 animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* Top Cream User Identity Card */}
          <div className="rounded-2xl bg-[#FAF6F0] p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#4F2D1C] text-[#FFFFFF] text-sm font-extrabold flex items-center justify-center shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#4F2D1C] truncate leading-tight">
                {fullName}
              </p>
              <p className="text-xs text-[#4F2D1C]/65 truncate mt-0.5">
                {email}
              </p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C] text-[9px] font-extrabold uppercase tracking-wider">
                {memberBadge}
              </span>
            </div>
          </div>

          {/* Sign Out Action */}
          <div className="mt-2 pt-1 border-t border-[#4F2D1C]/10">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-3.5 py-2.5 rounded-xl hover:bg-rose-50/70 active:bg-rose-100/70 flex items-center gap-3 text-xs font-extrabold text-[#9A3412] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#9A3412] stroke-[2]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerProfileDropdown;
