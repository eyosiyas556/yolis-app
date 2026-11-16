"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "../context/ShopContext";
import { Search, ShoppingCart, Heart, User, ChevronDown, Package, LogOut, ShieldCheck } from "lucide-react";

export default function DesktopHeader({ isWelcomePreview }: { isWelcomePreview?: boolean } = {}) {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    currentUser,
    openAuthModal,
    logoutUser,
    activeNavTab,
    setActiveNavTab,
    setSelectedCategory,
    activeWelcomeSection,
    scrollToWelcomeSection,
    orders,
    setTrackingOrder,
    setIsMyOrdersOpen,
    setIsAccountModalOpen,
    welcomeSettings,
    wishlistCount,
    setIsWishlistOpen,
  } = useShop();

  const router = useRouter();
  const isWelcomeView = Boolean(isWelcomePreview) || (!currentUser && activeNavTab === "Welcome");
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#4F2D1C] text-[#FFFFFF] px-4 lg:px-8 py-3.5 shadow-md transition-all shrink-0">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Logo & Title */}
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
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center font-serif font-bold text-xs shrink-0 ring-2 ring-white/20 shadow-xs overflow-hidden">
            <img
              src={welcomeSettings?.brandLogoImage || "/yolanda-logo.jpg"}
              alt="Yolanda Salon Equipment Supplier"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif text-xl lg:text-2xl font-bold tracking-tight text-[#FFFFFF] block leading-none">
              {welcomeSettings?.brandName?.split(" ")[0] || "Yolanda"}
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-white/75 block mt-0.5">
              {welcomeSettings?.brandSubtitle || "Salon & Makeup Equipment"}
            </span>
          </div>
        </div>

        {/* Center Area: Active Quick Nav Buttons (Welcome) OR Search Bar (Shop) */}
        {isWelcomeView ? (
          /* Active Quick Navbar Buttons for Welcome Page */
          <nav className="hidden md:flex items-center gap-1.5 bg-[#2D1C14]/80 p-1.5 rounded-full shadow-xs border border-white/10">
            <button
              onClick={() => scrollToWelcomeSection("hero")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                activeWelcomeSection === "hero"
                  ? "bg-white text-[#4F2D1C] shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => scrollToWelcomeSection("about")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                activeWelcomeSection === "about"
                  ? "bg-white text-[#4F2D1C] shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Why Choose Yolanda
            </button>
            <button
              onClick={() => scrollToWelcomeSection("delivery")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                activeWelcomeSection === "delivery"
                  ? "bg-white text-[#4F2D1C] shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              How to Order
            </button>
          </nav>
        ) : (
          /* Equipment Search Bar (Only shown when customer is actively shopping) */
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-white/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search salon equipment, hair steamers, facial machines, vanity mirrors..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#2D1C14]/80 hover:bg-[#2D1C14] focus:bg-[#2D1C14] rounded-full text-xs text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition shadow-xs border border-white/15"
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 lg:gap-3 shrink-0">
          {currentUser ? (
            <>
              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                aria-label="Shopping Wishlist"
                className="relative flex items-center gap-2 px-3.5 py-2 bg-[#2D1C14]/80 hover:bg-[#2D1C14] rounded-full transition cursor-pointer shadow-xs border border-white/15 text-white active:scale-95"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    wishlistCount > 0
                      ? "fill-rose-400 text-rose-400"
                      : "text-white"
                  }`}
                />
                <span className="text-xs font-bold text-white hidden sm:inline">
                  Wishlist
                </span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                className="relative flex items-center gap-2 px-4 py-2 bg-[#2D1C14]/80 hover:bg-[#2D1C14] rounded-full transition cursor-pointer shadow-xs border border-white/15 text-white active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#FFFFFF] text-[#4F2D1C] text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-in zoom-in-75">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Combined Account Controls Flyout Dropdown */}
              <div className="relative pl-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-[#2D1C14]/80 hover:bg-[#2D1C14] transition cursor-pointer shadow-xs border border-white/15 text-white active:scale-95"
                  aria-expanded={isAccountDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAF6F0] text-[#4F2D1C] font-bold flex items-center justify-center text-xs shadow-xs overflow-hidden ring-1 ring-white/20">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:inline font-bold text-xs text-white max-w-[110px] truncate">
                    {currentUser.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${
                      isAccountDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 border border-[#4F2D1C]/15 text-[#4F2D1C]">
                    <div className="px-3 py-2.5 bg-[#FAF6F0] rounded-xl mb-1.5 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#4F2D1C] text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden shadow-xs">
                        {currentUser.avatar ? (
                          <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
                        ) : (
                          currentUser.fullName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#4F2D1C] truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-[10px] text-[#4F2D1C]/70 truncate">
                          {currentUser.email}
                        </p>
                        <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C]">
                          Salon Pro Member
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        setTrackingOrder(orders[0] || null);
                        setIsMyOrdersOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#4F2D1C] hover:bg-[#FAF6F0] transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-[#4F2D1C]/70" />
                        <span>My Orders</span>
                      </div>
                      {orders.length > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#4F2D1C]">
                          {orders.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        setIsAccountModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#4F2D1C] hover:bg-[#FAF6F0] transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#4F2D1C]/70" />
                      <span>Account Settings</span>
                    </button>

                    <div className="h-px bg-[#4F2D1C]/10 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        logoutUser();
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#8B2500] hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="inline-flex items-center p-0.5 rounded-full bg-[#2D1C14]/80 border border-white/15 shadow-xs gap-1">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4F2D1C] bg-[#FAF6F0] hover:bg-white transition cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
