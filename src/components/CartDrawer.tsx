"use client";

import React, { useEffect } from "react";
import { useShop } from "../context/ShopContext";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    setIsCheckoutOpen,
    clearCart,
  } = useShop();

  // Close on Escape key for desktop ergonomics
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    if (isCartOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  // Simple compact floating card if cart is empty (Option B)
  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200 flex items-center justify-center p-4">
        {/* Backdrop Area */}
        <div
          className="absolute inset-0 bg-[#2D1C14]/50 backdrop-blur-xs transition-opacity cursor-pointer"
          onClick={() => setIsCartOpen(false)}
          aria-label="Close Cart"
        />

        {/* Simple Compact Card */}
        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#FFFFFF] p-6 text-[#4F2D1C] shadow-2xl border border-[#4F2D1C]/15 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#4F2D1C]/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h3 className="font-serif text-base font-extrabold text-[#4F2D1C]">Salon Cart</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="w-7 h-7 rounded-full bg-[#FAF6F0] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Cart"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#4F2D1C]/12 mx-auto flex items-center justify-center text-[#4F2D1C]">
              <ShoppingCart className="w-6 h-6 stroke-[1.8] opacity-70" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#4F2D1C]">Your Cart is Empty</h4>
            <p className="text-xs text-[#4F2D1C]/70">No salon equipment added to your cart yet.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] font-bold text-xs tracking-wide transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Browse Salon Equipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200">
      {/* Backdrop Area (Click outside to close) */}
      <div
        className="absolute inset-0 bg-[#2D1C14]/50 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={() => setIsCartOpen(false)}
        aria-label="Close Cart"
      />

      {/* ========================================================
          1. MOBILE BOTTOM SHEET (< sm screens: 390x844 Optimized)
          ======================================================== */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-10 flex flex-col justify-end">
        <div className="relative w-full max-w-[430px] mx-auto h-[90vh] max-h-[844px] bg-[#FAF6F0] text-[#4F2D1C] rounded-t-[28px] border-t border-[#4F2D1C]/15 shadow-[0_-18px_45px_rgba(45,28,20,0.35)] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
          {/* Top Swipe-to-Dismiss Handle */}
          <div className="pt-2 pb-0.5 px-5 flex flex-col items-center shrink-0">
            <div className="w-10 h-1 rounded-full bg-[#4F2D1C]/20" />
          </div>

          {/* Minimized Mobile Header Bar */}
          <header className="px-4 py-2.5 border-b border-[#4F2D1C]/12 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingCart className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <h2 className="font-serif text-sm font-extrabold text-[#4F2D1C] tracking-tight truncate">
                  Salon Cart
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#4F2D1C]/10 border border-[#4F2D1C]/15 text-[#4F2D1C] text-[10px] font-extrabold shrink-0">
                  {cartCount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  aria-label="Clear all items in cart"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  <Trash2 className="w-3 h-3 text-rose-600 stroke-[2.2]" />
                  <span>Clear Cart</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close Cart"
                className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] border border-[#4F2D1C]/12 shadow-2xs active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </header>

          {/* Compact Mobile Items List or Empty State */}
          {cart.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5">
              {cart.map(({ product, quantity }) => {
                const categoryName =
                  typeof product.category === "object"
                    ? (product.category as any)?.name
                    : product.category || (product as any).department || "Salon Equipment";
                const unitPrice = product.price || (product as any).priceETB || 0;

                return (
                  <div
                    key={product.id}
                    className="bg-[#FFFFFF] rounded-xl p-2.5 border border-[#4F2D1C]/12 shadow-[0_4px_12px_-4px_rgba(79,45,28,0.06)] flex gap-3 items-center"
                  >
                    {/* Compact Product Thumbnail (56x56px) */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#FAF6F0] border border-[#4F2D1C]/12 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-[#FAF6F0] border border-[#4F2D1C]/10 text-[8px] font-extrabold uppercase tracking-wider text-[#4F2D1C]/70 truncate max-w-[140px]">
                          {categoryName}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="w-6 h-6 rounded text-[#4F2D1C]/45 hover:text-rose-700 hover:bg-rose-50 active:scale-95 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                        </button>
                      </div>

                      <h3 className="text-xs font-bold text-[#4F2D1C] leading-snug truncate mt-0.5">
                        {product.name}
                      </h3>

                      <div className="mt-1.5 pt-1 border-t border-[#4F2D1C]/[0.08] flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-extrabold text-[#2D1C14]">
                          ETB {unitPrice.toLocaleString()}
                        </span>

                        <div className="inline-flex items-center bg-[#FAF6F0] rounded-full p-0.5 border border-[#4F2D1C]/15 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 rounded-full bg-[#FFFFFF] text-[#4F2D1C] disabled:opacity-35 active:scale-90 flex items-center justify-center shadow-2xs transition-transform cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>

                          <span className="w-6 text-center font-mono text-xs font-extrabold text-[#4F2D1C]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-6 h-6 rounded-full bg-[#4F2D1C] text-[#FFFFFF] active:scale-90 flex items-center justify-center shadow-2xs transition-transform cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 p-4">
              <div className="bg-white rounded-2xl p-5 text-center shadow-xs border border-[#4F2D1C]/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center mx-auto border border-[#4F2D1C]/10">
                  <ShoppingCart className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4F2D1C]">
                    Your Cart is Empty
                  </h3>
                  <p className="text-xs text-[#4F2D1C]/70 mt-0.5">
                    No salon equipment added yet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition shadow-xs active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Browse Equipment</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
            </div>
          )}

          {/* Compact Mobile Footer */}
          {cart.length > 0 && (
            <footer className="bg-[#FFFFFF] px-4 pt-3 pb-5 border-t border-[#4F2D1C]/12 shadow-[0_-8px_20px_-5px_rgba(79,45,28,0.08)] space-y-2.5 shrink-0">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-extrabold text-[#4F2D1C]">
                  Total Amount Due
                </span>
                <span className="font-mono text-base font-extrabold text-[#2D1C14]">
                  ETB {cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full h-11 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] text-xs sm:text-sm font-extrabold shadow-[0_6px_16px_-3px_rgba(79,45,28,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.99] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Submit Order</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] text-[#FFFFFF]" />
              </button>

              <div className="w-24 h-1 rounded-full bg-[#4F2D1C]/15 mx-auto pt-0.5" />
            </footer>
          )}
        </div>
      </div>

      {/* ========================================================
          2. DESKTOP SLIDE-OVER DRAWER (sm: and up)
          ======================================================== */}
      <div className="hidden sm:flex fixed inset-y-0 right-0 z-10 max-w-full pl-10">
        <aside className="relative w-full max-w-[420px] h-full bg-[#FAF6F0] text-[#4F2D1C] border-l border-[#4F2D1C]/15 shadow-[-20px_0_50px_-15px_rgba(45,28,20,0.30)] flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Minimized Desktop Drawer Header */}
          <header className="bg-[#FAF6F0]/95 backdrop-blur-md px-5 py-3 border-b border-[#4F2D1C]/12 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingCart className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-serif text-base font-extrabold text-[#4F2D1C] tracking-tight truncate">
                  Your Salon Cart
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#4F2D1C]/10 border border-[#4F2D1C]/15 text-[#4F2D1C] text-[11px] font-extrabold shrink-0">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  aria-label="Clear all items in cart"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  <Trash2 className="w-3 h-3 text-rose-600 stroke-[2.2]" />
                  <span>Clear Cart</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                title="Close (Esc)"
                aria-label="Close Cart"
                className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] border border-[#4F2D1C]/12 shadow-2xs active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </header>

          {/* Optimized & Compact Desktop Items List */}
          {cart.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-5 py-3.5 space-y-2.5">
              {cart.map(({ product, quantity }) => {
                const categoryName =
                  typeof product.category === "object"
                    ? (product.category as any)?.name
                    : product.category || (product as any).department || "Salon Equipment";
                const unitPrice = product.price || (product as any).priceETB || 0;
                const lineTotalETB = unitPrice * quantity;

                return (
                  <div
                    key={product.id}
                    className="group bg-[#FFFFFF] rounded-xl p-3 border border-[#4F2D1C]/12 shadow-[0_4px_14px_-4px_rgba(79,45,28,0.06)] hover:border-[#4F2D1C]/25 transition-all flex gap-3 items-center"
                  >
                    {/* Optimized Thumbnail Size (64x64px) */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#FAF6F0] border border-[#4F2D1C]/12 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250"
                      />
                    </div>

                    {/* Product Details & Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#FAF6F0] border border-[#4F2D1C]/10 text-[9px] font-extrabold uppercase tracking-wider text-[#4F2D1C]/70 truncate max-w-[170px]">
                          {categoryName}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          title="Remove Equipment"
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
                        <div>
                          <span className="block text-[8px] font-bold uppercase tracking-wider text-[#4F2D1C]/50">
                            Line Total
                          </span>
                          <span className="font-mono text-xs font-extrabold text-[#2D1C14]">
                            ETB {lineTotalETB.toLocaleString()}
                          </span>
                        </div>

                        {/* Compact Stepper */}
                        <div className="inline-flex items-center bg-[#FAF6F0] rounded-full p-0.5 border border-[#4F2D1C]/15 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 rounded-full bg-[#FFFFFF] hover:bg-[#FAF6F0] text-[#4F2D1C] disabled:opacity-35 active:scale-90 flex items-center justify-center shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>

                          <span className="w-6 text-center font-mono text-xs font-extrabold text-[#4F2D1C]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-6 h-6 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] active:scale-90 flex items-center justify-center shadow-2xs transition-all cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 p-5">
              <div className="bg-white rounded-2xl p-6 text-center shadow-xs border border-[#4F2D1C]/10 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center mx-auto border border-[#4F2D1C]/10">
                  <ShoppingCart className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4F2D1C]">
                    Your Cart is Empty
                  </h3>
                  <p className="text-xs text-[#4F2D1C]/70 mt-0.5">
                    No salon equipment added yet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition shadow-xs active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Browse Equipment</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
            </div>
          )}

          {/* Clean Desktop Sticky Footer (Warranty Banner Removed) */}
          {cart.length > 0 && (
            <footer className="bg-[#FFFFFF] px-5 py-4 border-t border-[#4F2D1C]/12 shadow-[0_-8px_20px_-6px_rgba(79,45,28,0.08)] space-y-3 shrink-0">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-extrabold text-[#4F2D1C]">
                  Total Amount Due
                </span>
                <span className="font-mono text-lg font-extrabold text-[#2D1C14]">
                  ETB {cartTotal.toLocaleString()}
                </span>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full h-11 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] text-xs sm:text-sm font-extrabold shadow-[0_6px_16px_-3px_rgba(79,45,28,0.30),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.99] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Submit Order</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] text-[#FFFFFF]" />
              </button>
            </footer>
          )}
        </aside>
      </div>
    </div>
  );
}
