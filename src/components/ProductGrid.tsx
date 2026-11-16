"use client";

import React, { useState, useMemo } from "react";
import { useShop } from "../context/ShopContext";
import ProductCard from "./ProductCard";
import { Sparkles, X, ChevronDown, SlidersHorizontal } from "lucide-react";

export default function ProductGrid() {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery } = useShop();
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");

  const departmentChips = useMemo(() => {
    const activeProducts = products.filter((p) => p.inStock !== false);
    return [
      {
        id: "all",
        category: null,
        label: "All Equipment",
        count: activeProducts.length,
      },
      ...categories.map((c) => ({
        id: c.id,
        category: c.name,
        label: c.name,
        count: activeProducts.filter((p) => p.category === c.name).length,
      })),
    ];
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      // Out-of-stock products must not be visible on the customer shop page
      if (p.inStock === false) return false;

      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesSearch = searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subtitle ? p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
          (p.category ? p.category.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
          (p.description ? p.description.toLowerCase().includes(searchQuery.toLowerCase()) : false)
        : true;
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      list = [...list].sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="featured-products" className="mb-12 scroll-mt-20">
      {/* 1. Horizontal Department Filter Chips */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F2D1C]/70">
            Shop By Department
          </span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-[#4F2D1C] hover:text-[#4F2D1C]/80 hover:underline cursor-pointer sm:hidden"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Scrollable Horizontal Pill Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {departmentChips.map((chip) => {
            const isActive =
              chip.category === null ? selectedCategory === null : selectedCategory === chip.category;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  if (chip.category === null) {
                    setSelectedCategory(null);
                  } else if (selectedCategory === chip.category) {
                    setSelectedCategory(null); // Click active chip again to unselect
                  } else {
                    setSelectedCategory(chip.category);
                  }
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#4F2D1C] text-white shadow-md scale-[1.02]"
                    : "bg-white text-[#4F2D1C] hover:bg-[#FAF6F0] shadow-2xs border border-[#4F2D1C]/15 active:scale-[0.98]"
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-[#FAF6F0] text-[#4F2D1C]/70"
                  }`}
                >
                  {chip.count}
                </span>
                {isActive && chip.category !== null && (
                  <X className="w-3 h-3 opacity-80 hover:opacity-100 transition-opacity ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Sleek Divider */}
      <div className="h-px bg-[#4F2D1C]/10 mb-4" />

      {/* 3. Title & Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4F2D1C] tracking-tight">
              {selectedCategory ? selectedCategory : "All Salon Equipment & Supplies"}
            </h2>

            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-[#4F2D1C] font-bold shadow-2xs border border-[#4F2D1C]/15">
              {filteredProducts.length}
            </span>

            {/* Clear Filter placed right next to the title */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#4F2D1C] hover:text-[#4F2D1C]/80 hover:underline cursor-pointer"
              >
                <span>·</span>
                <span className="underline decoration-dotted">[ Reset ]</span>
              </button>
            )}
          </div>
          <p className="text-xs text-[#4F2D1C]/70 mt-0.5">
            Heavy-duty, commercial equipment for professional hair stylists, estheticians & makeup artists.
          </p>
        </div>

        {/* Sort Controls & Count */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#4F2D1C]/80">
            <span className="font-medium">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="appearance-none bg-white text-xs font-semibold text-[#4F2D1C] pl-3 pr-7 py-1.5 rounded-full shadow-2xs focus:outline-none cursor-pointer border border-[#4F2D1C]/15"
              >
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#4F2D1C]/60 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <span className="text-xs text-[#4F2D1C]/60 hidden sm:inline font-medium">
            Showing {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* 4. Products Grid (Expanded to 4 Columns on Desktop) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-3 shadow-xs border border-[#4F2D1C]/10">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#4F2D1C]">No equipment found</h3>
          <p className="text-xs text-[#4F2D1C]/70 max-w-sm mx-auto">
            We couldn't find any equipment matching "{searchQuery}". Try searching for steamers, hydra-facial, or styling chairs.
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
            }}
            className="px-5 py-2.5 rounded-full bg-[#4F2D1C] text-white text-xs font-bold hover:bg-[#2D1C14] transition cursor-pointer shadow-[0_4px_12px_rgba(79,45,28,0.20)] active:scale-[0.98]"
          >
            Show All Equipment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
