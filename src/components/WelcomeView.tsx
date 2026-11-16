"use client";

import React, { useEffect, useRef } from "react";
import { useShop, DEFAULT_WELCOME_SETTINGS } from "../context/ShopContext";
import {
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  Zap,
  Wrench,
} from "lucide-react";
import WelcomeProductsMarquee from "./WelcomeProductsMarquee";
import StoreFooter from "./StoreFooter";

export default function WelcomeView() {
  const {
    openAuthModal,
    currentUser,
    setActiveNavTab,
    setActiveWelcomeSection,
    isProgrammaticScrollRef,
    welcomeSettings,
  } = useShop();
  const ws = welcomeSettings || DEFAULT_WELCOME_SETTINGS;

  const hasPillar1 = Boolean(ws.pillar1Title?.trim() || ws.pillar1Desc?.trim());
  const hasPillar2 = Boolean(ws.pillar2Title?.trim() || ws.pillar2Desc?.trim());
  const hasPillar3 = Boolean(ws.pillar3Title?.trim() || ws.pillar3Desc?.trim());
  const hasAnyPillars = hasPillar1 || hasPillar2 || hasPillar3;

  const hasStep1 = Boolean(ws.step1Title?.trim() || ws.step1Desc?.trim());
  const hasStep2 = Boolean(ws.step2Title?.trim() || ws.step2Desc?.trim());
  const hasStep3 = Boolean(ws.step3Title?.trim() || ws.step3Desc?.trim());
  const hasAnySteps = hasStep1 || hasStep2 || hasStep3;

  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const checkActiveSection = () => {
      if (isProgrammaticScrollRef?.current) return;

      const heroEl = document.getElementById("welcome-hero");
      const aboutEl = document.getElementById("welcome-about");
      const deliveryEl = document.getElementById("welcome-delivery");

      if (!heroEl || !aboutEl || !deliveryEl) return;

      const container = document.getElementById("welcome-scroll-container");

      if (container) {
        const remaining =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        if (remaining < 60) {
          setActiveWelcomeSection("delivery");
          return;
        }
      }

      const triggerLine = 260;
      const deliveryTop = deliveryEl.getBoundingClientRect().top;
      const aboutTop = aboutEl.getBoundingClientRect().top;

      if (deliveryTop <= triggerLine) {
        setActiveWelcomeSection("delivery");
      } else if (aboutTop <= triggerLine) {
        setActiveWelcomeSection("about");
      } else {
        setActiveWelcomeSection("hero");
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(checkActiveSection);
    };

    checkActiveSection();

    const container = document.getElementById("welcome-scroll-container");
    const parentEl = containerRef.current?.parentElement;

    const scrollTargets = new Set<EventTarget>([window, document]);
    if (container) scrollTargets.add(container);
    if (parentEl) scrollTargets.add(parentEl);

    scrollTargets.forEach((t) => {
      t.addEventListener("scroll", handleScroll, {
        passive: true,
        capture: true,
      });
    });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      scrollTargets.forEach((t) => {
        t.removeEventListener("scroll", handleScroll, { capture: true });
      });
      window.removeEventListener("resize", handleScroll);
    };
  }, [setActiveWelcomeSection, isProgrammaticScrollRef]);

  return (
    <div
      ref={containerRef}
      className="space-y-3 sm:space-y-8 pb-10 bg-[#FAF6F0]"
    >
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO BANNER
          • Mobile (md:hidden): Matches mockup image with portrait photo,
            simple headline & 2 action pills that NEVER distort into circles.
          • Desktop (hidden md:flex): Preserved luxury full-width layout.
      ═══════════════════════════════════════════════════════════════ */}
      <div id="welcome-hero" className="scroll-mt-20 sm:scroll-mt-24 w-full">
        {/* ─── MOBILE HERO BANNER (Compact Sleek Height & Optimized Typography) ─── */}
        <div className="md:hidden relative w-full h-[195px] sm:h-[215px] rounded-[24px] overflow-hidden shadow-[0_6px_24px_rgba(46,26,17,0.06)] flex flex-col justify-end p-3 sm:p-3.5">
          {/* Model portrait background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${ws.mobileHeroBgImage || "/mobile-welcome-hero.jpg"}')` }}
          />

          {/* Warm Dark Gradient Overlay for optimal contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />

          {/* Compact Headline & Buttons at Bottom */}
          <div className="relative z-20 space-y-1.5">
            <h1 className="font-sans text-[13.5px] sm:text-[15px] font-medium leading-snug text-white/95 tracking-normal drop-shadow-sm">
              {ws.heroTitleLine1} <br />
              <span>{ws.heroTitleLine2}</span>
            </h1>

            {/* Overlaid Actions (Ultra-sleek compact height & typography) */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {currentUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab("Shop")}
                    className="h-6 px-2.5 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/15 text-[9px] font-bold shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Shop Catalog</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab("My Orders")}
                    className="h-6 px-2.5 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-[9px] font-bold border border-white/20 shadow-xs whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]"
                  >
                    <span>My Orders</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="h-6 px-2.5 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/15 text-[9px] font-bold shadow-xs whitespace-nowrap shrink-0 transition cursor-pointer active:scale-[0.98]"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal("register")}
                    className="h-6 px-2.5 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-[9px] font-bold shadow-xs whitespace-nowrap shrink-0 transition cursor-pointer active:scale-[0.98]"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Motto under photo (only if provided) */}
        {ws.heroMotto?.trim() && (
          <div className="md:hidden pt-1.5 text-center">
            <p className="text-[11px] text-[#4F2D1C]/70 font-semibold tracking-wide">
              {ws.heroMotto}
            </p>
          </div>
        )}

        {/* ─── DESKTOP HERO (Preserved Full Luxury Layout) ─── */}
        <div className="hidden md:flex flex-col justify-between w-full bg-[#4F2D1C] rounded-[24px] p-8 lg:p-12 text-[#FAF6F0] relative overflow-hidden min-h-[420px] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4F2D1C] via-[#4F2D1C]/85 to-transparent z-10" />
          <div
            className="absolute inset-0 bg-cover bg-right md:bg-center opacity-65 scale-100"
            style={{ backgroundImage: `url('${ws.heroBgImage || "/hero-bg.jpg"}')` }}
          />

          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={ws.brandLogoImage || "/yolanda-logo.jpg"}
                alt="Yolanda Logo"
                className="w-8 h-8 rounded-full object-cover border border-white/30 shadow-md"
              />
              <span className="text-xs uppercase tracking-widest text-[#FAF6F0] font-bold">
                {ws.brandName || "Yolanda Salon Equipment"}
              </span>
            </div>

            {(currentUser || ws.heroBadge?.trim()) && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FAF6F0]">
                {currentUser
                  ? `Member: ${currentUser.fullName}`
                  : ws.heroBadge}
              </span>
            )}
          </div>

          <div className="relative z-20 max-w-lg my-auto pt-6 pb-2 space-y-3">
            <h1 className="font-sans text-4xl lg:text-5xl font-bold leading-tight text-[#FAF6F0] tracking-tight">
              {ws.heroTitleLine1} <br />
              <span className="italic font-light text-[#FAF6F0]/90">
                {ws.heroTitleLine2}
              </span>
            </h1>

            {(currentUser || ws.heroSubtitle?.trim()) && (
              <p className="text-sm text-[#FAF6F0]/80">
                {currentUser
                  ? `Welcome back, ${currentUser.fullName}! Your wholesale equipment catalog is unlocked.`
                  : ws.heroSubtitle}
              </p>
            )}

            <div className="pt-2 flex items-center gap-3">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setActiveNavTab("Shop")}
                    className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/15 text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Shop Equipment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveNavTab("My Orders")}
                    className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-[#FAF6F0] text-xs font-bold backdrop-blur-md border border-white/30 transition cursor-pointer active:scale-[0.98]"
                  >
                    <span>My Orders</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/15 text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openAuthModal("register")}
                    className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-[#FAF6F0] text-xs font-bold backdrop-blur-md border border-white/30 transition cursor-pointer active:scale-[0.98]"
                  >
                    <span>Register</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="relative z-20 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#FAF6F0]/90">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FAF6F0]" />
              <span>Salon-Grade Equipment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FAF6F0]" />
              <span>Direct Equipment Importer</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FAF6F0]" />
              <span>1-Year Machine Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2. PRODUCT SHOWCASE (MARQUEE)
      ═══════════════════════════════════════════════════════════════ */}
      <WelcomeProductsMarquee />

      {/* ═══════════════════════════════════════════════════════════════
          3. PILLARS OF TRUST ("Why Top Salons Trust Yolanda")
          • Mobile (md:hidden): Compact vertical stack of white cards matching design
          • Desktop (hidden md:grid): 3-column grid
      ═══════════════════════════════════════════════════════════════ */}
      {hasAnyPillars && (
        <div
          id="welcome-about"
          className="scroll-mt-20 sm:scroll-mt-24 space-y-2.5 sm:space-y-6"
        >
          {(ws.pillarSectionTag?.trim() || ws.pillarSectionTitle?.trim() || ws.pillarSectionSubtitle?.trim()) && (
            <div className="text-center max-w-2xl mx-auto space-y-0.5 sm:space-y-1.5">
              {ws.pillarSectionTag?.trim() && (
                <span className="text-[9px] sm:text-xs uppercase tracking-widest font-extrabold text-[#4F2D1C]/70 block">
                  {ws.pillarSectionTag}
                </span>
              )}
              {ws.pillarSectionTitle?.trim() && (
                <h2 className="font-sans text-lg sm:text-3xl lg:text-4xl font-bold text-[#4F2D1C] tracking-tight">
                  {ws.pillarSectionTitle}
                </h2>
              )}
              {ws.pillarSectionSubtitle?.trim() && (
                <p className="hidden md:block text-sm text-[#4F2D1C]/70 max-w-lg mx-auto">
                  {ws.pillarSectionSubtitle}
                </p>
              )}
            </div>
          )}

          {/* ─── MOBILE VIEW: Compact Vertical Stack of White Cards ─── */}
          <div className="md:hidden flex flex-col gap-2">
            {hasPillar1 && (
              <div className="bg-white rounded-[18px] p-3.5 shadow-[0_4px_16px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#4F2D1C]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sans text-xs font-bold text-[#4F2D1C] leading-snug">
                    {ws.pillar1Title}
                  </h3>
                  <p className="text-[11px] text-[#4F2D1C]/70 leading-snug">
                    {ws.pillar1Desc}
                  </p>
                </div>
              </div>
            )}

            {hasPillar2 && (
              <div className="bg-white rounded-[18px] p-3.5 shadow-[0_4px_16px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-[#4F2D1C]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sans text-xs font-bold text-[#4F2D1C] leading-snug">
                    {ws.pillar2Title}
                  </h3>
                  <p className="text-[11px] text-[#4F2D1C]/70 leading-snug">
                    {ws.pillar2Desc}
                  </p>
                </div>
              </div>
            )}

            {hasPillar3 && (
              <div className="bg-white rounded-[18px] p-3.5 shadow-[0_4px_16px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-[#4F2D1C]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sans text-xs font-bold text-[#4F2D1C] leading-snug">
                    {ws.pillar3Title}
                  </h3>
                  <p className="text-[11px] text-[#4F2D1C]/70 leading-snug">
                    {ws.pillar3Desc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ─── DESKTOP VIEW: 3-Column Grid ─── */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6">
            {hasPillar1 && (
              <div className="bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 hover:shadow-lg transition-shadow space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#4F2D1C]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#4F2D1C] leading-snug">
                    {ws.pillar1Title}
                  </h3>
                  <p className="text-sm text-[#4F2D1C]/70 leading-relaxed font-normal">
                    {ws.pillar1Desc}
                  </p>
                </div>
                {ws.pillar1Badge?.trim() && (
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#4F2D1C]">
                    <CheckCircle2 className="w-4 h-4 text-[#4F2D1C]" />
                    <span>{ws.pillar1Badge}</span>
                  </div>
                )}
              </div>
            )}

            {hasPillar2 && (
              <div className="bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 hover:shadow-lg transition-shadow space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#4F2D1C]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#4F2D1C] leading-snug">
                    {ws.pillar2Title}
                  </h3>
                  <p className="text-sm text-[#4F2D1C]/70 leading-relaxed font-normal">
                    {ws.pillar2Desc}
                  </p>
                </div>
                {ws.pillar2Badge?.trim() && (
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#4F2D1C]">
                    <CheckCircle2 className="w-4 h-4 text-[#4F2D1C]" />
                    <span>{ws.pillar2Badge}</span>
                  </div>
                )}
              </div>
            )}

            {hasPillar3 && (
              <div className="bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_4px_20px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 hover:shadow-lg transition-shadow space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#4F2D1C]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#4F2D1C] leading-snug">
                    {ws.pillar3Title}
                  </h3>
                  <p className="text-sm text-[#4F2D1C]/70 leading-relaxed font-normal">
                    {ws.pillar3Desc}
                  </p>
                </div>
                {ws.pillar3Badge?.trim() && (
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#4F2D1C]">
                    <CheckCircle2 className="w-4 h-4 text-[#4F2D1C]" />
                    <span>{ws.pillar3Badge}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          4. HOW IT WORKS
          • Mobile (md:hidden): Compact white card matching design image
          • Desktop (hidden md:block): 3-column process
      ═══════════════════════════════════════════════════════════════ */}
      {hasAnySteps && (
        <div id="welcome-delivery" className="scroll-mt-20 sm:scroll-mt-24">
          {/* ─── MOBILE VIEW: Compact "How It Works" Card ─── */}
          <div className="md:hidden bg-white rounded-[20px] p-4 sm:p-6 shadow-[0_4px_20px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 space-y-3">
            {ws.howItWorksTitle?.trim() && (
              <div>
                <h2 className="font-sans text-base sm:text-lg font-bold text-[#4F2D1C] tracking-tight">
                  {ws.howItWorksTitle}
                </h2>
              </div>
            )}

            <div className="space-y-2.5">
              {hasStep1 && (
                <div className="flex items-start gap-2.5">
                  <span className="font-sans text-xl sm:text-2xl font-extrabold text-[#4F2D1C]/25 shrink-0 leading-none">
                    01
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#4F2D1C] text-xs">
                      {ws.step1Title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#4F2D1C]/70 leading-snug">
                      {ws.step1Desc}
                    </p>
                  </div>
                </div>
              )}

              {hasStep2 && (
                <div className="flex items-start gap-2.5">
                  <span className="font-sans text-xl sm:text-2xl font-extrabold text-[#4F2D1C]/25 shrink-0 leading-none">
                    02
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#4F2D1C] text-xs">
                      {ws.step2Title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#4F2D1C]/70 leading-snug">
                      {ws.step2Desc}
                    </p>
                  </div>
                </div>
              )}

              {hasStep3 && (
                <div className="flex items-start gap-2.5">
                  <span className="font-sans text-xl sm:text-2xl font-extrabold text-[#4F2D1C]/25 shrink-0 leading-none">
                    03
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#4F2D1C] text-xs">
                      {ws.step3Title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#4F2D1C]/70 leading-snug">
                      {ws.step3Desc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Optimized Cocoa Brown Pill Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="w-full py-2.5 sm:py-3 px-3.5 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-[11px] sm:text-xs font-bold transition shadow-[0_4px_12px_rgba(79,45,28,0.20)] cursor-pointer text-center block active:scale-[0.98]"
              >
                Register Now to Access Catalog
              </button>
            </div>
          </div>

          {/* ─── DESKTOP VIEW ─── */}
          <div className="hidden md:block bg-white rounded-[24px] p-8 sm:p-12 shadow-[0_4px_24px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#4F2D1C]/70 block">
                Simple 3-Step Process
              </span>
              {ws.howItWorksTitle?.trim() && (
                <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4F2D1C] tracking-tight">
                  {ws.howItWorksTitle}
                </h2>
              )}
              <p className="text-sm text-[#4F2D1C]/70">
                Quick, reliable order fulfillment tailored for Ethiopian salon professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {hasStep1 && (
                <div className="bg-[#FAF6F0] rounded-[24px] p-7 sm:p-8 relative space-y-3.5 shadow-xs border border-[#4F2D1C]/10 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-[#4F2D1C] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    1
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold text-[#4F2D1C]">
                    {ws.step1Title}
                  </h4>
                  <p className="text-sm text-[#4F2D1C]/70 leading-relaxed font-normal">
                    {ws.step1Desc}
                  </p>
                </div>
              )}

              {hasStep2 && (
                <div className="bg-[#FAF6F0] rounded-[24px] p-7 sm:p-8 relative space-y-3.5 shadow-xs border border-[#4F2D1C]/10 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-[#4F2D1C] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    2
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold text-[#4F2D1C]">
                    {ws.step2Title}
                  </h4>
                  <p className="text-sm text-[#4F2D1C]/70 leading-relaxed font-normal">
                    {ws.step2Desc}
                  </p>
                </div>
              )}

              {hasStep3 && (
                <div className="bg-[#FAF6F0] rounded-[24px] p-7 sm:p-8 relative space-y-3.5 shadow-xs border border-[#4F2D1C]/10 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-[#4F2D1C] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    3
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold text-[#4F2D1C]">
                    {ws.step3Title}
                  </h4>
                  <p className="text-sm text-[#4F2D1C]/70 leading-relaxed font-normal">
                    {ws.step3Desc}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => openAuthModal("register")}
                className="px-9 py-4 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-sm font-bold transition shadow-[0_6px_14px_rgba(79,45,28,0.22)] hover:shadow-lg inline-flex items-center gap-2.5 cursor-pointer active:scale-[0.98]"
              >
                <span>Register Now to Access Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          5. FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <StoreFooter />
    </div>
  );
}