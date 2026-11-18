"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import {
  X,
  Star,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Award,
  Phone,
  XCircle,
  Truck,
  ChevronDown,
  Heart,
} from "lucide-react";

export default function ProductDetailModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCartOpen,
    currentUser,
    openAuthModal,
    toggleWishlist,
    isWishlisted,
  } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setIsDescriptionExpanded(false);
    setQuantity(1);
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const handleAdd = () => {
    if (!currentUser) {
      openAuthModal("login");
      return;
    }
    if (!selectedProduct.inStock) {
      return;
    }
    addToCart(selectedProduct, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setSelectedProduct(null);
      setIsCartOpen(true);
    }, 600);
  };

  const categoryName =
    typeof selectedProduct.category === "object"
      ? (selectedProduct.category as any)?.name
      : selectedProduct.category;

  const warranty =
    (selectedProduct as any).warranty?.trim() ||
    selectedProduct.specs?.warranty?.trim();

  const grade =
    (selectedProduct as any).grade?.trim() ||
    selectedProduct.specs?.grade?.trim();

  const voltage =
    (selectedProduct as any).voltage?.trim() ||
    selectedProduct.specs?.voltage?.trim();

  const power =
    (selectedProduct as any).power?.trim() ||
    selectedProduct.specs?.power?.trim();

  // Clean description without extra empty line spacing for compact single-card display
  const cleanDescription = selectedProduct.description
    ? selectedProduct.description
        .replace(/\n+/g, " • ")
        .replace(/•\s*•/g, "•")
        .trim()
    : "";

  return (
    <div
      onClick={() => setSelectedProduct(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg sm:max-w-xl w-full shadow-2xl border border-[#4F2D1C]/15 relative overflow-hidden max-h-[92vh] overflow-y-auto p-4 sm:p-5 space-y-3 animate-in zoom-in-95 duration-200 select-none"
      >
        {/* Top-Right Sleek Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF6F0] hover:bg-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] transition cursor-pointer border border-[#4F2D1C]/10"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Top Row: Compact Image + Identity & Price */}
        <div className="flex gap-3 sm:gap-4 items-start">
          {/* Product Thumbnail with Category Tag */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FAF6F0] overflow-hidden relative border border-[#4F2D1C]/10 shrink-0 shadow-2xs">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            {categoryName && (
              <span className="absolute bottom-1.5 left-1.5 text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4F2D1C]/90 backdrop-blur-xs text-white shadow-2xs max-w-[90%] truncate">
                {categoryName}
              </span>
            )}

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(selectedProduct.id)}
              aria-label={isWishlisted(selectedProduct.id) ? "Remove from Wishlist" : "Save to Wishlist"}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#4F2D1C]/10 active:scale-90 transition-all hover:bg-white cursor-pointer z-10"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isWishlisted(selectedProduct.id)
                    ? "fill-rose-500 text-rose-500"
                    : "text-[#4F2D1C]/60 hover:text-rose-500"
                }`}
              />
            </button>
          </div>

          {/* Product Info & Pricing */}
          <div className="flex-1 min-w-0 pr-6">
            {/* Warranty Status Pill */}
            {warranty && (
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[10px] text-[#4F2D1C] font-semibold bg-[#FAF6F0] border border-[#4F2D1C]/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#4F2D1C]" />
                  <span>{warranty}</span>
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="font-serif text-sm sm:text-base font-bold text-[#4F2D1C] leading-snug line-clamp-2">
              {selectedProduct.name}
            </h2>

            {/* Subtitle */}
            {selectedProduct.subtitle?.trim() && (
              <p className="text-[11px] text-[#4F2D1C]/70 line-clamp-1 mt-0.5">
                {selectedProduct.subtitle}
              </p>
            )}

            {/* Rating & Pricing Row */}
            <div className="mt-1.5 flex items-baseline justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-[11px] text-[#4F2D1C]/80">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const ratingVal = Number(selectedProduct.rating ?? 5);
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
                  <span className="font-bold text-[#4F2D1C] ml-1">
                    {Number(selectedProduct.rating ?? 5).toFixed(1)}
                  </span>
                </div>
                {selectedProduct.reviewsCount > 0 && (
                  <span className="text-[10px] text-[#4F2D1C]/60">
                    ({selectedProduct.reviewsCount})
                  </span>
                )}
              </div>

              {currentUser ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-base sm:text-lg font-extrabold text-[#4F2D1C]">
                    ETB {selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-[11px] text-[#4F2D1C]/50 line-through">
                      ETB {selectedProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[10px] font-bold text-[#4F2D1C] bg-[#FAF6F0] px-2 py-0.5 rounded-lg border border-[#4F2D1C]/15">
                  🔒 Wholesale Protected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Specs Chips */}
        {(grade || voltage || power) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {grade && (
              <span className="text-[10px] font-medium text-[#4F2D1C] bg-[#FAF6F0] px-2 py-0.5 rounded-lg border border-[#4F2D1C]/10 flex items-center gap-1">
                <Award className="w-3 h-3 text-[#4F2D1C]/70 shrink-0" />
                <span className="truncate max-w-[180px]">{grade}</span>
              </span>
            )}
            {voltage && (
              <span className="text-[10px] font-medium text-[#4F2D1C] bg-[#FAF6F0] px-2 py-0.5 rounded-lg border border-[#4F2D1C]/10 flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#4F2D1C]/70 shrink-0" />
                <span>{voltage}</span>
              </span>
            )}
            {power && (
              <span className="text-[10px] font-medium text-[#4F2D1C] bg-[#FAF6F0] px-2 py-0.5 rounded-lg border border-[#4F2D1C]/10 flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#4F2D1C]/70 shrink-0" />
                <span>{power}</span>
              </span>
            )}
          </div>
        )}

        {/* Description (Clickable & expandable on click to show full details) */}
        {cleanDescription ? (
          <div
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
            role="button"
            tabIndex={0}
            className="p-2.5 sm:p-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-[11px] sm:text-xs text-[#4F2D1C]/90 leading-relaxed cursor-pointer hover:bg-[#FAF6F0]/80 transition-all select-none group shadow-2xs"
            title="Click to expand or collapse full description"
          >
            <p className={isDescriptionExpanded ? "whitespace-pre-line max-h-52 overflow-y-auto pr-1" : "line-clamp-2"}>
              {isDescriptionExpanded ? selectedProduct.description : cleanDescription}
            </p>
            <div className="mt-1 flex items-center justify-center text-[#4F2D1C]/50 group-hover:text-[#4F2D1C] transition-colors">
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDescriptionExpanded ? "rotate-180" : ""}`} />
            </div>
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-[#FAF6F0]/60 text-[10px] sm:text-[11px] text-[#4F2D1C]/60 italic border border-[#4F2D1C]/10">
            Standard commercial salon equipment. Fast dispatch across Addis Ababa.
          </div>
        )}

        {/* Action Row: Stepper & Action Button */}
        <div className="pt-1 flex items-center gap-2.5">
          {currentUser && selectedProduct.inStock && (
            <div className="flex items-center rounded-full px-2.5 py-1.5 bg-[#FAF6F0] border border-[#4F2D1C]/15 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#4F2D1C] hover:bg-[#4F2D1C]/10 rounded-full transition cursor-pointer"
              >
                -
              </button>
              <span className="px-2.5 text-xs font-mono font-bold text-[#4F2D1C]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#4F2D1C] hover:bg-[#4F2D1C]/10 rounded-full transition cursor-pointer"
              >
                +
              </button>
            </div>
          )}

          {currentUser ? (
            selectedProduct.inStock ? (
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition-all duration-75 active:scale-95 flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {addedNotice
                    ? "Added to Cart!"
                    : `Add to Cart • ETB ${(selectedProduct.price * quantity).toLocaleString()}`}
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-full bg-stone-200 text-stone-500 text-xs font-bold transition flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <XCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Currently Out of Stock</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-2.5 sm:py-3 px-4 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer"
            >
              <span>Sign In with Name & Password to Buy</span>
            </button>
          )}
        </div>

        {/* Compact Footer Hotline & Fast Dispatch Banner */}
        <div className="flex items-center justify-between text-[10px] text-[#4F2D1C]/70 pt-0.5 px-0.5 border-t border-[#4F2D1C]/10">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-[#4F2D1C]/80 shrink-0" />
            <span>
              Support: <strong className="text-[#4F2D1C]">+251 911 234 567</strong>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#4F2D1C]/80">
            <Truck className="w-3 h-3 shrink-0" />
            <span>Addis Ababa Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
