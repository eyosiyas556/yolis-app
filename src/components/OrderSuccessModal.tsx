"use client";

import React from "react";
import { useShop } from "../context/ShopContext";
import { CheckCircle2, PhoneCall } from "lucide-react";

export default function OrderSuccessModal() {
  const {
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    lastOrder,
  } = useShop();

  if (!isOrderSuccessOpen || !lastOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center mx-auto border border-[#4F2D1C]/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#4F2D1C] bg-[#FAF6F0] px-3 py-1 rounded-full">
            Order #{lastOrder.id}
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#4F2D1C] pt-1">
            Order Submitted Successfully!
          </h2>
          <p className="text-xs text-[#4F2D1C]/70] max-w-sm mx-auto leading-relaxed">
            Thank you, <strong className="text-[#4F2D1C]">{lastOrder.customer.salonName}</strong>. We have received your equipment order for <strong className="text-[#4F2D1C]">ETB {lastOrder.total.toLocaleString()}</strong>.
          </p>
        </div>

        {/* Confirmation Status Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] text-left space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#4F2D1C]">Order Status:</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#4F2D1C]/10 text-emerald-800">
              Received & In Review
            </span>
          </div>
          <div className="flex items-start gap-2 pt-1 text-[11px] text-[#4F2D1C]/80">
            <PhoneCall className="w-3.5 h-3.5 text-[#4F2D1C] shrink-0 mt-0.5" />
            <p>
              Our salon support team will contact you directly at <strong className="text-[#4F2D1C]">{lastOrder.customer.phone}</strong> to confirm your equipment order.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsOrderSuccessOpen(false)}
            className="w-full py-3 rounded-full bg-[#4F2D1C] hover:bg-[#4F2D1C] text-white shadow-[0_6px_14px_rgba(79,45,28,0.22)] active:scale-[0.98] text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Continue Browsing Equipment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
