"use client";

import React from "react";

export default function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#4F2D1C] flex select-none">
      {/* ─── SIDEBAR SKELETON (Desktop) ─── */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#4F2D1C]/10 p-5 space-y-6 shrink-0">
        {/* Brand Logo & Name Placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4F2D1C]/15 animate-pulse shrink-0" />
          <div className="space-y-1">
            <div className="w-24 h-4 bg-[#4F2D1C]/20 rounded-md animate-pulse" />
            <div className="w-20 h-2 bg-[#4F2D1C]/10 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="space-y-3 pt-3 flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-11 rounded-2xl bg-[#4F2D1C]/8 border border-[#4F2D1C]/5 animate-pulse flex items-center px-4 gap-3"
            >
              <div className="w-5 h-5 rounded-lg bg-[#4F2D1C]/15" />
              <div className="w-24 h-3 bg-[#4F2D1C]/15 rounded-md" />
            </div>
          ))}
        </div>

        {/* Footer Admin User */}
        <div className="pt-4 border-t border-[#4F2D1C]/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#4F2D1C]/15 animate-pulse" />
          <div className="space-y-1">
            <div className="w-20 h-3 bg-[#4F2D1C]/20 rounded-md animate-pulse" />
            <div className="w-16 h-2 bg-[#4F2D1C]/10 rounded-md animate-pulse" />
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT SKELETON ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operations Bar */}
        <header className="h-16 bg-white border-b border-[#4F2D1C]/10 px-6 flex items-center justify-between shrink-0">
          <div className="w-36 h-5 bg-[#4F2D1C]/20 rounded-md animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-48 h-9 rounded-full bg-[#FAF6F0] border border-[#4F2D1C]/10 animate-pulse hidden sm:block" />
            <div className="w-9 h-9 rounded-full bg-[#4F2D1C]/15 animate-pulse" />
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Header Action Row */}
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-44 h-6 bg-[#4F2D1C]/20 rounded-md animate-pulse" />
              <div className="w-64 h-3 bg-[#4F2D1C]/10 rounded-md animate-pulse" />
            </div>
            <div className="w-32 h-10 rounded-xl bg-[#4F2D1C]/15 animate-pulse" />
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#4F2D1C]/10 shadow-xs space-y-3 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="w-20 h-3 bg-[#4F2D1C]/15 rounded-md" />
                  <div className="w-8 h-8 rounded-xl bg-[#4F2D1C]/10" />
                </div>
                <div className="w-24 h-6 bg-[#4F2D1C]/25 rounded-md" />
                <div className="w-16 h-2 bg-[#4F2D1C]/10 rounded-md" />
              </div>
            ))}
          </div>

          {/* Main Stage Table / Chart Card */}
          <div className="bg-white rounded-2xl border border-[#4F2D1C]/10 shadow-xs p-6 space-y-4 animate-pulse">
            <div className="flex items-center justify-between border-b border-[#4F2D1C]/10 pb-4">
              <div className="w-36 h-4 bg-[#4F2D1C]/20 rounded-md" />
              <div className="w-24 h-8 rounded-lg bg-[#FAF6F0]" />
            </div>
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map((row) => (
                <div
                  key={row}
                  className="h-12 rounded-xl bg-[#FAF6F0] flex items-center justify-between px-4"
                >
                  <div className="w-32 h-3 bg-[#4F2D1C]/15 rounded-md" />
                  <div className="w-24 h-3 bg-[#4F2D1C]/15 rounded-md" />
                  <div className="w-16 h-3 bg-[#4F2D1C]/15 rounded-md" />
                  <div className="w-20 h-6 bg-[#4F2D1C]/10 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
