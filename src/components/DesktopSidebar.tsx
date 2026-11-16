"use client";

import React from "react";
import { useShop } from "../context/ShopContext";
import {
  ShoppingCart,
  Grid,
  Tag,
  Package,
  User,
  Sparkles,
  ShieldCheck,
  Truck,
  Lock,
  LogOut,
} from "lucide-react";

export default function DesktopSidebar() {
  const {
    activeNavTab,
    setActiveNavTab,
    setSelectedCategory,
    orders,
    setTrackingOrder,
    setIsMyOrdersOpen,
    setIsAccountModalOpen,
    currentUser,
    openAuthModal,
    logoutUser,
    scrollToWelcomeSection,
    welcomeSettings,
  } = useShop();

  // Navigation Links for Logged-In Members (Strictly Shopping & Account)
  const memberNavLinks = [
    { id: "Categories", label: "Categories", icon: <Grid className="w-4 h-4" /> },
    { id: "My Orders", label: "My Orders", icon: <Package className="w-4 h-4" /> },
    { id: "Account", label: "My Account", icon: <User className="w-4 h-4" /> },
  ];

  // Navigation Links for Guests Before Sign In
  const guestNavLinks = [
    { id: "Welcome", label: "Welcome", icon: <Sparkles className="w-4 h-4" /> },
    { id: "About", label: "About Equipment", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "Delivery", label: "Payment & Delivery", icon: <Truck className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveNavTab(id);

    if (id === "Welcome") {
      scrollToWelcomeSection("hero");
    } else if (id === "About") {
      scrollToWelcomeSection("about");
    } else if (id === "Delivery") {
      scrollToWelcomeSection("delivery");
    } else if (id === "Categories") {
      const el = document.getElementById("category-section");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (id === "Offers") {
      const el = document.getElementById("offers-section");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (id === "My Orders") {
      setTrackingOrder(orders[0] || null);
      setIsMyOrdersOpen(true);
    } else if (id === "Account") {
      setIsAccountModalOpen(true);
    } else if (id === "Shop") {
      setSelectedCategory(null);
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden lg:flex flex-col justify-between w-56 xl:w-60 bg-[#FAF6F0] p-4 shrink-0 h-full overflow-y-auto">
      <div>
        {/* Claymorphic Section Header */}
        <div className="px-3 pb-2.5">
          <span className="text-[10px] tracking-widest uppercase font-extrabold text-[#4F2D1C]/60 [text-shadow:_0_1px_1px_rgba(255,255,255,0.9)]">
            {currentUser ? "Salon Storefront" : "Welcome Portal"}
          </span>
        </div>

        {/* Navigation Links with Claymorphism 3D effect */}
        <nav className="space-y-2.5">
          {currentUser ? (
            /* Logged-In Member Links */
            memberNavLinks.map((link) => {
              const isActive = activeNavTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#FAF6F0] text-[#4F2D1C] font-bold border border-white shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,1),inset_-2.5px_-2.5px_5px_rgba(79,45,28,0.15),3px_5px_12px_rgba(79,45,28,0.1)] scale-[1.02]"
                      : "bg-[#FAF6F0] text-[#4F2D1C]/80 font-semibold border border-white/70 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.95),inset_-2px_-2px_4px_rgba(79,45,28,0.08),2px_3px_8px_rgba(79,45,28,0.05)] hover:text-[#4F2D1C] hover:scale-[1.02] hover:shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,1),inset_-2.5px_-2.5px_5px_rgba(79,45,28,0.12),3px_5px_10px_rgba(79,45,28,0.07)] active:scale-[0.98]"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-[#4F2D1C] text-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),1px_2px_5px_rgba(79,45,28,0.25)]"
                        : "bg-white text-[#4F2D1C] shadow-[inset_1px_1px_2px_rgba(255,255,255,1),inset_-1px_-1px_2px_rgba(79,45,28,0.07),1px_2px_4px_rgba(79,45,28,0.05)]"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span
                    className={
                      isActive
                        ? "[text-shadow:_0_1px_1px_rgba(255,255,255,0.95)] tracking-wide"
                        : "[text-shadow:_0_1px_1px_rgba(255,255,255,0.8)]"
                    }
                  >
                    {link.label}
                  </span>
                </button>
              );
            })
          ) : (
            /* Guest / Unauthenticated Links */
            <>
              {guestNavLinks.map((link) => {
                const isActive = activeNavTab === link.id || (link.id === "Welcome" && !activeNavTab);
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#FAF6F0] text-[#4F2D1C] font-bold border border-white shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,1),inset_-2.5px_-2.5px_5px_rgba(79,45,28,0.15),3px_5px_12px_rgba(79,45,28,0.1)] scale-[1.02]"
                        : "bg-[#FAF6F0] text-[#4F2D1C]/80 font-semibold border border-white/70 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.95),inset_-2px_-2px_4px_rgba(79,45,28,0.08),2px_3px_8px_rgba(79,45,28,0.05)] hover:text-[#4F2D1C] hover:scale-[1.02] hover:shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,1),inset_-2.5px_-2.5px_5px_rgba(79,45,28,0.12),3px_5px_10px_rgba(79,45,28,0.07)] active:scale-[0.98]"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[#4F2D1C] text-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),1px_2px_5px_rgba(79,45,28,0.25)]"
                          : "bg-white text-[#4F2D1C] shadow-[inset_1px_1px_2px_rgba(255,255,255,1),inset_-1px_-1px_2px_rgba(79,45,28,0.07),1px_2px_4px_rgba(79,45,28,0.05)]"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span
                      className={
                        isActive
                          ? "[text-shadow:_0_1px_1px_rgba(255,255,255,0.95)] tracking-wide"
                          : "[text-shadow:_0_1px_1px_rgba(255,255,255,0.8)]"
                      }
                    >
                      {link.label}
                    </span>
                  </button>
                );
              })}

              {/* Highlighted Sign In / Unlock Button in Sidebar */}
              <div className="pt-2">
                <button
                  onClick={() => openAuthModal("login")}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold bg-[#4F2D1C] hover:bg-[#2D1C14] text-white shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,0.25),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.3),3px_5px_12px_rgba(79,45,28,0.25)] transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center text-[#FAF6F0] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <span>Sign In / Register</span>
                </button>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Sidebar Footer: Logged in Account OR Official Yolanda Card */}
      <div className="pt-5  text-center space-y-3">
        {currentUser ? (
          /* Active User Profile Pill (Claymorphic) */
          <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-white/60 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(79,45,28,0.09),3px_5px_12px_rgba(79,45,28,0.07)] flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#4F2D1C] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
              {currentUser.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-center w-full">
              <p className="text-xs font-bold text-[#4F2D1C] truncate [text-shadow:_0_1px_1px_rgba(255,255,255,0.9)]">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-[#4F2D1C]/70 truncate">
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={logoutUser}
              className="mt-1 w-full py-1.5 px-3 rounded-xl bg-[#FAF6F0] hover:bg-rose-50 text-[11px] font-semibold text-[#8B2500] border border-white/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),2px_3px_6px_rgba(79,45,28,0.06)] flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Official Brand Card (Claymorphic) */
          <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-white/60 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(79,45,28,0.09),3px_5px_12px_rgba(79,45,28,0.07)] flex flex-col items-center gap-2">
            <img
              src="/yolanda-logo.jpg"
              alt="Yolanda Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),2px_4px_8px_rgba(79,45,28,0.12)]"
            />
            <div>
              <p className="text-xs font-serif font-bold text-[#4F2D1C] [text-shadow:_0_1px_1px_rgba(255,255,255,0.9)]">
                {welcomeSettings?.brandName || "Yolanda Equipment"}
              </p>
              <p className="text-[10px] text-[#4F2D1C]/70 italic [text-shadow:_0_1px_0_rgba(255,255,255,0.7)]">
                {welcomeSettings?.brandSubtitle || "Commercial Salon & Studio Supplies"}
              </p>
            </div>
          </div>
        )}

        {/* Social Icons (Claymorphic Buttons) */}
        <div className="flex items-center justify-center gap-3 text-[#4F2D1C]/70 pt-1">
          <a
            href="#instagram"
            aria-label="Instagram"
            className="w-7 h-7 rounded-full bg-[#FAF6F0] border border-white/80 flex items-center justify-center text-[#4F2D1C]/70 hover:text-[#4F2D1C] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.95),inset_-1px_-1px_2px_rgba(79,45,28,0.1),2px_3px_6px_rgba(79,45,28,0.08)] hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="#facebook"
            aria-label="Facebook"
            className="w-7 h-7 rounded-full bg-[#FAF6F0] border border-white/80 flex items-center justify-center text-[#4F2D1C]/70 hover:text-[#4F2D1C] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.95),inset_-1px_-1px_2px_rgba(79,45,28,0.1),2px_3px_6px_rgba(79,45,28,0.08)] hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="#twitter"
            aria-label="X (Twitter)"
            className="w-7 h-7 rounded-full bg-[#FAF6F0] border border-white/80 flex items-center justify-center text-[#4F2D1C]/70 hover:text-[#4F2D1C] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.95),inset_-1px_-1px_2px_rgba(79,45,28,0.1),2px_3px_6px_rgba(79,45,28,0.08)] hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}
