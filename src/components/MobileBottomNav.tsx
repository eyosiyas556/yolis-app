"use client";

import React from "react";
import { useShop } from "../context/ShopContext";
import { Home, Grid, Package, User, Sparkles, ShieldCheck, Lock } from "lucide-react";

export default function MobileBottomNav() {
  const {
    activeNavTab,
    setActiveNavTab,
    orders,
    setTrackingOrder,
    setIsMyOrdersOpen,
    setIsAccountModalOpen,
    currentUser,
    openAuthModal,
    scrollToWelcomeSection,
  } = useShop();

  const memberTabs = [
    { id: "Shop", label: "Shop", icon: <Home className="w-4 h-4" /> },
    { id: "Categories", label: "Categories", icon: <Grid className="w-4 h-4" /> },
    { id: "Orders", label: "Orders", icon: <Package className="w-4 h-4" /> },
    { id: "Account", label: "Account", icon: <User className="w-4 h-4" /> },
  ];

  const guestTabs = [
    { id: "Welcome", label: "Welcome", icon: <Sparkles className="w-4 h-4" /> },
    { id: "About", label: "About", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "Sign In", label: "Sign In", icon: <Lock className="w-4 h-4" /> },
  ];

  const activeTabs = currentUser ? memberTabs : guestTabs;

  const handleTabClick = (tabId: string) => {
    setActiveNavTab(tabId);

    if (tabId === "Shop") {
      document.getElementById("mobile-scroll-container")?.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tabId === "Welcome") {
      scrollToWelcomeSection("hero");
    } else if (tabId === "About") {
      scrollToWelcomeSection("about");
    } else if (tabId === "Sign In") {
      openAuthModal("login");
    } else if (tabId === "Categories") {
      const el = document.getElementById("category-section");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "Orders") {
      setTrackingOrder(orders[0] || null);
      setIsMyOrdersOpen(true);
    } else if (tabId === "Account") {
      if (!currentUser) {
        openAuthModal("login");
      } else {
        setIsAccountModalOpen(true);
      }
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_4px_24px_rgba(79,45,28,0.10)] border border-[#4F2D1C]/10 flex items-center justify-around">
      {activeTabs.map((tab) => {
        const isActive = activeNavTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 relative transition cursor-pointer"
          >
            <span className={isActive ? "text-[#4F2D1C]" : "text-[#4F2D1C]/60"}>
              {tab.icon}
            </span>
            <span
              className={`text-[9px] font-semibold ${
                isActive ? "text-[#4F2D1C]" : "text-[#4F2D1C]/60"
              }`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#4F2D1C] absolute -bottom-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
