"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShopProvider, useShop } from "../context/ShopContext";
import DesktopHeader from "../components/DesktopHeader";
import MobileHeader from "../components/MobileHeader";
import WelcomeView from "../components/WelcomeView";
import HeroBanner from "../components/HeroBanner";
import TrustBadges from "../components/TrustBadges";
import ProductGrid from "../components/ProductGrid";
import StoreFooter from "../components/StoreFooter";
import MobileHomeView from "../components/MobileHomeView";
import HomeSkeleton from "../components/HomeSkeleton";
import ProductDetailModal from "../components/ProductDetailModal";
import CartDrawer from "../components/CartDrawer";
import WishlistDrawer from "../components/WishlistDrawer";
import CheckoutModal from "../components/CheckoutModal";
import OrderSuccessModal from "../components/OrderSuccessModal";
import TrackOrderModal from "../components/TrackOrderModal";
import AccountModal from "../components/AccountModal";
import MobileBottomNav from "../components/MobileBottomNav";
import AuthModal from "../components/AuthModal";

function HomePageContent() {
  const router = useRouter();
  const { currentUser, isAuthLoading, activeNavTab } = useShop();
  const searchParams = useSearchParams();
  const isWelcomePreview = searchParams.get("preview") === "welcome";

  // Admins must strictly only see the Admin Portal — never the customer storefront
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("yolanda_customer") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        const isStoredAdmin =
          parsed?.role === "ADMIN" ||
          parsed?.email?.toLowerCase() === "yolandabeauty@gmail.com" ||
          parsed?.email?.toLowerCase() === "admin@yolandabeauty.com";
        if (isStoredAdmin) {
          router.replace("/admin");
          return;
        }
      }
    } catch {}

    const isCurrentAdmin =
      currentUser?.role === "ADMIN" ||
      currentUser?.email?.toLowerCase() === "yolandabeauty@gmail.com" ||
      currentUser?.email?.toLowerCase() === "admin@yolandabeauty.com";
    if (!isAuthLoading && isCurrentAdmin) {
      router.replace("/admin");
    }
  }, [currentUser, isAuthLoading, router]);

  const isCurrentAdmin =
    currentUser?.role === "ADMIN" ||
    currentUser?.email?.toLowerCase() === "yolandabeauty@gmail.com" ||
    currentUser?.email?.toLowerCase() === "admin@yolandabeauty.com";
  if (!isAuthLoading && isCurrentAdmin) {
    return <HomeSkeleton />;
  }

  // Synchronous check for stored customer session to prevent welcome page flicker on refresh
  const [hasStoredCustomer] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yolanda_customer");
        if (stored) {
          const parsed = JSON.parse(stored);
          return Boolean(parsed && parsed.role !== "ADMIN");
        }
      } catch {}
    }
    return false;
  });

  const isCustomerLoggedIn = Boolean(currentUser && currentUser.role !== "ADMIN") || (isAuthLoading && hasStoredCustomer);

  // When unauthenticated, show Welcome page. If logged-in customer, show their active tab unless explicitly in welcome preview
  const isWelcomeView = Boolean(isWelcomePreview) || (!isCustomerLoggedIn && (activeNavTab === "Welcome" || !currentUser));

  // While auth is hydrating on browser refresh, show HomeSkeleton for logged-in customers so it smoothly transitions to shop
  if (isAuthLoading && isCustomerLoggedIn) {
    return <HomeSkeleton />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAF6F0] text-[#4F2D1C]">
      {/* Mobile Header (Fixed at top for visitor/welcome view) */}
      {isWelcomeView && (
        <div className="lg:hidden shrink-0">
          <MobileHeader isWelcomePreview={isWelcomePreview} />
        </div>
      )}

      {/* Desktop Luxury Header (Fixed at top) */}
      <div className="hidden lg:block shrink-0">
        <DesktopHeader isWelcomePreview={isWelcomePreview} />
      </div>

      {/* Before sign in or on initial load: render Welcome View */}
      {isWelcomeView ? (
        <main
          id="welcome-scroll-container"
          className="flex-1 h-full overflow-y-auto min-w-0 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto pb-16 w-full"
        >
          <WelcomeView />
        </main>
      ) : (
        <>
          {/* 1. Mobile View (Scrollable on < lg screens) */}
          <div
            id="mobile-scroll-container"
            className="lg:hidden flex-1 overflow-y-auto min-h-0"
          >
            <MobileHomeView />
          </div>

          {/* 2. Desktop Full-Width & Frictionless Layout */}
          <div className="hidden lg:flex flex-1 overflow-hidden w-full min-h-0">
            {/* Full-Width Main Stage */}
            <main
              id="main-scroll-container"
              className="flex-1 h-full overflow-y-auto min-w-0 p-4 lg:p-8 max-w-[1550px] mx-auto pb-16 w-full"
            >
              <HeroBanner />
              <TrustBadges />
              <ProductGrid />
              <StoreFooter />
            </main>
          </div>
        </>
      )}

      {/* Modals & Interactive Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <TrackOrderModal />
      <AccountModal />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
