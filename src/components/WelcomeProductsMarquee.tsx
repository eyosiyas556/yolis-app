"use client";

import React from "react";
import { useShop } from "../context/ShopContext";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function WelcomeProductsMarquee() {
  const { products, openAuthModal, currentUser } = useShop();

  // Only showcase available in-stock products on the welcome showcase
  const inStockProducts = products.filter((p) => p.inStock !== false);
  const displayProducts = [...inStockProducts, ...inStockProducts];

  return (
    <section className="space-y-2.5 sm:space-y-3.5 py-1 sm:py-1.5 overflow-hidden select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2.5 px-1">
        <div className="flex-1">
          <span className="text-[9px] sm:text-xs uppercase tracking-widest font-extrabold text-[#4F2D1C]/70 block">
            EQUIPMENT SHOWCASE
          </span>
          <h2 className="font-sans text-base sm:text-2xl md:text-3xl font-bold text-[#4F2D1C] tracking-tight mt-0.5 leading-snug">
            Heavy-Duty Salon &amp; Spa Machines
          </h2>
          <p className="hidden md:block text-sm text-[#4F2D1C]/70 mt-1">
            Pre-calibrated for Ethiopian electrical standards with full warranty service.
          </p>
        </div>

        {!currentUser && (
          <button
            type="button"
            onClick={() => openAuthModal("register")}
            aria-label="Unlock wholesale catalog"
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-white shadow-xs flex items-center justify-center shrink-0 transition cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Continuous Marquee Container */}
      <div className="relative w-full overflow-hidden py-1">
        {/* Animated Marquee Strip - Non-stoppable continuous roll */}
        <div className="animate-marquee gap-3 sm:gap-6 pl-1 pointer-events-none">
          {displayProducts.map((product, index) => {
            const badgeLabel = index % 2 === 0 ? "CERTIFIED" : "BEST SELLER";

            return (
              <div
                key={`${product.id}-${index}`}
                className="w-48 sm:w-72 shrink-0 bg-white rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 shadow-[0_4px_16px_rgba(46,26,17,0.04)] flex flex-col justify-between"
              >
                {/* Product Media */}
                <div>
                  <div className="relative aspect-4/3 w-full rounded-xl sm:rounded-2xl bg-[#FAF6F0] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#4F2D1C] text-white shadow-xs">
                        {badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="pt-2 sm:pt-3 space-y-0.5 sm:space-y-1">
                    <h3 className="font-sans text-xs sm:text-base font-bold text-[#4F2D1C] line-clamp-1 leading-snug">
                      {product.name}
                    </h3>
                    {product.subtitle?.trim() && (
                      <p className="text-[10px] sm:text-xs text-[#4F2D1C]/70 line-clamp-1 font-normal">
                        {product.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Spec badges only */}
                <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 flex items-center justify-between text-xs">
                  {product.specs?.warranty?.trim() ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#4F2D1C]">
                      <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4F2D1C]" />
                      <span>{product.specs.warranty}</span>
                    </div>
                  ) : <div />}

                  {product.specs?.grade?.trim() && (
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#4F2D1C] bg-[#FAF6F0] px-2 py-0.5 rounded-full shadow-2xs">
                      {product.specs.grade}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}