"use client";

import React, { useState, useEffect, useRef } from "react";
import { useShop } from "../context/ShopContext";
import {
  X,
  User,
  Mail,
  Building2,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  ChevronDown,
  Check,
} from "lucide-react";

const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Hawassa",
  "Adama",
  "Bahir Dar",
  "Dire Dawa",
  "Dessie",
  "Mekelle",
  "Jimma",
  "Bishoftu",
  "Gondar",
  "Jigjiga",
  "Harar",
  "Shashemene",
  "Arba Minch",
];

export default function AccountModal() {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    currentUser,
    setCurrentUser,
  } = useShop();

  // Load real saved salon profile from localStorage or currentUser
  const [salonName, setSalonName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [address, setAddress] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Dropdown state for custom UI location card
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    }
    if (isLocationDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocationDropdownOpen]);

  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAccountModalOpen) {
        setIsAccountModalOpen(false);
      }
    };
    if (isAccountModalOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAccountModalOpen, setIsAccountModalOpen]);

  useEffect(() => {
    if (currentUser?.email && typeof window !== "undefined") {
      const savedSalon = localStorage.getItem(`yolanda_salon_name_${currentUser.email}`);
      const savedPhone = localStorage.getItem(`yolanda_phone_${currentUser.email}`);
      const savedCity = localStorage.getItem(`yolanda_city_${currentUser.email}`);
      const savedAddress = localStorage.getItem(`yolanda_address_${currentUser.email}`);

      setSalonName(savedSalon || "");
      setPhone(savedPhone || currentUser.phone || "");
      setCity(savedCity || "Addis Ababa");
      setAddress(savedAddress || "");
    } else if (currentUser?.phone) {
      setPhone(currentUser.phone);
    }
  }, [currentUser, isAccountModalOpen]);

  if (!isAccountModalOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.email) {
      localStorage.setItem(`yolanda_salon_name_${currentUser.email}`, salonName.trim());
      localStorage.setItem(`yolanda_phone_${currentUser.email}`, phone.trim());
      localStorage.setItem(`yolanda_city_${currentUser.email}`, city.trim());
      localStorage.setItem(`yolanda_address_${currentUser.email}`, address.trim());

      // Update real active user in context and persistent storage
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, phone: phone.trim() };
        try {
          localStorage.setItem("yolanda_customer", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2D1C14]/50 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={() => setIsAccountModalOpen(false)}
        aria-label="Close Account Settings"
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-10 max-w-full flex pl-4 sm:pl-10">
        <aside className="relative w-screen max-w-[440px] sm:max-w-[480px] h-full bg-[#FAF6F0] text-[#4F2D1C] border-l border-[#4F2D1C]/15 shadow-[-20px_0_50px_-15px_rgba(45,28,20,0.30)] flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Header Bar */}
          <header className="bg-white px-5 py-3.5 border-b border-[#4F2D1C]/12 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#4F2D1C] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 shadow-xs ring-2 ring-[#4F2D1C]/10">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser.fullName.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-base font-extrabold text-[#4F2D1C] tracking-tight truncate">
                  My Account
                </h2>
                <p className="text-[11px] text-[#4F2D1C]/70 truncate">
                  Profile & Delivery Details
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAccountModalOpen(false)}
              aria-label="Close Account Settings"
              className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-white border border-[#4F2D1C]/12 shadow-2xs active:scale-95 flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          </header>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 text-xs border border-[#4F2D1C]/10">
              <h3 className="font-serif text-sm font-bold text-[#4F2D1C] pb-1 border-b border-[#4F2D1C]/10">
                Salon Profile & Contact Details
              </h3>

              {/* Full Name (Read-only) */}
              <div>
                <label className="font-bold text-[#4F2D1C] block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#4F2D1C]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    disabled
                    value={currentUser.fullName}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF6F0] text-xs text-[#4F2D1C]/70 cursor-not-allowed border border-[#4F2D1C]/10"
                  />
                </div>
              </div>

              {/* Registered Email (Read-only) */}
              <div>
                <label className="font-bold text-[#4F2D1C] block mb-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#4F2D1C]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF6F0] text-xs text-[#4F2D1C]/70 cursor-not-allowed border border-[#4F2D1C]/10"
                  />
                </div>
              </div>

              {/* Salon / Business Name */}
              <div>
                <label className="font-bold text-[#4F2D1C] block mb-1">
                  Salon / Business Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#4F2D1C]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    placeholder="Enter your salon / studio name"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF6F0] text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 border border-[#4F2D1C]/15"
                  />
                </div>
              </div>

              {/* Contact Phone & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Contact Phone */}
                <div>
                  <label className="font-bold text-[#4F2D1C] block mb-1">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#4F2D1C]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 9... or 09..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF6F0] text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 border border-[#4F2D1C]/15"
                    />
                  </div>
                </div>

                {/* Hybrid Location Field */}
                <div className="relative" ref={locationDropdownRef}>
                  <label className="font-bold text-[#4F2D1C] block mb-1">
                    City / Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#4F2D1C]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Type or pick city..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FAF6F0] text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 border border-[#4F2D1C]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg hover:bg-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] transition cursor-pointer"
                      aria-label="Toggle location dropdown"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#4F2D1C]/70 transition-transform duration-200 ${
                          isLocationDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dropdown Card */}
                  {isLocationDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-[#4F2D1C]/15 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <div className="max-h-36 overflow-y-auto p-1 space-y-0.5">
                        {ETHIOPIAN_CITIES.map((cityName) => {
                          const isSelected = city.toLowerCase() === cityName.toLowerCase();
                          return (
                            <button
                              key={cityName}
                              type="button"
                              onClick={() => {
                                setCity(cityName);
                                setIsLocationDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? "bg-[#4F2D1C] text-white font-bold"
                                  : "text-[#4F2D1C] hover:bg-[#FAF6F0]"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <MapPin
                                  className={`w-3 h-3 shrink-0 ${
                                    isSelected ? "text-white" : "text-[#4F2D1C]/50"
                                  }`}
                                />
                                <span className="truncate">{cityName}</span>
                              </div>
                              {isSelected && (
                                <Check className="w-3 h-3 text-white shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Default Salon Address */}
              <div>
                <label className="font-bold text-[#4F2D1C] block mb-1">
                  Default Salon Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#4F2D1C]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Sub-city, building, floor, street, or landmark"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF6F0] text-xs text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 border border-[#4F2D1C]/15"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3 flex items-center justify-between border-t border-[#4F2D1C]/10">
                {isSaved ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Saved successfully!</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-[#4F2D1C]/60">
                    Saved securely for orders.
                  </span>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition flex items-center gap-2 shadow-[0_4px_12px_rgba(79,45,28,0.20)] active:scale-[0.98] cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
