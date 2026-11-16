"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useShop, OrderItem } from "../context/ShopContext";
import {
  X,
  Package,
  Repeat,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  Phone,
} from "lucide-react";

export default function TrackOrderModal() {
  const {
    trackingOrder,
    setTrackingOrder,
    isMyOrdersOpen,
    setIsMyOrdersOpen,
    addToCart,
    setIsCartOpen,
    orders,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");

  const isOpen = isMyOrdersOpen || !!trackingOrder;

  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsMyOrdersOpen(false);
        setTrackingOrder(null);
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsMyOrdersOpen, setTrackingOrder]);

  // 100% Real live database orders
  const allOrders = useMemo(() => {
    return orders || [];
  }, [orders]);

  const formatOrderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch {}
    return dateStr;
  };

  // Filter orders by search query (Order # or Phone)
  const displayOrders = useMemo(() => {
    if (!searchQuery.trim()) return allOrders;
    const q = searchQuery.toLowerCase().trim();
    return allOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q) ||
        o.customer.salonName.toLowerCase().includes(q)
    );
  }, [allOrders, searchQuery]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsMyOrdersOpen(false);
    setTrackingOrder(null);
    setSearchQuery("");
  };

  // Simple compact floating card if no orders exist (Option B)
  if (allOrders.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200 flex items-center justify-center p-4">
        {/* Backdrop Area */}
        <div
          className="absolute inset-0 bg-[#2D1C14]/50 backdrop-blur-xs transition-opacity cursor-pointer"
          onClick={handleClose}
          aria-label="Close"
        />

        {/* Simple Compact Card */}
        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#FFFFFF] p-6 text-[#4F2D1C] shadow-2xl border border-[#4F2D1C]/15 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#4F2D1C]/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                <Package className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h3 className="font-serif text-base font-extrabold text-[#4F2D1C]">My Orders</h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-[#FAF6F0] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#4F2D1C]/12 mx-auto flex items-center justify-center text-[#4F2D1C]">
              <Package className="w-6 h-6 stroke-[1.8] opacity-70" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#4F2D1C]">No Orders Placed Yet</h4>
            <p className="text-xs text-[#4F2D1C]/70">You haven't submitted any salon equipment requests yet.</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] font-bold text-xs tracking-wide transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Explore Salon Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleBuyAgain = (item: OrderItem) => {
    addToCart(item.product, item.quantity || 1);
    setIsCartOpen(true);
  };

  // Convert status to friendly label
  const getStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("CANCEL") || s.includes("REJECT")) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-rose-700 border border-[#4F2D1C]/10 shadow-2xs">
          <X className="w-3.5 h-3.5 text-rose-600" />
          <span>Cancelled</span>
        </span>
      );
    }
    if (s.includes("APPROVED") || s.includes("CONFIRMED") || s.includes("COMPLETED")) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-emerald-700 border border-[#4F2D1C]/10 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Confirmed</span>
        </span>
      );
    }
    if (s.includes("PROGRESS") || s.includes("REVIEW")) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-amber-800 border border-[#4F2D1C]/10 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>In Review</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-blue-700 border border-[#4F2D1C]/10 shadow-2xs">
        <Package className="w-3.5 h-3.5 text-blue-600" />
        <span>Sent</span>
      </span>
    );
  };

  // Order stage calculation for the progress bar (1 to 3)
  const getOrderStep = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("APPROVED") || s.includes("CONFIRMED") || s.includes("COMPLETED")) return 3;
    if (s.includes("PROGRESS") || s.includes("REVIEW")) return 2;
    return 1;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2D1C14]/50 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={handleClose}
        aria-label="Close My Orders"
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-10 max-w-full flex pl-4 sm:pl-10">
        <aside className="relative w-screen max-w-[440px] sm:max-w-[500px] h-full bg-[#FAF6F0] text-[#4F2D1C] border-l border-[#4F2D1C]/15 shadow-[-20px_0_50px_-15px_rgba(45,28,20,0.30)] flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Header Bar */}
          <header className="bg-white px-5 py-3.5 border-b border-[#4F2D1C]/12 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shadow-xs shrink-0">
                <Package className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-base font-extrabold text-[#4F2D1C] tracking-tight truncate">
                  My Salon Orders
                </h2>
                <p className="text-[11px] text-[#4F2D1C]/65 font-medium truncate">
                  Live status of your salon equipment orders
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close orders modal"
              className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] border border-[#4F2D1C]/12 shadow-2xs active:scale-95 flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </header>

          {/* Live Search & Track Input */}
          <div className="p-3 bg-[#FAF6F0] border-b border-[#4F2D1C]/10 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#4F2D1C]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order # or Phone..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs text-[#4F2D1C] placeholder:text-[#4F2D1C]/45 focus:outline-none focus:border-[#4F2D1C]/50 shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Orders Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {displayOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 text-center shadow-xs border border-[#4F2D1C]/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center mx-auto border border-[#4F2D1C]/10">
                  <Package className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4F2D1C]">
                    {searchQuery ? "No Matching Orders" : "No Orders Placed Yet"}
                  </h3>
                  <p className="text-xs text-[#4F2D1C]/70 mt-0.5">
                    {searchQuery
                      ? `No orders matching "${searchQuery}".`
                      : "Your equipment orders and live tracking will appear here."}
                  </p>
                </div>
              </div>
            ) : (
              displayOrders.map((ord) => {
                const currentStep = getOrderStep(ord.status);
                const isCancelled =
                  ord.status.toUpperCase().includes("CANCEL") ||
                  ord.status.toUpperCase().includes("REJECT");

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl shadow-xs border border-[#4F2D1C]/10 overflow-hidden space-y-3 transition hover:shadow-md"
                  >
                    {/* 1. Header: Order ID + Status */}
                    <div className="p-3.5 pb-2 bg-[#FAF6F0] flex items-center justify-between border-b border-[#4F2D1C]/10">
                      <div>
                        <span className="font-mono text-xs font-extrabold text-[#4F2D1C] block">
                          {ord.id}
                        </span>
                        <span className="text-[10px] text-[#4F2D1C]/65 font-medium block">
                          {formatOrderDate(ord.createdAt)}
                        </span>
                      </div>
                      <div>{getStatusBadge(ord.status)}</div>
                    </div>

                    {/* 2. Customer Summary */}
                    <div className="px-3.5 py-1 grid grid-cols-2 gap-2 text-xs text-[#4F2D1C]/80">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#4F2D1C]/50 block">
                          Salon
                        </span>
                        <p className="font-bold text-[#4F2D1C] truncate">
                          {ord.customer.salonName}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#4F2D1C]/50 block">
                          Contact
                        </span>
                        <p className="truncate flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#4F2D1C]/60" />
                          <span>{ord.customer.phone}</span>
                        </p>
                      </div>

                      <div className="col-span-2 pt-1 border-t border-[#4F2D1C]/5 flex items-start gap-1 text-[11px] text-[#4F2D1C]/70">
                        <MapPin className="w-3 h-3 text-[#4F2D1C]/60 shrink-0 mt-0.5" />
                        <span className="truncate">
                          {ord.customer.address}, {ord.customer.city}
                        </span>
                      </div>
                    </div>

                    {/* 3. Progress Timeline (Hidden if Cancelled) */}
                    {!isCancelled && (
                      <div className="px-3.5 py-2">
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-[#4F2D1C]/70 mb-1.5">
                          <span className={currentStep >= 1 ? "text-[#4F2D1C]" : ""}>
                            1. Submitted
                          </span>
                          <span className={currentStep >= 2 ? "text-[#4F2D1C]" : ""}>
                            2. Reviewing
                          </span>
                          <span className={currentStep >= 3 ? "text-emerald-700" : ""}>
                            3. Confirmed
                          </span>
                        </div>
                        <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden border border-[#4F2D1C]/10">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              currentStep === 3
                                ? "bg-emerald-600 w-full"
                                : currentStep === 2
                                ? "bg-amber-600 w-2/3"
                                : "bg-[#4F2D1C] w-1/3"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* 4. Equipment Items List */}
                    <div className="px-3.5 py-1 divide-y divide-[#4F2D1C]/10">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-[#FAF6F0] shrink-0 border border-[#4F2D1C]/10"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-[#4F2D1C] truncate leading-tight">
                                {item.product.name}
                              </h4>
                              <p className="text-[10px] text-[#4F2D1C]/70 mt-0.5">
                                Qty: {item.quantity} · ETB{" "}
                                {item.product.price.toLocaleString()} each
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleBuyAgain(item)}
                            className="px-3 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] text-xs font-extrabold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-xs active:scale-95"
                          >
                            <Repeat className="w-3 h-3" />
                            <span>Buy Again</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* 5. Total Cost */}
                    <div className="p-3.5 bg-white flex items-center justify-between border-t border-[#4F2D1C]/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4F2D1C]/70">
                        Total Order Amount
                      </span>
                      <span className="font-mono text-sm sm:text-base font-extrabold text-[#4F2D1C]">
                        ETB {ord.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
