"use client";

import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { TESTIMONIALS } from "../data/mockData";
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, Sparkles } from "lucide-react";

export default function RightShowcase() {
  const { setSelectedCategory } = useShop();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const prevReview = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentTestimonial((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const activeReview = TESTIMONIALS[currentTestimonial];

  return (
    <aside className="hidden 2xl:flex flex-col gap-4 w-72 shrink-0">
      {/* 1. Category Showcase Card (Mocha) */}
      <div className="bg-[#4F2D1C] rounded-3xl p-5 text-white flex flex-col justify-between min-h-[220px] relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-1.5">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#FAF6F0]/80">
            Salon Essentials
          </span>
          <h3 className="font-serif text-lg font-bold leading-snug">
            Equip Your Salon <br />
            <span className="italic font-light text-[#FAF6F0]/90">Like A Pro</span>
          </h3>
          <p className="text-[11px] text-[#FAF6F0]/75 leading-relaxed pt-1">
            Complete workstations from shampoo beds to LED vanity units.
          </p>
        </div>

        <div className="relative z-10 pt-4">
          <button
            onClick={() => {
              const el = document.getElementById("category-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/15 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Explore Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Decorative circle */}
        <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5 blur-xs pointer-events-none" />
      </div>

      {/* 2. Limited Time Promotion Banner */}
      <div id="offers-section" className="bg-[#FAF6F0] rounded-3xl p-5 space-y-3 shadow-[0_2px_12px_rgba(79,45,28,0.03)] border border-[#4F2D1C]/10">
        <div className="flex items-center gap-2 text-[#4F2D1C]">
          <Truck className="w-4 h-4 text-[#4F2D1C]" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">
            Special Salon Offer
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#4F2D1C] leading-tight">
          Get 20% Off <br />
          <span className="text-xs font-sans font-normal text-[#4F2D1C]/70">
            on complete salon opening equipment bundles
          </span>
        </h3>

        <button
          onClick={() => setSelectedCategory("Hair Salon Equipment")}
          className="w-full py-2.5 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <span>Shop Bundles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Salon Owner Testimonial Slider */}
      <div className="bg-white rounded-3xl p-5 space-y-3 shadow-[0_2px_12px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10">
        <div className="flex items-center gap-2.5">
          <img
            src={activeReview.avatar}
            alt={activeReview.author}
            className="w-10 h-10 rounded-full object-cover shadow-xs"
          />
          <div>
            <h4 className="text-xs font-bold text-[#4F2D1C] leading-tight">
              {activeReview.author}
            </h4>
            <span className="text-[10px] text-[#4F2D1C]/70 block leading-tight">
              {activeReview.salon}
            </span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 text-amber-500">
          {[...Array(activeReview.rating)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-xs text-[#4F2D1C] italic font-serif leading-relaxed line-clamp-4">
          "{activeReview.quote}"
        </p>

        {/* Carousel arrows */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-[#4F2D1C]/70 font-medium">
            Verified Ethiopian Salon Owner
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={prevReview}
              className="w-6 h-6 rounded-full bg-[#FAF6F0] hover:bg-stone-200 flex items-center justify-center text-[#4F2D1C] transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextReview}
              className="w-6 h-6 rounded-full bg-[#FAF6F0] hover:bg-stone-200 flex items-center justify-center text-[#4F2D1C] transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Footer Accent Pill */}
      <div className="bg-[#FAF6F0] rounded-full p-2.5 px-4 flex items-center justify-between shadow-[0_2px_10px_rgba(79,45,28,0.03)] border border-[#4F2D1C]/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#4F2D1C] text-[#FAF6F0] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-serif font-bold text-[#4F2D1C]">
            Your Salon Journey Starts Here
          </span>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#4F2D1C] text-white flex items-center justify-center">
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </aside>
  );
}
