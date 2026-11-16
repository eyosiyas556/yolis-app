"use client";

import React from "react";

export default function HomeSkeleton() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAF6F0] text-[#4F2D1C] select-none">
      {/* ─── MOBILE SKELETON (< lg screens) ─── */}
      <div className="lg:hidden flex-1 overflow-y-auto min-h-0 flex flex-col">
        {/* Mobile Header Skeleton matching #4F2D1C brand header */}
        <div className="sticky top-0 z-30 bg-[#4F2D1C] px-4 pt-3 pb-3.5 shadow-md rounded-b-3xl">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
              <div className="space-y-1">
                <div className="w-20 h-3.5 bg-white/25 rounded-md animate-pulse" />
                <div className="w-28 h-2 bg-white/15 rounded-md animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-white/15 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-white/15 animate-pulse" />
              <div className="w-16 h-8 rounded-full bg-white/15 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Mobile Content Skeleton */}
        <div className="p-3.5 space-y-4 max-w-[430px] mx-auto w-full pb-20">
          {/* Hero Banner Skeleton */}
          <div className="w-full h-[195px] sm:h-[215px] rounded-[28px] bg-[#4F2D1C]/12 animate-pulse p-4 flex flex-col justify-between">
            <div className="w-32 h-5 rounded-full bg-white/40" />
            <div className="space-y-2">
              <div className="w-3/4 h-3 bg-white/40 rounded-md" />
              <div className="w-24 h-6 rounded-full bg-white/50" />
            </div>
          </div>

          {/* Trust Pillars Skeleton */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-13 h-13 rounded-2xl bg-[#4F2D1C]/8 border border-[#4F2D1C]/10 animate-pulse" />
                <div className="w-10 h-2 bg-[#4F2D1C]/15 rounded-md animate-pulse" />
              </div>
            ))}
          </div>

          {/* Category Dropdown Skeleton */}
          <div className="h-11 w-full rounded-2xl bg-white border border-[#4F2D1C]/15 shadow-xs animate-pulse flex items-center justify-between px-3.5">
            <div className="w-32 h-3.5 bg-[#4F2D1C]/15 rounded-md" />
            <div className="w-4 h-4 rounded-full bg-[#4F2D1C]/15" />
          </div>

          {/* Product Cards Grid Skeleton (2 columns) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[22px] p-2.5 border border-[#4F2D1C]/10 shadow-xs space-y-2.5 animate-pulse"
              >
                <div className="h-32 w-full rounded-2xl bg-[#4F2D1C]/8" />
                <div className="w-3/4 h-3 bg-[#4F2D1C]/15 rounded-md" />
                <div className="w-1/2 h-2.5 bg-[#4F2D1C]/10 rounded-md" />
                <div className="flex items-center justify-between pt-1">
                  <div className="w-16 h-3.5 bg-[#4F2D1C]/20 rounded-md" />
                  <div className="w-8 h-8 rounded-xl bg-[#4F2D1C]/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── DESKTOP SKELETON (hidden on mobile, visible on >= lg) ─── */}
      <div className="hidden lg:flex flex-col flex-1 overflow-hidden w-full">
        {/* Desktop Header Skeleton */}
        <div className="sticky top-0 z-40 bg-[#FAF6F0] px-8 py-3 border-b border-[#4F2D1C]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#4F2D1C]/15 animate-pulse" />
            <div className="w-36 h-4 bg-[#4F2D1C]/20 rounded-md animate-pulse" />
          </div>
          <div className="w-96 h-10 rounded-full bg-white border border-[#4F2D1C]/12 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-24 h-9 rounded-full bg-white border border-[#4F2D1C]/12 animate-pulse" />
            <div className="w-9 h-9 rounded-full bg-[#4F2D1C]/15 animate-pulse" />
          </div>
        </div>

        {/* Desktop Stage Content Skeleton */}
        <div className="flex-1 overflow-y-auto p-8 max-w-[1550px] mx-auto w-full space-y-8">
          <div className="w-full h-[320px] rounded-3xl bg-[#4F2D1C]/15 animate-pulse p-8 flex flex-col justify-between">
            <div className="w-40 h-6 rounded-full bg-white/40" />
            <div className="space-y-3 max-w-md">
              <div className="w-full h-8 bg-white/50 rounded-lg" />
              <div className="w-2/3 h-4 bg-white/40 rounded-md" />
              <div className="w-36 h-10 rounded-full bg-white/60" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-[#4F2D1C]/10 shadow-xs space-y-3 animate-pulse"
              >
                <div className="h-44 w-full rounded-xl bg-[#4F2D1C]/8" />
                <div className="w-3/4 h-4 bg-[#4F2D1C]/15 rounded-md" />
                <div className="w-1/2 h-3 bg-[#4F2D1C]/10 rounded-md" />
                <div className="flex items-center justify-between pt-2">
                  <div className="w-20 h-4 bg-[#4F2D1C]/20 rounded-md" />
                  <div className="w-9 h-9 rounded-xl bg-[#4F2D1C]/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
