"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  const title = "Equipping Top Salons, Across Ethiopia.";
  const subtitle = "Commercial machines & furniture for beauty, hair and makeup salons.";
  const cta = "Explore Equipment";
  const bgImg = "/signed-in-hero.jpg";

  return (
    <div className="w-full mb-8">
      {/* Main Luxury Cocoa Hero Banner (Full Width) */}
      <div className="w-full bg-[#4F2D1C] rounded-3xl p-6 sm:p-10 lg:p-12 text-[#FAF6F0] relative overflow-hidden flex flex-col justify-between min-h-[360px] lg:min-h-[400px] shadow-[0_8px_30px_rgba(79,45,28,0.18)]">
        {/* Subtle Background Glow/Gradient for clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4F2D1C] via-[#4F2D1C]/85 to-transparent z-10" />

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-right md:bg-center opacity-90 scale-100"
          style={{ backgroundImage: `url(${bgImg})` }}
        />

        {/* Commercial Grade Badge in the Corner (Without Yellow Dot) */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-8 z-30">
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#FAF6F0] shadow-xs">
            Commercial Grade
          </span>
        </div>

        {/* Top Branding */}
        <div className="relative z-20 flex items-center">
          <div className="flex items-center gap-2.5">
            <img
              src="/yolanda-logo.jpg"
              alt="Yolanda Logo"
              className="w-7 h-7 rounded-full object-cover shadow-xs border border-white/20"
            />
            <span className="text-[11px] uppercase tracking-widest text-[#FAF6F0]/90 font-bold">
              Yolanda Salon Equipment
            </span>
          </div>
        </div>

        {/* Hero Content - Clean & Luxury Editorial */}
        <div className="relative z-20 max-w-xl my-auto pt-6 pb-2 space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-[#FAF6F0] tracking-tight">
            {title.split(",")[0]}, <br />
            <span className="italic font-light text-[#FAF6F0]/90">
              {title.split(",")[1] || "Across Ethiopia."}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF6F0]/85 font-normal max-w-lg leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-3 flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("featured-products");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-7 py-3 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/15 text-xs font-bold transition-all shadow-[0_6px_20px_-2px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center gap-2 cursor-pointer group active:scale-[0.98]"
            >
              <span>{cta}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
