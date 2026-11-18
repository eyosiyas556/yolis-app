"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useShop, DEFAULT_WELCOME_SETTINGS, Order } from "../context/ShopContext";
import { Product } from "../data/mockData";
import {
  Search,
  ShoppingCart,
  Award,
  ShieldCheck,
  Zap,
  Building2,
  Star,
  Check,
  Box,
  User,
  LogOut,
  Home,
  LayoutGrid,
  Heart,
  X,
  ChevronDown,
  ArrowLeft,
  Repeat,
  Clock,
  CheckCircle2,
  MapPin,
  Phone,
  Package,
  Plus,
} from "lucide-react";

export interface StorefrontProduct {
  id: string;
  name: string;
  department: string;
  rating: string;
  priceETB: number;
  inStock: boolean;
  imageUrl: string;
}

export default function MobileHomeView() {
  const {
    products,
    categories,
    currentUser,
    cartCount,
    addToCart,
    setIsCartOpen,
    orders,
    setIsAccountModalOpen,
    logoutUser,
    setSelectedProduct,
    welcomeSettings,
    setActiveNavTab,
    wishlistIds,
    toggleWishlist: shopToggleWishlist,
  } = useShop();

  const ws = welcomeSettings || DEFAULT_WELCOME_SETTINGS;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Equipment");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const [sortBy, setSortBy] = useState("Popular");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [activeBottomTab, setActiveBottomTab] = useState<
    "home" | "products" | "wishlist" | "orders" | "account"
  >("home");
  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    shopToggleWishlist(productId);
  };

  const [orderTimeFilter, setOrderTimeFilter] = useState<"all" | "24h" | "week" | "month">("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // 100% Real live database orders (no dummy fallback)
  const allOrdersList: Order[] = useMemo(() => {
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

  const filteredOrders = useMemo(() => {
    return allOrdersList.filter((ord) => {
      // 1. Time filter
      if (orderTimeFilter !== "all") {
        const now = new Date();
        const d = new Date(ord.createdAt);
        if (isNaN(d.getTime())) {
          const lower = (ord.createdAt || "").toLowerCase();
          const isToday = lower.includes("today") || lower.includes("hour") || lower.includes("min");
          if (!isToday && orderTimeFilter === "24h") return false;
        } else {
          const diffMs = now.getTime() - d.getTime();
          if (diffMs > 0) {
            if (orderTimeFilter === "24h" && diffMs > 24 * 60 * 60 * 1000) return false;
            if (orderTimeFilter === "week" && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
            if (orderTimeFilter === "month" && diffMs > 30 * 24 * 60 * 60 * 1000) return false;
          }
        }
      }

      // 2. Search query filter
      if (!orderSearchQuery.trim()) return true;
      const q = orderSearchQuery.toLowerCase().trim();
      return (
        ord.id.toLowerCase().includes(q) ||
        ord.customer.phone.toLowerCase().includes(q) ||
        ord.customer.salonName.toLowerCase().includes(q)
      );
    });
  }, [allOrdersList, orderTimeFilter, orderSearchQuery]);

  const getOrderBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("CANCEL") || s.includes("REJECT")) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-rose-700 border border-[#4F2D1C]/10 shadow-2xs">
          <X className="w-3 h-3 text-rose-600" />
          <span>Cancelled</span>
        </span>
      );
    }
    if (s.includes("APPROVED") || s.includes("CONFIRMED") || s.includes("COMPLETED")) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-emerald-700 border border-[#4F2D1C]/10 shadow-2xs">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Confirmed</span>
        </span>
      );
    }
    if (s.includes("PROGRESS") || s.includes("REVIEW")) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-amber-800 border border-[#4F2D1C]/10 shadow-2xs">
          <Clock className="w-3 h-3 text-amber-700" />
          <span>In Review</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-blue-700 border border-[#4F2D1C]/10 shadow-2xs">
        <Package className="w-3 h-3 text-blue-600" />
        <span>Sent</span>
      </span>
    );
  };

  const getStepNumber = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("APPROVED") || s.includes("CONFIRMED") || s.includes("COMPLETED")) return 3;
    if (s.includes("PROGRESS") || s.includes("REVIEW")) return 2;
    return 1;
  };

  // User initials & name
  const fullName = currentUser?.fullName || "fiker yilkal";
  const firstName = fullName.split(" ")[0].toLowerCase() || "fiker";
  const email = currentUser?.email || "fiker@gmail.com";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "FI";

  const memberBadge =
    currentUser?.role === "ADMIN" ? "ADMINISTRATOR" : "SALON PRO MEMBER";

  // Exact 4 Departments + dynamic categories from database
  const departments = useMemo(() => {
    const list = [
      "All Equipment",
      "Facial & Spa Machines",
      "Hair Salon Equipment",
      "Makeup & Vanity Stations",
    ];
    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        if (!list.includes(cat.name)) list.push(cat.name);
      });
    }
    return list;
  }, [categories]);

  // Exact 4 Trust Pillars mapped to the circular icon row
  const trustPillars = [
    {
      title: "100% Commercial Grade",
      subtitle: "Heavy-duty for busy salons",
      icon: Award,
    },
    {
      title: "1-Year Salon Warranty",
      subtitle: "Parts & technical support",
      icon: ShieldCheck,
    },
    {
      title: "Salon Safe (220V)",
      subtitle: "Ethiopian voltage certified",
      icon: Zap,
    },
    {
      title: "Direct Salon Orders",
      subtitle: "Fast phone confirmation & support",
      icon: Building2,
    },
  ];

  // Fallback 8 products matching your exact snippet
  const fallbackProducts: StorefrontProduct[] = [
    {
      id: "item-1",
      name: "Ergonomic Makeup Artist Rolling Studio Trolley",
      department: "Makeup & Vanity Stations",
      rating: "5.0",
      priceETB: 16000,
      inStock: true,
      imageUrl:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "item-2",
      name: "Portable High-Frequency Therapy Wand System",
      department: "Facial & Spa Machines",
      rating: "5.0",
      priceETB: 18500,
      inStock: false,
      imageUrl:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "item-3",
      name: "Ceramic Shampoo Backwash Basin Unit",
      department: "Hair Salon Equipment",
      rating: "5.0",
      priceETB: 52000,
      inStock: true,
      imageUrl:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "item-4",
      name: "Multi-Function 7-in-1 Facial Beauty Tower",
      department: "Facial & Spa Machines",
      rating: "5.0",
      priceETB: 95000,
      inStock: true,
      imageUrl:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "item-5",
      name: "Professional Hollywood LED Vanity Station & Mirror",
      department: "Makeup & Vanity Stations",
      rating: "5.0",
      priceETB: 38500,
      inStock: true,
      imageUrl:
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "item-6",
      name: "Hydraulic Reclining Barber & Styling Chair",
      department: "Hair Salon Equipment",
      rating: "5.0",
      priceETB: 42000,
      inStock: true,
      imageUrl:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "item-7",
      name: "Nano-Mist Standing Hair & Scalp Steamer",
      department: "Hair Salon Equipment",
      rating: "5.0",
      priceETB: 34000,
      inStock: true,
      imageUrl:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "item-8",
      name: "Pro Hydra-Facial Dermabrasion 9-in-1 Machine",
      department: "Facial & Spa Machines",
      rating: "5.0",
      priceETB: 88500,
      inStock: true,
      imageUrl:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    },
  ];

  // Convert database products or fallback to StorefrontProduct format
  const sourceProducts: StorefrontProduct[] = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p) => {
        const catName =
          typeof p.category === "object"
            ? (p.category as any)?.name
            : p.category;
        return {
          id: p.id,
          name: p.name,
          department: catName || "All Equipment",
          rating: p.rating ? Number(p.rating).toFixed(1) : "5.0",
          priceETB: p.price,
          inStock: p.inStock,
          imageUrl: p.image,
        };
      });
    }
    return fallbackProducts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return sourceProducts
      .filter((item) => {
        // Out-of-stock products must not be visible on the mobile shop page
        if (item.inStock === false) return false;

        const matchesDepartment =
          selectedDepartment === "All Equipment" ||
          item.department.toLowerCase() === selectedDepartment.toLowerCase();
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesDepartment && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "Price: Low to High") return a.priceETB - b.priceETB;
        if (sortBy === "Price: High to Low") return b.priceETB - a.priceETB;
        return 0;
      });
  }, [sourceProducts, selectedDepartment, searchQuery, sortBy]);

  // Valid wishlist products that actually exist in current catalog
  const wishlistProducts = useMemo(() => {
    return sourceProducts.filter((item) => wishlistIds.includes(item.id));
  }, [sourceProducts, wishlistIds]);

  const displayedProducts = useMemo(() => {
    if (activeBottomTab === "wishlist") {
      return wishlistProducts;
    }
    return filteredProducts;
  }, [activeBottomTab, wishlistProducts, filteredProducts]);

  const handleAdd = (product: StorefrontProduct) => {
    if (!product.inStock) return;
    setAddedId(product.id);

    // Find original product or adapt for addToCart
    const orig = products.find((p) => p.id === product.id);
    if (orig) {
      addToCart(orig, 1);
    } else {
      addToCart(
        {
          id: product.id,
          name: product.name,
          category: product.department,
          subtitle: "Commercial Salon Equipment",
          rating: Number(product.rating),
          reviewsCount: 12,
          price: product.priceETB,
          inStock: product.inStock,
          image: product.imageUrl,
          description: product.name,
          benefits: [],
          specs: { grade: "Commercial", warranty: "1 Year" },
        } as Product,
        1
      );
    }

    setTimeout(() => setAddedId(null), 1200);
  };

  const handleOpenProduct = (product: StorefrontProduct) => {
    const orig = products.find((p) => p.id === product.id);
    if (orig) {
      setSelectedProduct(orig);
    } else {
      setSelectedProduct({
        id: product.id,
        name: product.name,
        category: product.department,
        subtitle: "Commercial Salon Equipment",
        rating: Number(product.rating),
        reviewsCount: 15,
        price: product.priceETB,
        inStock: product.inStock,
        image: product.imageUrl,
        description: product.name,
        benefits: [],
        specs: { grade: "Commercial Grade", warranty: "1 Year Official Warranty" },
      } as Product);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[430px] mx-auto bg-[#FAF6F0] text-[#4F2D1C] pb-24 flex flex-col font-sans select-none">
      {/* 1. TOP OPERATIONS / NAVIGATION BAR (Restored Clean #4F2D1C Header) */}
      <header className="sticky top-0 z-30 bg-[#4F2D1C] text-[#FFFFFF] px-4 pt-3 pb-3.5 shadow-md rounded-b-3xl">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Yolanda Brand Identity */}
          <button
            type="button"
            onClick={() => setActiveNavTab("Welcome")}
            className="flex items-center gap-2 min-w-0 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center font-serif font-bold text-xs shrink-0 ring-2 ring-white/20 shadow-xs overflow-hidden">
              {ws.brandLogoImage ? (
                <img
                  src={ws.brandLogoImage}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                "Y"
              )}
            </div>
            <div className="truncate">
              <span className="block font-serif font-bold text-base leading-none text-[#FFFFFF] tracking-tight">
                {ws.brandName?.split(" ")[0] || "Yolanda"}
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-white/75 font-semibold mt-0.5 truncate">
                {ws.brandSubtitle || "Salon & Makeup Equipment"}
              </span>
            </div>
          </button>

          {/* Right: Search Icon + Cart Icon with Badge + "FI" Profile Trigger */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Search Toggle Icon */}
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search salon equipment"
              className="w-9 h-9 rounded-full bg-[#2D1C14]/80 hover:bg-[#2D1C14] border border-white/10 flex items-center justify-center text-[#FFFFFF] active:scale-95 transition-transform cursor-pointer shadow-xs"
            >
              {searchOpen ? (
                <X className="w-4 h-4 stroke-[2.2]" />
              ) : (
                <Search className="w-4 h-4 stroke-[2.2]" />
              )}
            </button>

            {/* Cart Icon with Floating Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
              className="relative w-9 h-9 rounded-full bg-[#2D1C14]/80 hover:bg-[#2D1C14] border border-white/10 flex items-center justify-center text-[#FFFFFF] active:scale-95 transition-transform cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFFFFF] text-[#4F2D1C] text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Compact "FI fiker" Profile Pill + Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="h-9 pl-1.5 pr-2.5 rounded-full bg-[#2D1C14]/80 hover:bg-[#2D1C14] border border-white/10 shadow-xs active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer text-[#FFFFFF]"
              >
                <span className="w-6 h-6 rounded-full bg-[#FAF6F0] text-[#4F2D1C] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                  {initials}
                </span>
                <span className="text-xs font-bold text-[#FFFFFF] max-w-[60px] truncate">
                  {firstName}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 shrink-0 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
              )}

              {/* Exact Customer Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-64 rounded-[26px] bg-[#FFFFFF] p-2.5 border border-[#4F2D1C]/10 shadow-[0_18px_40px_-10px_rgba(79,45,28,0.22)] z-50">
                  <div className="rounded-2xl bg-[#FAF6F0] p-3.5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#4F2D1C] text-[#FFFFFF] text-sm font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-[#4F2D1C] truncate leading-tight">
                        {fullName}
                      </p>
                      <p className="text-xs text-[#4F2D1C]/65 truncate mt-0.5">
                        {email}
                      </p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C] text-[9px] font-extrabold uppercase tracking-wider">
                        {memberBadge}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-1 border-t border-[#4F2D1C]/10">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl hover:bg-rose-50/70 flex items-center gap-3 text-xs font-extrabold text-[#9A3412] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#9A3412] stroke-[2]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Search Input (Admin #2D1C14 styling) */}
        {searchOpen && (
          <div className="mt-2.5 relative animate-in fade-in duration-150">
            <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salon equipment, hair steamers, facial machines, vanity mirrors..."
              className="w-full h-10 pl-10 pr-9 rounded-full bg-[#2D1C14] border border-white/15 text-xs text-[#FFFFFF] placeholder:text-white/50 focus:outline-none focus:border-white/40 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="px-4 pt-3 pb-24 space-y-4 flex-1">
        {activeBottomTab === "orders" ? (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {/* Header: Title + Count + New Order link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBottomTab("home")}
                  className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#4F2D1C]/15 flex items-center justify-center text-[#4F2D1C] hover:bg-[#FAF6F0] active:scale-95 transition cursor-pointer shadow-2xs"
                  aria-label="Back to storefront"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-serif text-base font-extrabold text-[#4F2D1C] leading-tight">
                      My Salon Orders
                    </h1>
                    <span className="px-2 py-0.2 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C] text-[10px] font-extrabold">
                      {filteredOrders.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#4F2D1C]/65 font-medium mt-0.5">
                    Live review &amp; verification status
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveBottomTab("products");
                  setSelectedDepartment("All Equipment");
                }}
                aria-label="Create New Order"
                title="Create New Order"
                className="w-8.5 h-8.5 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FAF6F0] flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.6]" />
              </button>
            </div>

            {allOrdersList.length === 0 ? (
              <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-[#4F2D1C]/15 shadow-sm space-y-3.5 max-w-sm mx-auto my-6 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C] border border-[#4F2D1C]/12">
                  <Box className="w-6 h-6 stroke-[1.8] opacity-70" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#4F2D1C]">
                    No Orders Placed Yet
                  </h3>
                  <p className="text-xs text-[#4F2D1C]/65 max-w-xs mx-auto mt-1">
                    You haven&apos;t placed any salon equipment orders yet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBottomTab("products");
                    document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#4F2D1C] text-[#FFFFFF] text-xs font-bold hover:bg-[#2D1C14] transition cursor-pointer shadow-md active:scale-98"
                >
                  Browse Salon Equipment
                </button>
              </div>
            ) : (
              <>
                {/* Filter Controls: Topdown Period Selector + Order Search */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Topdown Period Selector */}
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#4F2D1C]/60 mb-1">
                  Filter By Period
                </label>
                <div className="relative">
                  <select
                    value={orderTimeFilter}
                    onChange={(e) => setOrderTimeFilter(e.target.value as any)}
                    aria-label="Filter orders by period"
                    className="w-full h-10 pl-3.5 pr-8 rounded-2xl bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs font-bold text-[#4F2D1C] appearance-none focus:outline-none focus:border-[#4F2D1C]/50 shadow-xs cursor-pointer"
                  >
                    <option value="all">All Orders (Complete History)</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#4F2D1C]/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Quick Search */}
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#4F2D1C]/60 mb-1">
                  Search Orders
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#4F2D1C]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order # or phone..."
                    className="w-full h-10 pl-9 pr-8 rounded-2xl bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs text-[#4F2D1C] placeholder:text-[#4F2D1C]/40 focus:outline-none focus:border-[#4F2D1C]/50 shadow-xs"
                  />
                  {orderSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setOrderSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-[#FFFFFF] rounded-[24px] border border-[#4F2D1C]/10 shadow-xs space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C]">
                  <Box className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4F2D1C]">
                    No Orders Found in This Period
                  </h3>
                  <p className="text-[11px] text-[#4F2D1C]/65 max-w-xs mx-auto mt-0.5">
                    {orderSearchQuery
                      ? `No orders matching "${orderSearchQuery}".`
                      : `You have not placed any equipment requests during this time frame.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrderTimeFilter("all");
                    setOrderSearchQuery("");
                    setActiveBottomTab("products");
                  }}
                  className="px-4 py-2 rounded-full bg-[#4F2D1C] text-[#FFFFFF] text-xs font-extrabold hover:bg-[#2D1C14] transition cursor-pointer shadow-xs"
                >
                  Browse Equipment Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredOrders.map((ord) => {
                  const step = getStepNumber(ord.status);
                  return (
                    <div
                      key={ord.id}
                      className="bg-[#FFFFFF] rounded-[22px] overflow-hidden border border-[#4F2D1C]/10 shadow-xs transition hover:shadow-sm"
                    >
                      {/* Top Bar: Order ID + Date + Status */}
                      <div className="p-3 bg-[#FAF6F0] flex items-center justify-between gap-2 border-b border-[#4F2D1C]/10">
                        <div className="font-mono text-xs font-extrabold text-[#4F2D1C] flex items-center gap-1.5">
                          <span>Order #{ord.id}</span>
                          <span className="text-[#4F2D1C]/40">·</span>
                          <span className="font-sans font-medium text-[10px] text-[#4F2D1C]/70">
                            {formatOrderDate(ord.createdAt)}
                          </span>
                        </div>
                        <div>{getOrderBadge(ord.status)}</div>
                      </div>

                      {/* 3-Step Visual Progress Tracker */}
                      <div className="p-3.5 bg-white border-b border-[#4F2D1C]/5">
                        <div className="grid grid-cols-3 gap-1 relative text-center">
                          {/* Connecting Line */}
                          <div className="absolute top-3 left-8 right-8 h-0.5 bg-[#4F2D1C]/15 -z-0" />
                          <div
                            className="absolute top-3 left-8 h-0.5 bg-[#4F2D1C] -z-0 transition-all duration-300"
                            style={{
                              width:
                                step === 3
                                  ? "calc(100% - 4rem)"
                                  : step === 2
                                  ? "50%"
                                  : "0%",
                            }}
                          />

                          {/* Step 1: Sent */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                                step >= 1
                                  ? "bg-[#4F2D1C] text-white"
                                  : "bg-[#FAF6F0] text-[#4F2D1C]/50 border border-[#4F2D1C]/20"
                              }`}
                            >
                              <Package className="w-3 h-3" />
                            </div>
                            <span className="text-[9px] font-extrabold text-[#4F2D1C] mt-1 leading-tight">
                              Sent
                            </span>
                            <span className="text-[8px] text-[#4F2D1C]/55">Submitted</span>
                          </div>

                          {/* Step 2: Stock Review */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                                step >= 2
                                  ? "bg-[#4F2D1C] text-white"
                                  : "bg-[#FAF6F0] text-[#4F2D1C]/50 border border-[#4F2D1C]/20"
                              }`}
                            >
                              <Search className="w-3 h-3" />
                            </div>
                            <span className="text-[9px] font-extrabold text-[#4F2D1C] mt-1 leading-tight">
                              Stock Review
                            </span>
                            <span className="text-[8px] text-[#4F2D1C]/55">Admin check</span>
                          </div>

                          {/* Step 3: Confirmed */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                                step >= 3
                                  ? "bg-emerald-600 text-white"
                                  : "bg-[#FAF6F0] text-[#4F2D1C]/50 border border-[#4F2D1C]/20"
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <span className="text-[9px] font-extrabold text-[#4F2D1C] mt-1 leading-tight">
                              Confirmed
                            </span>
                            <span className="text-[8px] text-[#4F2D1C]/55">Approved</span>
                          </div>
                        </div>
                      </div>

                      {/* Salon & Contact row */}
                      <div className="px-3.5 py-2 bg-[#FAF6F0]/40 text-[10px] text-[#4F2D1C]/75 flex items-center justify-between border-b border-[#4F2D1C]/5">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#4F2D1C] shrink-0" />
                          <span className="truncate">
                            <strong className="text-[#4F2D1C]">
                              {ord.customer.salonName}
                            </strong>{" "}
                            ({ord.customer.city})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Phone className="w-3 h-3 text-[#4F2D1C]" />
                          <span className="font-bold text-[#4F2D1C]">{ord.customer.phone}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-[#4F2D1C]/5 px-3.5 py-1">
                        {ord.items.map((item, idx) => (
                          <div
                            key={`${item.product.id}-${idx}`}
                            className="py-2.5 flex items-center justify-between gap-2.5"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-10 h-10 rounded-xl object-cover shrink-0 bg-[#FAF6F0] border border-[#4F2D1C]/10"
                              />
                              <div className="min-w-0">
                                <h4 className="font-serif text-[11px] font-bold text-[#4F2D1C] truncate leading-tight">
                                  {item.product.name}
                                </h4>
                                <span className="text-[9px] text-[#4F2D1C]/65 block mt-0.5">
                                  Qty: {item.quantity || 1} · ETB {item.product.price.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                addToCart(item.product, item.quantity || 1);
                                setIsCartOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#4F2D1C] hover:text-white text-[#4F2D1C] text-[10px] font-extrabold border border-[#4F2D1C]/15 transition flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Repeat className="w-2.5 h-2.5" />
                              <span>Reorder</span>
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer: Total */}
                      <div className="p-3 bg-[#FAF6F0]/80 border-t border-[#4F2D1C]/10 flex items-center justify-between">
                        <span className="text-[10px] text-[#4F2D1C]/70 font-semibold">
                          Total Amount:
                        </span>
                        <span className="font-mono text-xs font-extrabold text-[#4F2D1C]">
                          ETB {ord.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
              </>
            )}
          </div>
        ) : (
          <>
        {/* HERO BANNER WITH SIMPLE ADVERTISEMENT OVERLAY + EXTERNAL DOTS BELOW */}
        <div>
          <a
            href="#catalog-grid"
            aria-label="Explore equipment catalog"
            className="group block relative rounded-[28px] overflow-hidden bg-[#FAF6F0] h-[190px] sm:h-[220px] shadow-[0_12px_28px_-8px_rgba(79,45,28,0.22)] active:scale-[0.99] transition-transform"
          >
            <img
              src={ws.mobileHeroBgImage || ws.heroBgImage || "/signed-in-hero.jpg"}
              alt="Yolanda Salon Equipment"
              className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            {/* Minimal Subtle Scrim for Clean Contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

            {/* Advertisement Overlay Content: Top-left badge + title, bottom subtext + link */}
            <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between text-white">
              {/* Top-Left: Badge */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md border border-white/30 text-[9px] font-black tracking-widest uppercase w-fit text-[#FAF6F0] shadow-sm">
                  <span>SALON SPECIAL OFFER</span>
                </div>
              </div>

              {/* Bottom: Subtext & Action Link */}
              <div>
                <p className="text-[11px] text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] line-clamp-1">
                  Up to 20% off commercial facial machines &amp; styling stations
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-black text-[#FAF6F0] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] group-hover:translate-x-1 transition-transform">
                  <span>Shop Deals Now</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          </a>

          {/* Centered Slider Indicator Dots Outside Hero */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            <span className="w-2.5 h-2 rounded-full bg-[#4F2D1C]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F2D1C]/25" />
          </div>
        </div>

        {/* CIRCULAR ICON ROW (4 Trust Pillars in Circular Icon Layout) */}
        <section className="grid grid-cols-4 gap-2 pt-0.5">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shadow-2xs ${
                    idx === 0
                      ? "bg-[#4F2D1C]/10 border-[#4F2D1C]/20 text-[#4F2D1C]"
                      : "bg-[#FFFFFF] border-[#4F2D1C]/[0.08] text-[#4F2D1C]"
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-extrabold text-[#4F2D1C] leading-tight mt-1.5 line-clamp-2">
                  {pillar.title}
                </span>
              </div>
            );
          })}
        </section>

        {/* CATEGORY DROPDOWN FILTER (Single Screen, Compact) */}
        <section className="space-y-1.5 pt-1 relative" ref={categoryDropdownRef}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#4F2D1C]/60">
              Category Filter
            </span>
            {selectedDepartment !== "All Equipment" && (
              <button
                type="button"
                onClick={() => setSelectedDepartment("All Equipment")}
                className="text-[10px] font-extrabold text-[#4F2D1C]/70 hover:text-[#4F2D1C] underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              className="w-full h-11 px-3.5 rounded-2xl bg-white hover:bg-[#FAF6F0]/80 border border-[#4F2D1C]/15 flex items-center justify-between text-xs font-bold text-[#4F2D1C] shadow-[0_4px_12px_-2px_rgba(79,45,28,0.08),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(79,45,28,0.05)] active:scale-[0.99] transition cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-[10px] uppercase font-bold text-[#4F2D1C]/55 tracking-wider shrink-0">
                  Category:
                </span>
                <span className="font-extrabold truncate text-xs text-[#4F2D1C]">
                  {selectedDepartment}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#4F2D1C]/70 shrink-0 transition-transform duration-150 ${
                  isCategoryDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/15 shadow-[0_14px_35px_rgba(45,28,20,0.18),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,45,28,0.06)] p-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                {departments.map((dept) => {
                  const isSelected = selectedDepartment === dept;
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                        isSelected
                          ? "bg-white text-[#4F2D1C] shadow-[0_2px_6px_rgba(79,45,28,0.08),inset_0_1px_2px_rgba(255,255,255,1)] border border-[#4F2D1C]/10 font-extrabold"
                          : "hover:bg-white/60 text-[#4F2D1C]/80"
                      }`}
                    >
                      <span className="truncate">{dept}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#4F2D1C] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SECTION TITLE + SORT & 2-COLUMN PRODUCT GRID */}
        <section id="catalog-grid" className="space-y-3 pt-1">
          {activeBottomTab === "wishlist" ? (
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <h2 className="text-sm font-extrabold text-[#4F2D1C] tracking-tight">
                    My Wishlist
                  </h2>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FAF6F0] border border-[#4F2D1C]/10 text-rose-700 text-[10px] font-extrabold">
                    {displayedProducts.length}
                  </span>
                </div>
                <p className="text-[10px] text-[#4F2D1C]/65 mt-0.5">
                  Saved heavy-duty salon equipment &amp; furniture.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveBottomTab("products")}
                className="text-[11px] font-extrabold text-[#4F2D1C] underline shrink-0 cursor-pointer"
              >
                View All
              </button>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-extrabold text-[#4F2D1C] tracking-tight">
                    All Salon Equipment &amp; Supplies
                  </h2>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C] text-[10px] font-extrabold">
                    {displayedProducts.length}
                  </span>
                </div>
                <p className="text-[10px] text-[#4F2D1C]/65 line-clamp-1 mt-0.5">
                  Heavy-duty, commercial equipment for professional hair stylists,
                  estheticians &amp; makeup artists.
                </p>
              </div>

              {/* Compact Sort Pill */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort equipment"
                  className="h-7 pl-2.5 pr-6 rounded-full bg-[#FFFFFF] border border-[#4F2D1C]/12 text-[10px] font-extrabold text-[#4F2D1C] appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="Popular">Popular</option>
                  <option value="Price: Low to High">Price: Low</option>
                  <option value="Price: High to Low">Price: High</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#4F2D1C]/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Empty Wishlist State */}
          {activeBottomTab === "wishlist" && displayedProducts.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFFFF] rounded-[24px] border border-[#4F2D1C]/10 shadow-xs space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <Heart className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#4F2D1C]">Your wishlist is empty</p>
                <p className="text-xs text-[#4F2D1C]/60 mt-1 max-w-[260px] mx-auto">
                  Tap the heart icon on any product card to save equipment for later review.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveBottomTab("products");
                  document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex px-5 py-2.5 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                Browse All Equipment
              </button>
            </div>
          ) : (
            /* 2-COLUMN PRODUCT CARDS GRID */
            <div className="grid grid-cols-2 gap-3">
              {displayedProducts.map((product) => {
                const isAdded = addedId === product.id;
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-[#FFFFFF] rounded-[22px] p-2.5 border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06)] flex flex-col justify-between"
                  >
                    <div
                      onClick={() => handleOpenProduct(product)}
                      className="cursor-pointer"
                    >
                      {/* Product Image Square with Wishlist Toggle & Status Pill */}
                      <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-[#FAF6F0] mb-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />

                        {/* Floating Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(product.id, e)}
                          aria-label={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] shadow-sm flex items-center justify-center active:scale-90 transition-transform z-10 cursor-pointer"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isWishlisted
                                ? "fill-rose-500 text-rose-500"
                                : "text-[#4F2D1C]/60 hover:text-rose-500"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Product Name & Department Subtitle */}
                      <h3 className="text-xs font-extrabold text-[#4F2D1C] leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-[#4F2D1C]/60 truncate mt-0.5">
                        {product.department}
                      </p>
                    </div>

                  {/* Card Footer: Price + Rating on Left, Square Rounded Cart Button on Right */}
                  <div className="pt-2.5 mt-1 flex items-end justify-between gap-1">
                    <div className="min-w-0">
                      <span className="block font-mono text-xs font-extrabold text-[#4F2D1C] truncate">
                        ETB {product.priceETB.toLocaleString()}
                      </span>
                      <div className="inline-flex items-center gap-0.5 mt-0.5" title={`Rated ${product.rating} out of 5`}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const ratingVal = Number(product.rating || 5);
                          const isFilled = star <= Math.round(ratingVal);
                          return (
                            <Star
                              key={star}
                              className={`w-2.5 h-2.5 ${
                                isFilled
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-[#4F2D1C]/10 text-[#4F2D1C]/25"
                              }`}
                            />
                          );
                        })}
                        <span className="text-[10px] font-extrabold text-[#4F2D1C]/75 ml-0.5">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {product.inStock ? (
                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        aria-label={`Add ${product.name} to Cart`}
                        className="w-9 h-9 rounded-xl bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] shadow-[0_4px_10px_rgba(79,45,28,0.22)] active:scale-95 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4 text-[#FFFFFF]" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 text-[#FFFFFF]" />
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="Out of Stock"
                        className="px-2 h-8 rounded-xl bg-[#FAF6F0] text-[#4F2D1C]/45 border border-[#4F2D1C]/10 text-[9px] font-extrabold flex items-center justify-center shrink-0 cursor-not-allowed"
                      >
                        Sold
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
          </>
        )}
      </main>

      {/* 3. FLOATING PILL BOTTOM NAVIGATION BAR (Luxury Style 02) */}
      <nav className="fixed bottom-4 left-3 right-3 z-40 max-w-[400px] mx-auto bg-[#4F2D1C]/95 backdrop-blur-md text-[#FFFFFF] p-1.5 border border-white/20 shadow-[0_16px_36px_-6px_rgba(45,28,20,0.5),0_6px_16px_-4px_rgba(45,28,20,0.35)] rounded-full">
        <div className="grid grid-cols-5 gap-1 items-center">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => {
              setActiveBottomTab("home");
              document.getElementById("mobile-scroll-container")?.scrollTo({ top: 0, behavior: "smooth" });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeBottomTab === "home"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span className="text-[10px] font-bold mt-0.5 leading-tight">Home</span>
          </button>

          {/* 2. Products */}
          <button
            type="button"
            onClick={() => {
              setActiveBottomTab("products");
              document
                .getElementById("catalog-grid")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeBottomTab === "products"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <LayoutGrid className="w-4 h-4 stroke-[2]" />
            <span className="text-[10px] font-bold mt-0.5 leading-tight">Products</span>
          </button>

          {/* 3. Wishlist */}
          <button
            type="button"
            onClick={() => {
              setActiveBottomTab("wishlist");
              document
                .getElementById("catalog-grid")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeBottomTab === "wishlist"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <div className="relative">
              <Heart
                className={`w-4 h-4 stroke-[2] transition-colors ${
                  activeBottomTab === "wishlist"
                    ? "fill-rose-400 text-rose-400"
                    : ""
                }`}
              />
              {wishlistProducts.length > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-[#FFFFFF] text-[#4F2D1C] text-[8px] font-extrabold leading-tight shadow-xs">
                  {wishlistProducts.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5 leading-tight">Wishlist</span>
          </button>

          {/* 4. My Orders */}
          <button
            type="button"
            onClick={() => {
              setActiveBottomTab("orders");
              document.getElementById("mobile-scroll-container")?.scrollTo({ top: 0, behavior: "smooth" });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeBottomTab === "orders"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <div className="relative">
              <Box className="w-4 h-4 stroke-[2]" />
              {allOrdersList.length > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-[#FFFFFF] text-[#4F2D1C] text-[8px] font-extrabold leading-tight shadow-xs">
                  {allOrdersList.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5 leading-tight">My Orders</span>
          </button>

          {/* 5. Account */}
          <button
            type="button"
            onClick={() => {
              setActiveBottomTab("account");
              setIsAccountModalOpen(true);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeBottomTab === "account"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <User className="w-4 h-4 stroke-[2]" />
            <span className="text-[10px] font-bold mt-0.5 leading-tight">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
