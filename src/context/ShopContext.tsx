"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product, PRODUCTS, Category, CATEGORIES, BankSettings, INITIAL_BANK_SETTINGS } from "../data/mockData";

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | "Pending Verification"
  | "In Progress"
  | "Payment Approved"
  | "Dispatched"
  | "Delivered"
  | "Payment Rejected";

export interface Order {
  id: string;
  customer: {
    salonName: string;
    contactPerson: string;
    phone: string;
    address: string;
    city: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod?: string;
  transactionNumber?: string;
  receiptImage?: string;
  orderNotes?: string;
  status: OrderStatus;
  createdAt: string;
  rejectionReason?: string;
}

export interface CustomerUser {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

interface StoredAccount {
  fullName: string;
  phone: string;
  email: string;
  avatar?: string;
  passwordHash: string;
  role?: string;
}

export interface WelcomeSettings {
  id?: string;
  brandLogoImage?: string;
  brandName: string;
  brandSubtitle: string;
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroMotto: string;
  heroBgImage: string;
  mobileHeroBgImage: string;
  pillarSectionTag: string;
  pillarSectionTitle: string;
  pillarSectionSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar1Badge: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar2Badge: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar3Badge: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  contactPhone: string;
  contactTelegram: string;
  contactLocation: string;
  contactHours: string;
  contactEmail: string;
  footerDescription: string;
  socialInstagram: string;
  socialTiktok: string;
  socialFacebook: string;
  socialWhatsapp: string;
  footerService1: string;
  footerService2: string;
  footerService3: string;
  footerService4: string;
  copyrightText: string;
}

export const DEFAULT_WELCOME_SETTINGS: WelcomeSettings = {
  id: "primary",
  brandLogoImage: "/yolanda-logo.jpg",
  brandName: "Yolanda Salon Equipment",
  brandSubtitle: "Salon & Makeup Equipment",
  heroBadge: "Wholesale Equipment",
  heroTitleLine1: "Equipping Top Salons,",
  heroTitleLine2: "Across Ethiopia.",
  heroSubtitle: "Direct importer of commercial equipment for beauty salons & makeup studios.",
  heroMotto: "Commercial Equipment ✦ For Beauty & Makeup Salons",
  heroBgImage: "/hero-bg.jpg",
  mobileHeroBgImage: "/mobile-welcome-hero.jpg",
  pillarSectionTag: "Built For Ethiopian Salons",
  pillarSectionTitle: "Why Top Salons Trust Yolanda",
  pillarSectionSubtitle: "Directly imported commercial-grade equipment built for heavy daily salon use.",
  pillar1Title: "220V Commercial Ready",
  pillar1Desc: "Every steamer, hydra-facial machine, and styling chair is pre-calibrated for Ethiopian electrical standards with heavy-duty surge protection.",
  pillar1Badge: "Tested for 220V/50Hz",
  pillar2Title: "1-Year Warranty & Parts",
  pillar2Desc: "We provide original replacement parts, certified technician inspection, and on-site warranty service in Addis Ababa so your salon never suffers downtime.",
  pillar2Badge: "Local Technician Support",
  pillar3Title: "Direct Salon Importer",
  pillar3Desc: "Authentic, heavy-duty salon and makeup studio machines directly from certified manufacturers without middleman markups.",
  pillar3Badge: "Verified Salon Quality",
  howItWorksTitle: "How It Works",
  step1Title: "Create Your Account",
  step1Desc: "Register as a salon owner or beauty professional.",
  step2Title: "Explore Equipment in ETB",
  step2Desc: "Unlock wholesale pricing and detailed machine specs.",
  step3Title: "Submit Salon Order",
  step3Desc: "Submit your equipment request in seconds with your contact information.",
  contactPhone: "+251 911 234 567",
  contactTelegram: "https://t.me/yolandabeauty",
  contactLocation: "Bole Medhanialem, Addis Ababa, Ethiopia",
  contactHours: "Mon - Sat: 8:30 AM - 7:30 PM",
  contactEmail: "contact@yolandabeauty.com",
  footerDescription: "Ethiopia's trusted direct importer of commercial equipment for women's beauty salons, hair studios, and makeup salons with 220V certification, genuine parts, and Addis Ababa warranty support.",
  socialInstagram: "https://instagram.com/yolandabeauty",
  socialTiktok: "https://tiktok.com/@yolandabeauty",
  socialFacebook: "https://facebook.com/yolandabeauty",
  socialWhatsapp: "https://wa.me/251911234567",
  footerService1: "1-Year Machine Warranty",
  footerService2: "Direct Equipment Importer",
  footerService3: "Fast Order Confirmation",
  footerService4: "Bulk Order Pricing Discounts",
  copyrightText: "© 2026 Yolanda Salon Equipment Importer. All rights reserved.",
};

interface ShopContextType {
  products: Product[];
  categories: Category[];
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  welcomeSettings: WelcomeSettings;
  setWelcomeSettings: React.Dispatch<React.SetStateAction<WelcomeSettings>>;
  refreshWelcomeSettings: () => Promise<void>;
  updateWelcomeSettings: (newSettings: Partial<WelcomeSettings>) => Promise<{ success: boolean; error?: string }>;
  bankSettings: BankSettings;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Auth state
  currentUser: CustomerUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CustomerUser | null>>;
  isAuthLoading: boolean;
  setAuthenticatedUser: (user: CustomerUser) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  openAuthModal: (mode?: "login" | "register") => void;
  loginUser: (identifier: string, password: string) => { success: boolean; error?: string; user?: CustomerUser };
  registerUser: (fullName: string, phone: string, email: string, password: string) => { success: boolean; error?: string };
  logoutUser: () => void;

  // Cart
  cart: OrderItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Modals & Navigation
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;
  isMyOrdersOpen: boolean;
  setIsMyOrdersOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  activeWelcomeSection: "hero" | "about" | "delivery";
  setActiveWelcomeSection: (section: "hero" | "about" | "delivery") => void;
  scrollToWelcomeSection: (section: "hero" | "about" | "delivery") => void;
  isProgrammaticScrollRef: React.MutableRefObject<boolean>;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    salonName: string;
    contactPerson: string;
    phone: string;
    address: string;
    city: string;
    orderNotes?: string;
  }) => Promise<Order> | Order;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bankSettings] = useState<BankSettings>(INITIAL_BANK_SETTINGS);
  const [welcomeSettings, setWelcomeSettings] = useState<WelcomeSettings>(DEFAULT_WELCOME_SETTINGS);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Auth State (stored in localStorage)
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const refreshProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data?.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (e) {
      console.warn("Could not fetch remote products:", e);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (data?.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (e) {
      console.warn("Could not fetch remote categories:", e);
    }
  };

  const refreshWelcomeSettings = async () => {
    try {
      const res = await fetch("/api/welcome-settings");
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          setWelcomeSettings(data.settings);
        }
      }
    } catch (e) {
      console.warn("Could not fetch remote welcome settings:", e);
    }
  };

  const updateWelcomeSettings = async (newSettings: Partial<WelcomeSettings>) => {
    // Optimistic instant state update across all headers, drawers and sidebar
    const merged = { ...welcomeSettings, ...newSettings };
    setWelcomeSettings(merged);

    try {
      const res = await fetch("/api/welcome-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: currentUser?.email,
          settings: merged,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.settings) {
        setWelcomeSettings(data.settings);
        return { success: true };
      }
      return { success: false, error: data?.error || "Failed to update welcome settings" };
    } catch (e) {
      console.error("Error updating welcome settings:", e);
      return { success: false, error: "Network error updating welcome settings" };
    }
  };

  const setAuthenticatedUser = (user: CustomerUser) => {
    setCurrentUser(user);
    if (user.role !== "ADMIN") {
      setActiveNavTab("Shop");
    }
    localStorage.setItem("yolanda_customer", JSON.stringify(user));
    setIsAuthModalOpen(false);
  };

  // Load user from localStorage on mount & seed demo account if empty
  useEffect(() => {
    try {
      const stored = localStorage.getItem("yolanda_customer");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email?.toLowerCase() !== "admin@yolandabeauty.com" && parsed.role === "ADMIN") {
          parsed.role = "CUSTOMER";
          localStorage.setItem("yolanda_customer", JSON.stringify(parsed));
        }
        setCurrentUser(parsed);
        if (parsed.role !== "ADMIN") {
          const savedTab = localStorage.getItem("yolanda_active_tab");
          setActiveNavTab(savedTab || "Shop");
        }
      }
      const rawAccounts = localStorage.getItem("yolanda_accounts");
      if (!rawAccounts) {
        const defaultAccounts: StoredAccount[] = [
          {
            fullName: "Salon Owner",
            phone: "+251911234567",
            email: "owner@yolanda.et",
            passwordHash: "password123",
            role: "CUSTOMER",
          },
          {
            fullName: "Yolanda Admin",
            phone: "+251911234567",
            email: "admin@yolandabeauty.com",
            passwordHash: "admin123",
            role: "ADMIN",
          },
        ];
        localStorage.setItem("yolanda_accounts", JSON.stringify(defaultAccounts));
      }
    } catch {
      // ignore
    } finally {
      setIsAuthLoading(false);
    }

    refreshProducts();
    refreshCategories();
    refreshWelcomeSettings();
  }, []);

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const registerUser = (fullName: string, phone: string, email: string, password: string) => {
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanName || !cleanPhone || !password) {
      return { success: false, error: "Please fill in your name, phone number, and password." };
    }

    try {
      const rawAccounts = localStorage.getItem("yolanda_accounts");
      const accounts: StoredAccount[] = rawAccounts ? JSON.parse(rawAccounts) : [];

      // Check if user already exists
      const exists = accounts.find(
        (a) => (cleanEmail && a.email === cleanEmail) || a.phone === cleanPhone
      );
      if (exists) {
        return { success: false, error: "An account with this email or phone number already exists." };
      }

      accounts.push({
        fullName: cleanName,
        phone: cleanPhone,
        email: cleanEmail || `${cleanPhone}@yolanda.local`,
        passwordHash: password,
      });
      localStorage.setItem("yolanda_accounts", JSON.stringify(accounts));

      // Auto sign-in upon registration
      const userObj: CustomerUser = { fullName: cleanName, email: cleanEmail || `${cleanPhone}@yolanda.local`, phone: cleanPhone };
      setAuthenticatedUser(userObj);

      return { success: true };
    } catch {
      return { success: false, error: "Registration failed. Please try again." };
    }
  };

  const loginUser = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const idDigits = cleanId.replace(/\D/g, "");
    
    try {
      const rawAccounts = localStorage.getItem("yolanda_accounts");
      const accounts: StoredAccount[] = rawAccounts ? JSON.parse(rawAccounts) : [];

      const match = accounts.find((a) => {
        if (a.passwordHash !== password) return false;
        if (a.email.toLowerCase() === cleanId) return true;
        if (a.phone && a.phone.toLowerCase() === cleanId) return true;

        // Match phone digits (e.g. 09..., 9..., +251...)
        const accountDigits = (a.phone || "").replace(/\D/g, "");
        if (idDigits && accountDigits) {
          if (idDigits === accountDigits) return true;
          // Compare last 9 digits if valid Ethiopian mobile
          if (
            idDigits.length >= 9 &&
            accountDigits.length >= 9 &&
            idDigits.slice(-9) === accountDigits.slice(-9)
          ) {
            return true;
          }
        }
        return false;
      });

      if (!match) {
        return {
          success: false,
          error: "Invalid credentials. Please enter your valid Phone or Email and Password.",
        };
      }

      const role =
        match.role ||
        (match.email.toLowerCase() === "admin@yolandabeauty.com"
          ? "ADMIN"
          : "CUSTOMER");

      const userObj: CustomerUser = {
        fullName: match.fullName,
        email: match.email,
        phone: match.phone,
        role,
      };
      setAuthenticatedUser(userObj);

      return { success: true, user: userObj };
    } catch {
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setActiveNavTabState("Welcome");
    localStorage.removeItem("yolanda_customer");
    localStorage.removeItem("yolanda_active_tab");
    setCart([]);
    setWishlistIds([]);
    setOrders([]);
    setLastOrder(null);
    setTrackingOrder(null);
    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
  };

  // Cart State (stored locally per authenticated customer)
  const [cart, setCart] = useState<OrderItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yolanda_customer");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.email) {
            const savedCart = localStorage.getItem(`yolanda_cart_${parsed.email.toLowerCase().trim()}`);
            if (savedCart) return JSON.parse(savedCart);
          }
        }
      } catch {}
    }
    return [];
  });
  
  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Wishlist State (stored locally per authenticated customer)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yolanda_customer");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.email) {
            const saved = localStorage.getItem(`yolanda_wishlist_${parsed.email.toLowerCase().trim()}`);
            if (saved) return JSON.parse(saved);
          }
        }
      } catch {}
    }
    return [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  const [activeNavTab, setActiveNavTabState] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yolanda_customer");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role !== "ADMIN") {
            const saved = localStorage.getItem("yolanda_active_tab");
            return saved || "Shop";
          }
        }
      } catch {}
    }
    return "Welcome";
  });

  const setActiveNavTab = (tab: string) => {
    setActiveNavTabState(tab);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("yolanda_active_tab", tab);
      } catch {}
    }
  };
  const [activeWelcomeSection, setActiveWelcomeSection] = useState<"hero" | "about" | "delivery">("hero");

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToWelcomeSection = (section: "hero" | "about" | "delivery") => {
    setActiveWelcomeSection(section);
    if (activeNavTab !== "Welcome") {
      setActiveNavTab("Welcome");
    }

    // Lock scroll detection during programmatic smooth scroll to avoid trembling
    isProgrammaticScrollRef.current = true;
    if (scrollLockTimeoutRef.current) clearTimeout(scrollLockTimeoutRef.current);
    scrollLockTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 700);

    const targetId =
      section === "hero"
        ? "welcome-hero"
        : section === "about"
        ? "welcome-about"
        : "welcome-delivery";

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const container =
        document.getElementById("welcome-scroll-container") ||
        document.getElementById("main-scroll-container") ||
        document.getElementById("mobile-scroll-container");
      const target = document.getElementById(targetId);

      if (!target) return;

      if (container) {
        if (section === "hero") {
          container.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const containerRect = container.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const currentScroll = container.scrollTop;
          const targetScrollTop = currentScroll + (targetRect.top - containerRect.top) - 16;

          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: "smooth",
          });
        }
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 20);
  };

  // Real Operational Orders (strictly loaded for current authenticated customer)
  const [orders, setOrders] = useState<Order[]>([]);

  // Sync / load Cart whenever customer user changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentUser?.email) {
      try {
        const saved = localStorage.getItem(`yolanda_cart_${currentUser.email.toLowerCase().trim()}`);
        setCart(saved ? JSON.parse(saved) : []);
      } catch {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [currentUser?.email]);

  // Sync / load Wishlist whenever customer user changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentUser?.email) {
      try {
        const saved = localStorage.getItem(`yolanda_wishlist_${currentUser.email.toLowerCase().trim()}`);
        setWishlistIds(saved ? JSON.parse(saved) : []);
      } catch {
        setWishlistIds([]);
      }
    } else {
      setWishlistIds([]);
    }
  }, [currentUser?.email]);

  // Fetch real orders strictly for current signed-in user
  useEffect(() => {
    const fetchUserOrders = async () => {
      // If not logged in, customer has zero orders
      if (!currentUser?.email && !currentUser?.phone) {
        setOrders([]);
        return;
      }

      const email = currentUser?.email?.toLowerCase().trim() || "";
      const phone = currentUser?.phone?.trim() || "";

      try {
        const params = new URLSearchParams();
        if (email) params.set("email", email);
        if (phone) params.set("phone", phone);

        const res = await fetch(`/api/orders?${params.toString()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const mappedOrders: Order[] = data.orders.map((dbOrder: any) => ({
            id: dbOrder.orderNumber || dbOrder.id,
            customer: {
              salonName: dbOrder.salonName,
              contactPerson: dbOrder.contactPerson,
              phone: dbOrder.phone,
              address: dbOrder.address,
              city: dbOrder.city,
            },
            items: (dbOrder.items || []).map((i: any) => ({
              product: i.product || {
                id: i.productId || "item-1",
                name: "Salon Equipment",
                category: "Equipment",
                subtitle: "",
                price: i.price,
                rating: 5,
                reviewsCount: 1,
                image: "/hero-bg.jpg",
                inStock: true,
                specs: { warranty: "1-Year Warranty", grade: "Commercial" },
                benefits: [],
                description: "",
              },
              quantity: i.quantity,
            })),
            total: dbOrder.totalAmount,
            paymentMethod: dbOrder.paymentMethod as any,
            transactionNumber: dbOrder.transactionNumber,
            receiptImage: dbOrder.receiptImageUrl,
            status:
              dbOrder.status === "CONFIRMED" ||
              dbOrder.status === "PAYMENT_APPROVED" ||
              dbOrder.status === "COMPLETED" ||
              dbOrder.status === "DELIVERED"
                ? "Payment Approved"
                : dbOrder.status === "IN_PROGRESS" ||
                  dbOrder.status === "STOCK_REVIEW" ||
                  dbOrder.status === "CONTACTED"
                ? "In Progress"
                : dbOrder.status === "CANCELLED" ||
                  dbOrder.status === "PAYMENT_REJECTED"
                ? "Payment Rejected"
                : "Pending Verification",
            createdAt: dbOrder.createdAt,
            rejectionReason: dbOrder.rejectionReason,
          }));

          setOrders(mappedOrders);
          return;
        }
      } catch (err) {
        console.error("Failed to load remote orders:", err);
      }

      // Fallback: check local storage strictly for this customer's placed orders
      try {
        if (email) {
          const localKey = `yolanda_orders_${email}`;
          const stored = localStorage.getItem(localKey);
          if (stored) {
            setOrders(JSON.parse(stored));
            return;
          }
        }
        setOrders([]);
      } catch {
        setOrders([]);
      }
    };

    fetchUserOrders();
  }, [currentUser]);

  const saveCartLocally = (newCart: OrderItem[]) => {
    if (typeof window !== "undefined" && currentUser?.email) {
      try {
        localStorage.setItem(
          `yolanda_cart_${currentUser.email.toLowerCase().trim()}`,
          JSON.stringify(newCart)
        );
      } catch {}
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    // If not signed in, prompt auth modal!
    if (!currentUser) {
      openAuthModal("login");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: OrderItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      saveCartLocally(updated);
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      saveCartLocally(updated);
      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartLocally(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined" && currentUser?.email) {
      try {
        localStorage.removeItem(`yolanda_cart_${currentUser.email.toLowerCase().trim()}`);
      } catch {}
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      openAuthModal("login");
      return;
    }
    setWishlistIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      if (typeof window !== "undefined" && currentUser?.email) {
        try {
          localStorage.setItem(
            `yolanda_wishlist_${currentUser.email.toLowerCase().trim()}`,
            JSON.stringify(next)
          );
        } catch {}
      }
      return next;
    });
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const placeOrder = async (orderData: {
    salonName: string;
    contactPerson: string;
    phone: string;
    address: string;
    city: string;
    orderNotes?: string;
  }) => {
    const orderNumber = `SLN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderNumber,
      customer: {
        salonName: orderData.salonName,
        contactPerson: orderData.contactPerson,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
      },
      items: [...cart],
      total: cartTotal,
      paymentMethod: "Direct Order",
      transactionNumber: `REQ-${orderNumber}`,
      orderNotes: orderData.orderNotes,
      status: "Pending Verification",
      createdAt: new Date().toISOString(),
    };

    // Save to local user state
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setTrackingOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);

    // Save strictly to this customer's localStorage key
    if (currentUser?.email) {
      try {
        const localKey = `yolanda_orders_${currentUser.email.toLowerCase().trim()}`;
        const existing = localStorage.getItem(localKey);
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem(localKey, JSON.stringify([newOrder, ...list]));
      } catch (e) {
        console.error("Local order save failed:", e);
      }
    }

    // Persist to database in background
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonName: orderData.salonName,
          contactPerson: orderData.contactPerson,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          items: cart.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          totalAmount: cartTotal,
          paymentMethod: "Direct Order",
          transactionNumber: `REQ-${orderNumber}`,
          userEmail: currentUser?.email?.toLowerCase().trim(),
        }),
      });
    } catch (err) {
      console.error("DB order sync error:", err);
    }

    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        bankSettings,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        currentUser,
        setCurrentUser,
        isAuthLoading,
        setAuthenticatedUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        loginUser,
        registerUser,
        logoutUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        lastOrder,
        setLastOrder,
        trackingOrder,
        setTrackingOrder,
        isMyOrdersOpen,
        setIsMyOrdersOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        activeNavTab,
        setActiveNavTab,
        activeWelcomeSection,
        setActiveWelcomeSection,
        scrollToWelcomeSection,
        isProgrammaticScrollRef,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistIds.length,
        isWishlistOpen,
        setIsWishlistOpen,
        orders,
        placeOrder,
        refreshProducts,
        refreshCategories,
        welcomeSettings,
        setWelcomeSettings,
        refreshWelcomeSettings,
        updateWelcomeSettings,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
