"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "../context/ShopContext";
import { Menu, Search, ShoppingCart, X, LogOut, ShieldCheck } from "lucide-react";

import CustomerProfileDropdown from "./CustomerProfileDropdown";

export default function MobileHeader({ isWelcomePreview }: { isWelcomePreview?: boolean } = {}) {
  const {
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    currentUser,
    openAuthModal,
    logoutUser,
    activeNavTab,
    setActiveNavTab,
    setSelectedCategory,
    categories,
    scrollToWelcomeSection,
    welcomeSettings,
  } = useShop();

  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isWelcomeView = Boolean(isWelcomePreview) || (!currentUser && activeNavTab === "Welcome");

  return (
    <>
      {/* Top Mobile Bar (Visible on screens < lg, Styled to match Home navigation) */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#4F2D1C] text-[#FFFFFF] px-4 pt-3 pb-3.5 shadow-md rounded-b-3xl transition-all">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => {
              if (!currentUser) {
                if (activeNavTab !== "Welcome") {
                  setActiveNavTab("Welcome");
                }
                scrollToWelcomeSection("hero");
              } else {
                setActiveNavTab("Shop");
                setSelectedCategory(null);
              }
            }}
            className="flex items-center gap-2 min-w-0 cursor-pointer shrink"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center font-serif font-bold text-xs shrink-0 ring-2 ring-white/20 shadow-xs overflow-hidden">
              {welcomeSettings?.brandLogoImage ? (
                <img
                  src={welcomeSettings.brandLogoImage}
                  alt="Yolanda Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                "Y"
              )}
            </div>
            <div className="truncate">
              <span className="block font-serif font-bold text-base leading-none text-[#FFFFFF] tracking-tight">
                {welcomeSettings?.brandName?.split(" ")[0] || "Yolanda"}
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-white/75 font-semibold mt-0.5 truncate">
                {welcomeSettings?.brandSubtitle || "Salon & Makeup Equipment"}
              </span>
            </div>
          </div>

          {/* Right Action Cluster: Unauthenticated Sign In/Register OR Cart + Customer Profile Dropdown */}
          {!currentUser ? (
            <div className="inline-flex items-center p-0.5 rounded-full bg-[#2D1C14]/80 border border-white/10 shadow-xs gap-0.5 sm:gap-1 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-[#4F2D1C] bg-[#FAF6F0] hover:bg-white transition cursor-pointer shadow-xs whitespace-nowrap shrink-0 active:scale-[0.98]"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
              {/* Cart Pill */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative h-9 px-2.5 sm:px-3 rounded-full bg-[#2D1C14]/80 hover:bg-[#2D1C14] border border-white/10 text-[#FFFFFF] shadow-xs active:scale-95 flex items-center gap-1.5 text-xs font-extrabold transition-transform cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
                <span className="hidden xs:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#FFFFFF] text-[#4F2D1C] text-[10px] font-extrabold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Interactive Customer Profile Pill & Dropdown */}
              <CustomerProfileDropdown />
            </div>
          )}
        </div>

        {/* Expandable Mobile Search Input (Only on Shop catalog) */}
        {!isWelcomeView && isSearchOpen && (
          <div className="mt-2.5 pt-2 animate-in fade-in duration-150">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#4F2D1C]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search beauty salon equipment..."
                className="w-full pl-9 pr-8 py-2 bg-white rounded-full text-xs text-[#4F2D1C] placeholder-[#4F2D1C]/50 focus:outline-none shadow-xs border border-[#4F2D1C]/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F2D1C]/70 hover:text-[#4F2D1C]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Mobile Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-in fade-in duration-200">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-[#FAF6F0] p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={welcomeSettings?.brandLogoImage || "/yolanda-logo.jpg"}
                    alt="Yolanda Logo"
                    className="w-9 h-9 rounded-full object-cover shadow-xs"
                  />
                  <div>
                    <span className="font-sans text-sm font-bold text-[#4F2D1C] block leading-none">
                      {welcomeSettings?.brandName || "Yolanda Equipment"}
                    </span>
                    <span className="text-[9px] text-[#4F2D1C]/70 italic block leading-none pt-0.5">
                      {welcomeSettings?.brandSubtitle || "Salon & Makeup Supplies"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#4F2D1C]/70 hover:text-[#4F2D1C]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="space-y-1">
                {currentUser && (
                  <div className="px-3 py-2 bg-white rounded-xl mb-2.5 flex items-center gap-2.5 shadow-2xs border border-[#4F2D1C]/10">
                    <div className="w-8 h-8 rounded-full bg-[#4F2D1C] text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.fullName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#4F2D1C] truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-[#4F2D1C]/60 truncate font-mono">{currentUser.email}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setActiveNavTab("Shop");
                    setIsDrawerOpen(false);
                    document.getElementById("mobile-scroll-container")?.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#4F2D1C]/70 hover:bg-white hover:text-[#4F2D1C] transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Shop All Equipment</span>
                </button>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F2D1C]/60 px-3 block mb-1">
                    Equipment Categories
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setActiveNavTab("Shop");
                        setIsDrawerOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#4F2D1C] hover:bg-white transition"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 space-y-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    logoutUser();
                    setIsDrawerOpen(false);
                    router.push("/");
                  }}
                  className="w-full py-2.5 rounded-xl bg-white text-xs font-semibold text-[#8B2500] hover:bg-rose-50 flex items-center justify-center gap-2 transition shadow-xs border border-[#4F2D1C]/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({currentUser.fullName.split(" ")[0]})</span>
                </button>
              ) : (
                <div className="w-full p-1 rounded-2xl bg-white flex items-center justify-between shadow-xs gap-1.5 border border-[#4F2D1C]/15">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      openAuthModal("login");
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-[#4F2D1C] bg-white hover:bg-[#FAF6F0] transition cursor-pointer text-center"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      openAuthModal("register");
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-[#4F2D1C] hover:bg-[#2D1C14] transition cursor-pointer text-center shadow-xs active:scale-[0.98]"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}