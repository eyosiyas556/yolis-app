"use client";

import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { X, ArrowRight, ShoppingCart, Building2, Phone, MapPin, User, FileText } from "lucide-react";

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, placeOrder, currentUser } = useShop();

  const [formData, setFormData] = useState({
    salonName: "",
    contactPerson: "",
    phone: "",
    address: "",
    city: "Addis Ababa",
    orderNotes: "",
  });

  // Pre-fill with logged-in user profile details if available
  React.useEffect(() => {
    if (isCheckoutOpen && currentUser) {
      const savedSalon = typeof window !== "undefined" ? localStorage.getItem(`yolanda_salon_name_${currentUser.email}`) : "";
      const savedCity = typeof window !== "undefined" ? localStorage.getItem(`yolanda_city_${currentUser.email}`) : "";
      const savedAddress = typeof window !== "undefined" ? localStorage.getItem(`yolanda_address_${currentUser.email}`) : "";

      setFormData((prev) => ({
        ...prev,
        contactPerson: prev.contactPerson || currentUser.fullName || "",
        phone: prev.phone || currentUser.phone || "",
        salonName: prev.salonName || savedSalon || "",
        city: prev.city || savedCity || "Addis Ababa",
        address: prev.address || savedAddress || "",
      }));
    }
  }, [isCheckoutOpen, currentUser]);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.salonName.trim() || !formData.contactPerson.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg("Please fill in your salon details and contact address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder({
        salonName: formData.salonName.trim(),
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        orderNotes: formData.orderNotes.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#4F2D1C]/10">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4F2D1C]">
              Submit Salon Order
            </h2>
            <p className="text-xs text-[#4F2D1C]/70 mt-0.5">
              Enter your salon contact details to submit your equipment request.
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-full bg-[#FAF6F0] hover:bg-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#4F2D1C]" />
            <span className="font-bold text-[#4F2D1C]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Items in Order
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#4F2D1C]/70 block">Total Equipment Cost</span>
            <span className="font-mono font-extrabold text-[#4F2D1C] text-sm sm:text-base">
              ETB {cartTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4F2D1C] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#4F2D1C]" />
              <span>Salon & Customer Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  Salon Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Beauty & Hair Studio"
                  value={formData.salonName}
                  onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yolanda Mesfin"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  Your Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0911 234 567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  City / Region
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Addis Ababa"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  Salon Location / Address (Building, Street, Landmark) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bole Medhanialem, Next to Morning Star Mall, 2nd Floor"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  Order Notes / Inquiries (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific requests, voltage preferences, or timing details..."
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF6F0] rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#4F2D1C] hover:bg-[#4F2D1C] text-white shadow-[0_6px_14px_rgba(79,45,28,0.22)] active:scale-[0.98] text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Submitting Order..." : `Submit Order • ETB ${cartTotal.toLocaleString()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#4F2D1C]/70 mt-2">
              Our salon support team will contact you directly by phone to confirm your order.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
