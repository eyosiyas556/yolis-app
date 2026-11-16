"use client";

import React, { useEffect } from "react";
import { useShop } from "../context/ShopContext";
import {
  Heart,
  X,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function WishlistDrawer() {
  const {
    products,
    wishlistIds,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    addToCart,
    setSelectedProduct,
  } = useShop();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsWishlistOpen(false);
    };
    if (isWishlistOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWishlistOpen, setIsWishlistOpen]);

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter(
    (p) => wishlistIds.includes(p.id) && p.inStock !== false
  );

  // Simple compact floating card if wishlist is empty (Option B)
  if (wishlistedProducts.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200 flex items-center justify-center p-4">
        {/* Backdrop Area */}
        <div
          className="absolute inset-0 bg-[#2D1C14]/50 backdrop-blur-xs transition-opacity cursor-pointer"
          onClick={() => setIsWishlistOpen(false)}
          aria-label="Close Wishlist"
        />

        {/* Simple Compact Card */}
        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#FFFFFF] p-6 text-[#4F2D1C] shadow-2xl border border-[#4F2D1C]/15 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#4F2D1C]/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                <Heart className="w-4 h-4 fill-white stroke-[2]" />
              </div>
              <h3 className="font-serif text-base font-extrabold text-[#4F2D1C]">My Wishlist</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="w-7 h-7 rounded-full bg-[#FAF6F0] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Wishlist"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 mx-auto flex items-center justify-center text-rose-500">
              <Heart className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#4F2D1C]">Your Wishlist is Empty</h4>
            <p className="text-xs text-[#4F2D1C]/70">No saved salon equipment or supplies yet.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] font-bold text-xs tracking-wide transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Explore Salon Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2D1C14]/50 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={() => setIsWishlistOpen(false)}
        aria-label="Close Wishlist"
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-10 max-w-full flex pl-6 sm:pl-10">
        <aside className="relative w-screen max-w-[420px] h-full bg-[#FAF6F0] text-[#4F2D1C] border-l border-[#4F2D1C]/15 shadow-[-20px_0_50px_-15px_rgba(45,28,20,0.30)] flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Header Bar */}
          <header className="bg-[#FAF6F0]/95 backdrop-blur-md px-5 py-3 border-b border-[#4F2D1C]/12 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                <Heart className="w-4 h-4 fill-white stroke-[2]" />
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-serif text-base font-extrabold text-[#4F2D1C] tracking-tight truncate">
                  My Wishlist
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#4F2D1C]/10 border border-[#4F2D1C]/15 text-[#4F2D1C] text-[11px] font-extrabold shrink-0">
                  {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              title="Close (Esc)"
              aria-label="Close Wishlist"
              className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] border border-[#4F2D1C]/12 shadow-2xs active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          </header>

          {/* Wishlist Items List */}
          {wishlistedProducts.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3.5 space-y-2.5">
              {wishlistedProducts.map((product) => {
                const categoryName =
                  typeof product.category === "object"
                    ? (product.category as any)?.name
                    : product.category || (product as any).department || "Salon Equipment";
                const price = product.price || (product as any).priceETB || 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsWishlistOpen(false);
                    }}
                    className="group bg-[#FFFFFF] rounded-xl p-3 border border-[#4F2D1C]/12 shadow-[0_4px_14px_-4px_rgba(79,45,28,0.06)] hover:border-[#4F2D1C]/25 transition-all flex gap-3 items-center cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#FAF6F0] border border-[#4F2D1C]/12 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#FAF6F0] border border-[#4F2D1C]/10 text-[9px] font-extrabold uppercase tracking-wider text-[#4F2D1C]/70 truncate max-w-[150px]">
                          {categoryName}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          title="Remove from wishlist"
                          aria-label={`Remove ${product.name}`}
                          className="w-6 h-6 rounded text-[#4F2D1C]/40 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                        </button>
                      </div>

                      <h3 className="text-xs font-bold text-[#4F2D1C] leading-snug truncate mt-0.5">
                        {product.name}
                      </h3>

                      <div className="mt-2 pt-1.5 border-t border-[#4F2D1C]/[0.08] flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#2D1C14]">
                          ETB {Number(price).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white bg-[#4F2D1C] hover:bg-[#2D1C14] transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 px-8 py-12 flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 rounded-full bg-[#FFFFFF] border border-[#4F2D1C]/12 shadow-[0_10px_25px_-6px_rgba(79,45,28,0.12)] flex items-center justify-center text-rose-500 mb-4">
                <Heart className="w-8 h-8 stroke-[1.8]" />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FAF6F0] border border-[#4F2D1C]/15 flex items-center justify-center text-[#4F2D1C]">
                  <Sparkles className="w-3 h-3" />
                </span>
              </div>

              <h3 className="font-serif text-xl font-extrabold text-[#4F2D1C]">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[#4F2D1C]/65 max-w-[260px] leading-relaxed mt-1.5">
                Save your favorite styling chairs, steamers, and facial equipment
                to order them anytime.
              </p>

              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="mt-6 h-10 px-6 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] text-xs font-extrabold shadow-[0_6px_16px_rgba(79,45,28,0.25)] active:scale-95 inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>
          )}

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <footer className="bg-[#FFFFFF] px-5 py-4 border-t border-[#4F2D1C]/12 shadow-[0_-8px_20px_-6px_rgba(79,45,28,0.08)] space-y-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  wishlistedProducts.forEach((p) => addToCart(p, 1));
                  setIsWishlistOpen(false);
                }}
                className="w-full h-11 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] text-xs sm:text-sm font-extrabold shadow-[0_6px_16px_-3px_rgba(79,45,28,0.30),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.99] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
            </footer>
          )}
        </aside>
      </div>
    </div>
  );
}
