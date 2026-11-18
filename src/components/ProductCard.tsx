"use client";

import React, { useState } from "react";
import { Product } from "../data/mockData";
import { useShop } from "../context/ShopContext";
import { Star, ShoppingCart, Check, Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const {
    addToCart,
    setSelectedProduct,
    currentUser,
    openAuthModal,
    toggleWishlist,
    isWishlisted,
  } = useShop();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      openAuthModal("login");
      return;
    }
    if (product.inStock === false) {
      return;
    }
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const isSaved = isWishlisted(product.id);

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-[0_2px_12px_rgba(79,45,28,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-[#4F2D1C]/10 relative"
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl bg-[#FAF6F0] overflow-hidden flex items-center justify-center mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Quick View Floating Hint (Desktop hover) */}
          <div className="absolute inset-x-0 bottom-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider uppercase shadow-md">
              Quick View
            </span>
          </div>

          {/* Floating Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#4F2D1C]/10 active:scale-90 transition-all hover:bg-white cursor-pointer z-10"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved
                  ? "fill-rose-500 text-rose-500"
                  : "text-[#4F2D1C]/60 hover:text-rose-500"
              }`}
            />
          </button>
        </div>

        {/* Department / Category Pill */}
        {product.category && (
          <div className="mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#4F2D1C]/75 border border-[#4F2D1C]/10 inline-block">
              {product.category}
            </span>
          </div>
        )}

        {/* Equipment Name */}
        <h3 className="font-serif text-xs sm:text-sm font-bold text-[#4F2D1C] group-hover:text-[#6e3e26] transition-colors line-clamp-2 leading-snug min-h-[2.4rem]">
          {product.name}
        </h3>

        {/* Side-by-Side: Rating & Money (Price) */}
        <div className="flex items-center justify-between pt-2.5">
          {/* Rating: 5 Star Icons */}
          <div className="flex items-center gap-0.5" title={`Rated ${Number(product.rating ?? 5).toFixed(1)} out of 5`}>
            {[1, 2, 3, 4, 5].map((star) => {
              const ratingVal = Number(product.rating ?? 5);
              const isFilled = star <= Math.round(ratingVal);
              return (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    isFilled
                      ? "fill-amber-400 text-amber-400"
                      : "fill-[#4F2D1C]/10 text-[#4F2D1C]/25"
                  }`}
                />
              );
            })}
            <span className="text-[11px] font-bold text-[#4F2D1C]/80 ml-1">
              {Number(product.rating ?? 5).toFixed(1)}
            </span>
            {product.reviewsCount !== undefined && (
              <span className="text-[10px] text-[#4F2D1C]/50 font-normal">
                ({product.reviewsCount})
              </span>
            )}
          </div>

          {/* Money / Price */}
          <span className="text-xs sm:text-sm font-black text-[#4F2D1C] font-mono tracking-tight">
            ETB {Number(product.price || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Underneath: Add to Cart Button */}
      <div className="pt-3 mt-2.5 border-t border-[#4F2D1C]/10">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-75 active:scale-95 cursor-pointer ${
            product.inStock === false
              ? "bg-stone-200 text-stone-500 cursor-not-allowed"
              : justAdded
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-[#4F2D1C] hover:bg-[#2D1C14] text-white shadow-[0_4px_14px_rgba(79,45,28,0.18),inset_0_1px_2px_rgba(255,255,255,0.2)]"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : product.inStock === false ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
