"use client";

import React from "react";
import { useShop } from "../context/ShopContext";
import { ArrowRight } from "lucide-react";

export default function CategorySlider() {
  const { categories, selectedCategory, setSelectedCategory } = useShop();

  return (
    <section id="category-section" className="mb-9 scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4F2D1C] tracking-tight">
            Shop By Salon Department
          </h2>
          <p className="text-xs text-[#4F2D1C]/70] mt-0.5">
            Equip your beauty, hair, or spa business with professional-grade machines.
          </p>
        </div>
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-xs font-semibold text-[#4F2D1C] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{selectedCategory ? "Show All Departments" : "View All"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Categories Grid (5 columns on desktop, swipeable on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
              className={`text-left rounded-2xl p-2.5 bg-white transition-all cursor-pointer group shadow-[0_2px_10px_rgba(46,26,17,0.03)] hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? "ring-2 ring-[#4F2D1C] bg-[#FAF6F0]/60"
                  : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full rounded-xl bg-[#FAF6F0] overflow-hidden mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-xs font-bold text-[#4F2D1C] group-hover:text-[#4F2D1C] transition truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#4F2D1C]/70]">
                    {cat.itemCount} items
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#4F2D1C] text-white"
                      : "bg-[#FAF6F0] text-[#4F2D1C] group-hover:translate-x-0.5"
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
