"use client";

import React from "react";
import { Award, ShieldCheck, Sparkles, Building2, Truck } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      title: "100% Commercial Grade",
      desc: "Heavy-duty for busy salons",
      icon: Award,
    },
    {
      title: "1-Year Salon Warranty",
      desc: "Parts & technical support",
      icon: ShieldCheck,
    },
    {
      title: "Salon Safe (220V)",
      desc: "Ethiopian voltage certified",
      icon: Sparkles,
    },
    {
      title: "Direct Salon Orders",
      desc: "Fast phone confirmation & support",
      icon: Building2,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 mb-8">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.title}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-[0_2px_12px_rgba(79,45,28,0.04)] hover:shadow-lg border border-[#4F2D1C]/10 hover:border-[#4F2D1C]/25 transition-all duration-300 hover:-translate-y-1 group cursor-default"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#4F2D1C] group-hover:scale-105 transition-all duration-200 shadow-2xs">
              <Icon className="w-5 h-5 text-[#4F2D1C] group-hover:text-white transition-colors duration-200" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#4F2D1C] group-hover:text-[#6e3e26] transition-colors leading-snug">
                {badge.title}
              </h4>
              <p className="text-[11px] text-[#4F2D1C]/70 mt-0.5 font-medium leading-tight">
                {badge.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
