"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Camera,
  ImagePlus,
  ShieldCheck,
  Package,
  Layers,
  ClipboardList,
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  Edit2,
  Pencil,
  Trash2,
  Lock,
  Save,
  RefreshCw,
  LogOut,
  Store,
  Phone,
  MapPin,
  Building,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter,
  Layout,
  RotateCcw,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  Star,
  X,
  Check,
  ListChecks,
  LayoutDashboard,
  LayoutGrid,
  Box,
  Banknote,
  ArrowRight,
  Copy,
} from "lucide-react";
import { useShop, DEFAULT_WELCOME_SETTINGS } from "@/context/ShopContext";
import AdminSkeleton from "@/components/AdminSkeleton";

export default function AdminPage() {
  const router = useRouter();
  const {
    currentUser,
    isAuthLoading,
    openAuthModal,
    logoutUser,
    refreshProducts: refreshStoreProducts,
    refreshCategories: refreshStoreCategories,
    setAuthenticatedUser,
    welcomeSettings,
    updateWelcomeSettings,
    refreshWelcomeSettings,
  } = useShop();

  // Synchronous check for stored admin session to prevent any flash during browser refresh
  const [hasStoredAdminSession, setHasStoredAdminSession] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yolanda_customer");
        if (stored) {
          const parsed = JSON.parse(stored);
          return (
            parsed?.role === "ADMIN" ||
            parsed?.email?.toLowerCase() === "admin@yolandabeauty.com"
          );
        }
      } catch {}
    }
    return false;
  });

  useEffect(() => {
    if (!isAuthLoading) {
      setHasStoredAdminSession(
        currentUser?.role === "ADMIN" ||
        currentUser?.email?.toLowerCase() === "admin@yolandabeauty.com"
      );
    }
  }, [isAuthLoading, currentUser]);

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders" | "welcome_cms" | "profile">("overview");
  const [catalogSubView, setCatalogSubView] = useState<"products" | "categories">("categories");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);

  // Global Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // Orders Tab Filters & Custom Popovers
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [orderTimeFilter, setOrderTimeFilter] = useState<"all" | "24h" | "week" | "month">("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [isOrderSearchOpen, setIsOrderSearchOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const [activeOrderActionId, setActiveOrderActionId] = useState<string | null>(null);

  const statusFilterRef = useRef<HTMLDivElement>(null);
  const timeFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        (!mobileProfileDropdownRef.current || !mobileProfileDropdownRef.current.contains(event.target as Node))
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        (!mobileSearchContainerRef.current || !mobileSearchContainerRef.current.contains(event.target as Node))
      ) {
        setIsSearchOpen(false);
      }
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target as Node)
      ) {
        setIsStatusFilterOpen(false);
      }
      if (
        timeFilterRef.current &&
        !timeFilterRef.current.contains(event.target as Node)
      ) {
        setIsTimeFilterOpen(false);
      }
      if (activeOrderActionId) {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-order-status-popover]")) {
          setActiveOrderActionId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeOrderActionId]);

  // State with instant 0ms Stale-While-Revalidate local cache
  const [products, setProducts] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("yolanda_admin_products_cache");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [categories, setCategories] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("yolanda_admin_categories_cache");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [orders, setOrders] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("yolanda_admin_orders_cache");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [loadingData, setLoadingData] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("yolanda_admin_orders_cache");
    }
    return false;
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-sync state changes to instant local cache
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem("yolanda_admin_products_cache", JSON.stringify(products));
      } catch {}
    }
  }, [products]);

  useEffect(() => {
    if (categories.length > 0) {
      try {
        localStorage.setItem("yolanda_admin_categories_cache", JSON.stringify(categories));
      } catch {}
    }
  }, [categories]);

  useEffect(() => {
    if (orders.length > 0) {
      try {
        localStorage.setItem("yolanda_admin_orders_cache", JSON.stringify(orders));
      } catch {}
    }
  }, [orders]);

  // Welcome CMS State
  const [cmsForm, setCmsForm] = useState(welcomeSettings || DEFAULT_WELCOME_SETTINGS);
  const [openWelcomeSection, setOpenWelcomeSection] = useState<number | null>(1);
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isWelcomeSaved, setIsWelcomeSaved] = useState(false);

  useEffect(() => {
    if (welcomeSettings) {
      setCmsForm(welcomeSettings);
    }
  }, [welcomeSettings]);

  const handleSaveWelcomeCMS = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActionLoading(true);
    try {
      const res = await updateWelcomeSettings(cmsForm);
      if (res.success) {
        showNotification("success", "Welcome page updated dynamically!");
      } else {
        showNotification("error", res.error || "Failed to update welcome page.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update welcome page.");
    } finally {
      setActionLoading(false);
    }
  };

  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: "danger" | "warning";
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  const askConfirmation = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: "danger" | "warning";
    onConfirm: () => Promise<void> | void;
  }) => {
    setConfirmDialog({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || "Confirm",
      cancelLabel: options.cancelLabel || "Cancel",
      type: options.type || "danger",
      onConfirm: options.onConfirm,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && confirmDialog?.isOpen) {
        setConfirmDialog(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmDialog]);

  const handleResetWelcomeCMS = () => {
    askConfirmation({
      title: "Reset Welcome Page?",
      message: "This will revert your hero banner, highlights, and contact information back to standard salon defaults. Unsaved custom text will be replaced.",
      confirmLabel: "Reset to Defaults",
      type: "warning",
      onConfirm: () => {
        setCmsForm(DEFAULT_WELCOME_SETTINGS);
        showNotification("success", "Welcome page reset to standard defaults.");
      },
    });
  };

  // Filters & Search
  const [productSearch, setProductSearch] = useState("");
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("All");
  const [productStockFilter, setProductStockFilter] = useState<"All" | "In Stock" | "Out of Stock">("All");
  const mainScrollRef = useRef<HTMLElement>(null);

  const navigateToSalonOrders = () => {
    setOrderSearch("");
    setActiveTab("orders");
    setIsMobileSidebarOpen(false);
    setTimeout(() => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 10);
  };

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    subtitle: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    rating: "5.0",
    image: "",
    warranty: "1 Year Official Warranty",
    voltage: "220V - 240V / 50Hz (Ethiopian Standard)",
    power: "",
    dimensions: "",
    grade: "Commercial Salon Grade",
    description: "",
    inStock: true,
    isNewArrival: false,
    isBestSeller: false,
  });

  // Category Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image: "",
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Fast client-side image compressor: shrinks 5MB phone photos to ~100-200KB in ~50ms
  const compressImage = async (file: File, maxDim = 1200, quality = 0.85): Promise<File | Blob> => {
    if (file.type.includes("svg") || file.size < 200 * 1024) return file;

    return new Promise((resolve) => {
      try {
        const img = document.createElement("img");
        const url = URL.createObjectURL(file);
        const timer = setTimeout(() => {
          URL.revokeObjectURL(url);
          resolve(file);
        }, 4000);

        img.onload = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                resolve(file);
              } else {
                resolve(blob);
              }
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          resolve(file);
        };
        img.src = url;
      } catch {
        resolve(file);
      }
    });
  };

  // Cloudinary Upload Handler
  const uploadFileToCloudinary = async (fileOrBlob: File | Blob, fileName?: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", fileOrBlob, fileName || (fileOrBlob instanceof File ? fileOrBlob.name : "upload.jpg"));

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to upload file to Cloudinary.");
    }

    return data.url;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    // 1. Instant 0ms Optimistic preview
    const tempUrl = URL.createObjectURL(file);
    setProfileForm((prev) => ({ ...prev, avatar: tempUrl }));
    setUploadingImage("avatar");

    try {
      const compressed = await compressImage(file, 800, 0.85);
      const url = await uploadFileToCloudinary(compressed, file.name);
      setProfileForm((prev) => ({ ...prev, avatar: url }));
      showNotification("success", "Profile picture uploaded!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload avatar.");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Always clear input value so choosing the same photo again fires onChange
    e.target.value = "";
    if (!file) return;

    // 1. Instant 0ms Optimistic preview
    const tempUrl = URL.createObjectURL(file);
    setProductForm((prev) => ({ ...prev, image: tempUrl }));
    setUploadingImage("product");

    try {
      const compressed = await compressImage(file, 1200, 0.85);
      const url = await uploadFileToCloudinary(compressed, file.name);
      setProductForm((prev) => ({ ...prev, image: url }));
      showNotification("success", "Product photo uploaded!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload photo.");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    // 1. Instant 0ms Optimistic preview
    const tempUrl = URL.createObjectURL(file);
    setCategoryForm((prev) => ({ ...prev, image: tempUrl }));
    setUploadingImage("category");

    try {
      const compressed = await compressImage(file, 1200, 0.85);
      const url = await uploadFileToCloudinary(compressed, file.name);
      setCategoryForm((prev) => ({ ...prev, image: url }));
      showNotification("success", "Category image uploaded!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload category image.");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant 0ms Optimistic preview across entire portal & sidebar
    const tempUrl = URL.createObjectURL(file);
    setCmsForm((prev: any) => ({ ...prev, brandLogoImage: tempUrl }));
    setUploadingImage("logo");

    try {
      const compressed = await compressImage(file, 800, 0.9);
      const url = await uploadFileToCloudinary(compressed);
      setCmsForm((prev: any) => ({ ...prev, brandLogoImage: url }));
      // Save to database & welcomeSettings in background without blocking
      void updateWelcomeSettings({ brandLogoImage: url });
      showNotification("success", "Website logo updated in real-time!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload logo.");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "heroBgImage" | "mobileHeroBgImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant 0ms Optimistic preview
    const tempUrl = URL.createObjectURL(file);
    setCmsForm((prev: any) => ({ ...prev, [field]: tempUrl }));
    setUploadingImage(field);

    try {
      const compressed = await compressImage(file, 1600, 0.85);
      const url = await uploadFileToCloudinary(compressed);
      setCmsForm((prev: any) => ({ ...prev, [field]: url }));
      showNotification("success", "Hero banner uploaded!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload hero image.");
    } finally {
      setUploadingImage(null);
    }
  };

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync profile form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        avatar: (currentUser as any).avatar || "",
      });
    }
  }, [currentUser]);

  // Fast independent streaming fetchers with instant caching
  const fetchProductsData = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const prodData = await res.json();
        if (prodData.products) {
          setProducts(prodData.products);
        }
      }
    } catch (e) {
      console.warn("Failed to stream products:", e);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const catData = await res.json();
        if (catData.categories) {
          setCategories(catData.categories);
        }
      }
    } catch (e) {
      console.warn("Failed to stream categories:", e);
    }
  };

  const fetchOrdersData = async () => {
    try {
      const res = await fetch("/api/orders?all=true");
      if (res.ok) {
        const ordData = await res.json();
        if (ordData.orders) {
          setOrders(ordData.orders);
        }
      }
    } catch (e) {
      console.warn("Failed to stream orders:", e);
    }
  };

  // High-performance streaming data fetch without artificial delays
  const fetchAllData = async (showToast = false) => {
    setLoadingData(true);
    try {
      // Parallel execution: each streams its state into UI the moment it arrives
      await Promise.all([
        fetchProductsData(),
        fetchCategoriesData(),
        fetchOrdersData(),
      ]);

      if (showToast) {
        showNotification("success", "Database synced with live data!");
      }
    } catch (e) {
      console.error("Failed to load admin data:", e);
      showNotification("error", "Failed to sync recent data from database.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      fetchAllData();
    }
  }, [currentUser]);

  // Handle Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      subtitle: "",
      categoryId: categories[0]?.id || "",
      price: "",
      originalPrice: "",
      rating: "5.0",
      image: "",
      warranty: "1 Year Official Ethiopian Warranty",
      voltage: "",
      power: "",
      dimensions: "",
      grade: "",
      description: "",
      inStock: true,
      isNewArrival: false,
      isBestSeller: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      subtitle: prod.subtitle || "",
      categoryId: prod.categoryId || (categories.find((c) => c.name === prod.category)?.id || categories[0]?.id || ""),
      price: String(prod.price),
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : "",
      rating: prod.rating !== undefined ? String(prod.rating) : "5.0",
      image: prod.image,
      warranty: prod.specs?.warranty || prod.warranty || "1 Year Official Warranty",
      voltage: prod.specs?.voltage || "",
      power: prod.specs?.power || "",
      dimensions: prod.specs?.dimensions || "",
      grade: prod.specs?.grade || "Commercial Salon Grade",
      description: prod.description || "",
      inStock: prod.inStock ?? true,
      isNewArrival: prod.isNewArrival ?? false,
      isBestSeller: prod.isBestSeller ?? false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingImage === "product") {
      showNotification("error", "Image is still uploading. Please wait a moment.");
      return;
    }

    if (productForm.image?.startsWith("blob:")) {
      showNotification("error", "Image is still processing. Please wait a moment.");
      return;
    }

    setActionLoading(true);
    try {
      const fallbackCat = categories.length > 0 ? categories[0].id : "";
      const defaultImg = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80";

      const payload: any = {
        name: productForm.name?.trim() || "Salon Product",
        subtitle: productForm.subtitle?.trim() || "",
        categoryId: productForm.categoryId || fallbackCat,
        price: productForm.price ? Number(productForm.price) : 0,
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        rating: productForm.rating ? Number(productForm.rating) : 5.0,
        image: productForm.image?.trim() || defaultImg,
        warranty: productForm.warranty?.trim() || "",
        voltage: productForm.voltage?.trim() || "",
        power: productForm.power?.trim() || "",
        dimensions: productForm.dimensions?.trim() || "",
        grade: productForm.grade?.trim() || "",
        description: productForm.description?.trim() || "",
        inStock: productForm.inStock,
        isNewArrival: productForm.isNewArrival,
        isBestSeller: productForm.isBestSeller,
      };

      let res;
      if (editingProduct) {
        payload.id = editingProduct.id;
        res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      if (data.product) {
        const catName =
          typeof data.product.category === "object"
            ? data.product.category?.name || "Product"
            : data.product.category || "Product";
        const normalizedProduct = {
          ...data.product,
          category: catName,
        };
        setProducts((prev) => {
          const exists = prev.some((p) => p.id === normalizedProduct.id);
          if (exists) {
            return prev.map((p) => (p.id === normalizedProduct.id ? normalizedProduct : p));
          }
          return [normalizedProduct, ...prev];
        });
      }

      setIsProductModalOpen(false);
      showNotification("success", editingProduct ? "Product updated successfully!" : "New product published to catalog!");
      void refreshStoreProducts();
      void refreshStoreCategories();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save product.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleProductStock = async (prod: any) => {
    const newStockStatus = !prod.inStock;

    // 1. Instant 0ms optimistic UI flip (zero delay when clicked)
    setProducts((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, inStock: newStockStatus } : p))
    );
    showNotification("success", `Stock updated: ${prod.name} is now ${newStockStatus ? "In Stock" : "Out of Stock"}.`);

    // 2. Persist to database in background
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: prod.id,
          inStock: newStockStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to toggle stock status");
      void refreshStoreProducts();
    } catch (err: any) {
      // Revert if network error
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, inStock: !newStockStatus } : p))
      );
      showNotification("error", err.message || "Failed to update stock status.");
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    askConfirmation({
      title: "Delete Product?",
      message: `Are you sure you want to permanently remove "${name}" from the active product catalog? This action cannot be undone.`,
      confirmLabel: "Delete Product",
      type: "danger",
      onConfirm: async () => {
        try {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          const res = await fetch(`/api/products?id=${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to delete product.");

          showNotification("success", `"${name}" removed from catalog.`);
          void refreshStoreProducts();
          void refreshStoreCategories();
        } catch (err: any) {
          showNotification("error", err.message || "Failed to delete product.");
          await fetchAllData();
        }
      },
    });
  };

  // Handle Category CRUD
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    setActionLoading(true);
    try {
      const defaultCatImg = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80";
      const payload: any = {
        name: categoryForm.name?.trim() || "New Department",
        slug: categoryForm.slug?.trim() || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        image: categoryForm.image?.trim() || defaultCatImg,
      };

      let res;
      if (editingCategory) {
        payload.id = editingCategory.id;
        res = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category.");

      if (data.category) {
        setCategories((prev) => {
          const exists = prev.some((c) => c.id === data.category.id);
          if (exists) {
            return prev.map((c) => (c.id === data.category.id ? data.category : c));
          }
          return [...prev, data.category];
        });
      }

      setIsCategoryModalOpen(false);
      showNotification("success", editingCategory ? "Category updated successfully!" : "New category created!");
      void refreshStoreCategories();
      void refreshStoreProducts();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = (cat: any) => {
    askConfirmation({
      title: "Delete Department Category?",
      message: `Are you sure you want to delete the "${cat.name}" category? Products under this department may need to be recategorized.`,
      confirmLabel: "Delete Category",
      type: "danger",
      onConfirm: async () => {
        try {
          setCategories((prev) => prev.filter((c) => c.id !== cat.id));
          const res = await fetch(`/api/categories?id=${cat.id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to delete category.");

          showNotification("success", `Category "${cat.name}" deleted.`);
          void refreshStoreCategories();
        } catch (err: any) {
          showNotification("error", err.message || "Failed to delete category.");
          await fetchAllData();
        }
      },
    });
  };

  // Handle Order Status Update (Instant 0ms Optimistic Update)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // 1. Instant optimistic state & local cache update
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem("yolanda_admin_orders_cache", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const statusLabel =
      newStatus === "CONFIRMED" ? "Confirmed" :
      newStatus === "IN_PROGRESS" ? "In Review" :
      newStatus === "CANCELLED" ? "Cancelled" : "Pending";
    showNotification("success", `Status updated to ${statusLabel}.`);

    // 2. Persist to database in background
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order status.");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save order status update.");
      fetchAllData();
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName || !profileForm.email) {
      showNotification("error", "Full name and email are required.");
      return;
    }

    // Instant optimistic update across top bar and portal
    if (currentUser) {
      setAuthenticatedUser({
        ...currentUser,
        fullName: profileForm.fullName,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar: profileForm.avatar,
      });
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentUser?.id,
          email: profileForm.email,
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          avatar: profileForm.avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");

      if (data.user) {
        setAuthenticatedUser({
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          phone: data.user.phone,
          avatar: data.user.avatar,
          role: data.user.role,
        });
      }

      showNotification("success", "Admin profile updated successfully!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update profile.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showNotification("error", "Please provide current and new passwords.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("error", "New passwords do not match.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentUser?.id,
          email: currentUser?.email,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password.");

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showNotification("success", "Password changed successfully!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to change password.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedProductCategory === "All" ||
        p.category === selectedProductCategory ||
        p.categoryId === selectedProductCategory;
      const q = productSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.specs?.power?.toLowerCase().includes(q) ||
        p.specs?.voltage?.toLowerCase().includes(q);
      const matchesStock =
        productStockFilter === "All" ||
        (productStockFilter === "In Stock" && p.inStock) ||
        (productStockFilter === "Out of Stock" && !p.inStock);
      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [products, selectedProductCategory, productSearch, productStockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Status Filter
      const s = (o.status || "").toUpperCase();
      let matchesStatus = orderStatusFilter === "All";
      if (orderStatusFilter === "NEW_ORDER") {
        matchesStatus = s === "NEW_ORDER" || s === "PENDING_VERIFICATION" || s === "PENDING";
      } else if (orderStatusFilter === "IN_PROGRESS") {
        matchesStatus = s === "IN_PROGRESS" || s === "STOCK_REVIEW" || s === "CONTACTED";
      } else if (orderStatusFilter === "CONFIRMED") {
        matchesStatus = s === "CONFIRMED" || s === "PAYMENT_APPROVED" || s === "COMPLETED" || s === "DELIVERED";
      } else if (orderStatusFilter === "CANCELLED") {
        matchesStatus = s === "CANCELLED" || s === "REJECTED" || s === "PAYMENT_REJECTED";
      }

      if (!matchesStatus) return false;

      // 2. Time Period Filter (24h, week, month)
      if (orderTimeFilter !== "all") {
        const now = new Date();
        const d = new Date(o.createdAt);
        if (!isNaN(d.getTime())) {
          const diffMs = now.getTime() - d.getTime();
          if (diffMs > 0) {
            if (orderTimeFilter === "24h" && diffMs > 24 * 60 * 60 * 1000) return false;
            if (orderTimeFilter === "week" && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
            if (orderTimeFilter === "month" && diffMs > 30 * 24 * 60 * 60 * 1000) return false;
          }
        }
      }

      // 3. Search Query Filter
      if (!orderSearch.trim()) return true;
      const q = orderSearch.toLowerCase().trim();
      return (
        o.orderNumber?.toLowerCase().includes(q) ||
        o.salonName?.toLowerCase().includes(q) ||
        o.contactPerson?.toLowerCase().includes(q) ||
        o.phone?.includes(q) ||
        o.city?.toLowerCase().includes(q)
      );
    });
  }, [orders, orderStatusFilter, orderTimeFilter, orderSearch]);

  const currentStatusLabel = useMemo(() => {
    switch (orderStatusFilter) {
      case "NEW_ORDER":
        return "Pending";
      case "IN_PROGRESS":
        return "In Review";
      case "CONFIRMED":
        return "Confirmed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "All Statuses";
    }
  }, [orderStatusFilter]);

  const currentTimeLabel = useMemo(() => {
    switch (orderTimeFilter) {
      case "24h":
        return "Last 24 Hours";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      default:
        return "All Orders";
    }
  }, [orderTimeFilter]);

  // Overall Metrics
  const metrics = useMemo(() => {
    const totalRev = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const pendingOrders = orders.filter((o) => {
      const s = (o.status || "").toUpperCase();
      return s === "NEW_ORDER" || s === "PENDING_VERIFICATION" || s === "PENDING";
    }).length;
    return {
      totalRevenue: totalRev,
      ordersCount: orders.length,
      pendingOrders,
      productsCount: products.length,
      categoriesCount: categories.length,
    };
  }, [orders, products, categories]);

  // Comprehensive Live Global Search Across All System Data
  const globalSearchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (!q) return { products: [], orders: [], categories: [], cms: [], actions: [], totalCount: 0 };

    // 1. Products Catalog (matches title, subtitle, category, description, specs, price)
    const matchingProducts = products
      .filter((p) => {
        const name = String(p?.name || "").toLowerCase();
        const sub = String(p?.subtitle || "").toLowerCase();
        const cat = String(p?.category || "").toLowerCase();
        const desc = String(p?.description || "").toLowerCase();
        const grade = String(p?.specs?.grade || "").toLowerCase();
        const voltage = String(p?.specs?.voltage || "").toLowerCase();
        const power = String(p?.specs?.power || "").toLowerCase();
        const warranty = String(p?.specs?.warranty || "").toLowerCase();
        const price = String(p?.price || "").toLowerCase();
        return (
          name.includes(q) ||
          sub.includes(q) ||
          cat.includes(q) ||
          desc.includes(q) ||
          grade.includes(q) ||
          voltage.includes(q) ||
          power.includes(q) ||
          warranty.includes(q) ||
          price.includes(q)
        );
      })
      .slice(0, 5);

    // 2. Customer Orders & Work Requests (matches orderNumber, salon, contact, phone, city, status, amount)
    const matchingOrders = orders
      .filter((o) => {
        const num = String(o?.orderNumber || "").toLowerCase();
        const salon = String(o?.salonName || "").toLowerCase();
        const contact = String(o?.contactPerson || "").toLowerCase();
        const phone = String(o?.phone || "").toLowerCase();
        const city = String(o?.city || "").toLowerCase();
        const status = String(o?.status || "").toLowerCase();
        const notes = String(o?.notes || "").toLowerCase();
        const amt = String(o?.totalAmount || "").toLowerCase();
        return (
          num.includes(q) ||
          salon.includes(q) ||
          contact.includes(q) ||
          phone.includes(q) ||
          city.includes(q) ||
          status.includes(q) ||
          notes.includes(q) ||
          amt.includes(q)
        );
      })
      .slice(0, 4);

    // 3. Categories (matches category name or slug)
    const matchingCategories = categories
      .filter((c) => {
        const name = String(c?.name || "").toLowerCase();
        const slug = String(c?.slug || "").toLowerCase();
        return name.includes(q) || slug.includes(q);
      })
      .slice(0, 3);

    // 4. Welcome Page & Storefront CMS (matches headlines, slogans, contact info, guarantees)
    const cmsMatches: Array<{ label: string; detail: string }> = [];
    const cms = welcomeSettings || cmsForm;
    if (cms) {
      const checkField = (field: string | undefined, label: string) => {
        if (field && String(field).toLowerCase().includes(q)) {
          cmsMatches.push({ label, detail: String(field) });
        }
      };
      checkField(cms.heroTitleLine1, "Hero Headline Line 1");
      checkField(cms.heroTitleLine2, "Hero Headline Line 2");
      checkField(cms.heroSubtitle, "Hero Description");
      checkField(cms.heroBadge, "Hero Trust Badge");
      checkField(cms.heroMotto, "Hero Motto");
      checkField(cms.contactPhone, "Showroom Phone");
      checkField(cms.contactEmail, "Inquiries Email");
      checkField(cms.contactLocation, "Showroom Location");
      checkField(cms.contactHours, "Business Hours");
      checkField(cms.footerDescription, "Footer Brand Statement");
      checkField(cms.footerService1, "Service Assurance #1");
      checkField(cms.footerService2, "Service Assurance #2");
      checkField(cms.footerService3, "Service Assurance #3");
      checkField(cms.footerService4, "Service Assurance #4");
    }

    // 5. System Quick Actions & Navigation
    const allActions = [
      { name: "Add New Product", desc: "Create and publish a new salon product", action: () => handleOpenAddProduct(), icon: Plus },
      { name: "Create Sell Category", desc: "Add a new product department category", action: () => handleOpenAddCategory(), icon: Layers },
      { name: "Welcome Page Editor", desc: "Customize storefront hero, footer, and contact info", action: () => setActiveTab("welcome_cms"), icon: Layout },
      { name: "Salon Work Requests", desc: "Review customer wholesale orders and inquiries", action: () => setActiveTab("orders"), icon: ClipboardList },
      { name: "Product Catalog", desc: "Browse all salon products, specifications & pricing", action: () => { setActiveTab("products"); setCatalogSubView("products"); }, icon: Package },
      { name: "Product Categories", desc: "Browse product categories & departments", action: () => { setActiveTab("products"); setCatalogSubView("categories"); }, icon: Layers },
      { name: "Operations Dashboard", desc: "View executive revenue stats, metrics & charts", action: () => setActiveTab("overview"), icon: LayoutDashboard },
      { name: "Admin Profile & Security", desc: "Update admin credentials and password", action: () => setActiveTab("profile"), icon: UserCheck },
      { name: "Refresh All Records", desc: "Fetch fresh database records from PostgreSQL", action: () => fetchAllData(), icon: RefreshCw },
    ];
    const matchingActions = allActions
      .filter((a) => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q))
      .slice(0, 3);

    return {
      products: matchingProducts,
      orders: matchingOrders,
      categories: matchingCategories,
      cms: cmsMatches.slice(0, 3),
      actions: matchingActions,
      totalCount:
        matchingProducts.length +
        matchingOrders.length +
        matchingCategories.length +
        cmsMatches.length +
        matchingActions.length,
    };
  }, [globalSearchQuery, products, orders, categories, welcomeSettings, cmsForm]);

  // If not signed in as admin, redirect immediately to Welcome Page (zero intermediate flicker or blinking page)
  useEffect(() => {
    if (!isAuthLoading && (!currentUser || currentUser.role !== "ADMIN")) {
      window.location.replace("/");
    }
  }, [currentUser, isAuthLoading]);

  // Smooth Refresh & Authorization Check
  if (isAuthLoading || (hasStoredAdminSession && (!currentUser || currentUser.role !== "ADMIN"))) {
    return <AdminSkeleton />;
  }

  // Not an admin: return seamless clean background while redirecting
  if (!currentUser || currentUser.role !== "ADMIN") {
    return <div className="min-h-screen bg-[#FAF6F0]" />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF6F0] p-0 md:p-3 md:gap-3 flex text-[#4F2D1C]">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-semibold text-white animate-in slide-in-from-bottom-5 duration-200 ${
            notification.type === "success" ? "bg-[#4F2D1C]" : "bg-red-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          LEFT FLOATING CAPSULE SIDEBAR
      ═══════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:relative md:inset-auto md:h-full flex flex-col justify-between bg-[#4F2D1C] text-white border-r md:border border-white/10 md:rounded-3xl shadow-2xl transition-all duration-300 ease-in-out shrink-0 overflow-hidden overflow-x-hidden ${
          isMobileSidebarOpen
            ? "translate-x-0 w-64 rounded-none p-3.5"
            : "-translate-x-full md:translate-x-0 " + (isSidebarCollapsed ? "w-16 p-2" : "w-56 lg:w-60 p-3")
        }`}
      >
        {/* Brand Header */}
        <div className={`pb-3 mb-1.5 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} border-b border-white/10 shrink-0`}>
          {isSidebarCollapsed ? (
            /* Collapsed Brand Header: Hover reveals expand button, click uncollapses */
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="relative group w-9 h-9 rounded-full cursor-pointer focus:outline-none"
              title="Expand Sidebar"
            >
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 shadow-md flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-white/20 transition-all duration-200 group-hover:ring-white/50">
                <img
                  src={cmsForm.brandLogoImage || welcomeSettings?.brandLogoImage || "/yolanda-logo.jpg"}
                  alt="Yolanda Logo"
                  className="w-full h-full object-cover rounded-full transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as any).src = "/yolanda-logo.jpg";
                  }}
                />
              </div>
              {/* Overlay with expand chevron appearing only on hover */}
              <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </button>
          ) : (
            /* Expanded Brand Header: Brand Info + Collapse Button */
            <>
              <div
                className="flex items-center gap-2.5 min-w-0"
              >
                {/* Brand Logo */}
                <div className="w-8.5 h-8.5 rounded-full bg-white/10 border border-white/20 shadow-md flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-white/20">
                  <img
                    src={cmsForm.brandLogoImage || welcomeSettings?.brandLogoImage || "/yolanda-logo.jpg"}
                    alt="Yolanda Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as any).src = "/yolanda-logo.jpg";
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <span className="font-serif font-black text-sm text-white tracking-tight block truncate">
                    Yolanda
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 block -mt-0.5 truncate">
                    {welcomeSettings?.brandSubtitle || "Salon Products"}
                  </span>
                </div>
              </div>

              {/* Desktop/Tablet Collapse Toggle Button */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="hidden md:flex w-6.5 h-6.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 items-center justify-center transition cursor-pointer shrink-0 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.3)] active:scale-[0.95] group"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>
            </>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 text-white hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-6 no-scrollbar">
          {/* Group 1: General / Core */}
          <div>
            <button
              onClick={() => {
                setActiveTab("overview");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full max-w-full flex items-center ${
                isSidebarCollapsed ? "w-11 h-11 mx-auto justify-center px-0" : "gap-3 px-3.5 py-3 min-h-[46px]"
              } rounded-2xl text-xs sm:text-[13px] transition-all duration-150 cursor-pointer group active:scale-[0.98] ${
                activeTab === "overview"
                  ? "bg-transparent text-white font-bold border border-white/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.35),0_3px_8px_rgba(0,0,0,0.25)] relative before:content-[''] before:absolute before:left-1.5 before:top-3 before:bottom-3 before:w-0.5 before:rounded-full before:bg-white"
                  : "bg-transparent text-white/75 hover:text-white font-medium border border-transparent hover:border-white/10 shadow-none hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.2)]"
              }`}
              title="Dashboard Overview"
            >
              <LayoutDashboard className={`w-5 h-5 shrink-0 transition-all duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-0.5 ${
                activeTab === "overview" ? "text-white" : "text-white/80 group-hover:text-white"
              }`} />
              {!isSidebarCollapsed && <span className="truncate text-white font-semibold">Dashboard Overview</span>}
            </button>
          </div>

          {/* Section Divider: MANAGEMENT */}
          <div className="pt-2">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-2 px-2.5 pb-3 text-[9px] font-black uppercase tracking-widest text-white/70">
                <span className="h-px bg-white/10 flex-1" />
                <span>MANAGEMENT</span>
                <span className="h-px bg-white/10 flex-1" />
              </div>
            ) : (
              <div className="h-px bg-white/10 mx-2 my-3" />
            )}

            <div className="space-y-4 pt-1">
              {/* 1. Welcome Page */}
              <button
                onClick={() => {
                  setActiveTab("welcome_cms");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full max-w-full flex items-center ${
                  isSidebarCollapsed ? "w-11 h-11 mx-auto justify-center px-0" : "gap-3 px-3.5 py-3 min-h-[46px]"
                } rounded-2xl text-xs sm:text-[13px] transition-all duration-150 cursor-pointer group active:scale-[0.98] ${
                  activeTab === "welcome_cms"
                    ? "bg-transparent text-white font-bold border border-white/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.35),0_3px_8px_rgba(0,0,0,0.25)] relative before:content-[''] before:absolute before:left-1.5 before:top-3 before:bottom-3 before:w-0.5 before:rounded-full before:bg-white"
                    : "bg-transparent text-white/75 hover:text-white font-medium border border-transparent hover:border-white/10 shadow-none hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.2)]"
                }`}
                title="Welcome Page"
              >
                <Layout className={`w-5 h-5 shrink-0 transition-all duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-0.5 ${
                  activeTab === "welcome_cms" ? "text-white" : "text-white/80 group-hover:text-white"
                }`} />
                {!isSidebarCollapsed && <span className="truncate text-white font-semibold">Welcome Page</span>}
              </button>

              {/* 2. Product Catalog */}
              <button
                onClick={() => {
                  setActiveTab("products");
                  setCatalogSubView("categories");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full max-w-full flex items-center justify-between relative ${
                  isSidebarCollapsed ? "w-11 h-11 mx-auto justify-center px-0" : "gap-3 px-3.5 py-3 min-h-[46px]"
                } rounded-2xl text-xs sm:text-[13px] transition-all duration-150 cursor-pointer group active:scale-[0.98] ${
                  activeTab === "products" || activeTab === "categories"
                    ? "bg-transparent text-white font-bold border border-white/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.35),0_3px_8px_rgba(0,0,0,0.25)] before:content-[''] before:absolute before:left-1.5 before:top-3 before:bottom-3 before:w-0.5 before:rounded-full before:bg-white"
                    : "bg-transparent text-white/75 hover:text-white font-medium border border-transparent hover:border-white/10 shadow-none hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.2)]"
                }`}
                title={`Product Catalog (${products.length})`}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} min-w-0`}>
                  <Package className={`w-5 h-5 shrink-0 transition-all duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-0.5 ${
                    activeTab === "products" || activeTab === "categories" ? "text-white" : "text-white/80 group-hover:text-white"
                  }`} />
                  {!isSidebarCollapsed && <span className="truncate text-white font-semibold">Product Catalog</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#4F2D1C] font-mono shadow-xs shrink-0">
                    {products.length}
                  </span>
                )}
                {/* Collapsed Absolute Notifier Badge (Zero layout disruption, pointer-events-none) */}
                {isSidebarCollapsed && products.length > 0 && (
                  <span className="absolute top-0 right-0 min-w-[17px] h-[17px] px-1 rounded-full text-[9px] font-black bg-white text-[#4F2D1C] font-mono shadow-[0_2px_6px_rgba(0,0,0,0.35)] flex items-center justify-center border border-white/40 pointer-events-none select-none z-20 leading-none">
                    {products.length > 99 ? "99+" : products.length}
                  </span>
                )}
              </button>

              {/* 3. Salon Orders */}
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full max-w-full flex items-center justify-between relative ${
                  isSidebarCollapsed ? "w-11 h-11 mx-auto justify-center px-0" : "gap-3 px-3.5 py-3 min-h-[46px]"
                } rounded-2xl text-xs sm:text-[13px] transition-all duration-150 cursor-pointer group active:scale-[0.98] ${
                  activeTab === "orders"
                    ? "bg-transparent text-white font-bold border border-white/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.35),0_3px_8px_rgba(0,0,0,0.25)] before:content-[''] before:absolute before:left-1.5 before:top-3 before:bottom-3 before:w-0.5 before:rounded-full before:bg-white"
                    : "bg-transparent text-white/75 hover:text-white font-medium border border-transparent hover:border-white/10 shadow-none hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.2)]"
                }`}
                title={`Salon Orders (${metrics.pendingOrders > 0 ? `${metrics.pendingOrders} pending` : orders.length})`}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} min-w-0`}>
                  <ClipboardList className={`w-5 h-5 shrink-0 transition-all duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-0.5 ${
                    activeTab === "orders" ? "text-white" : "text-white/80 group-hover:text-white"
                  }`} />
                  {!isSidebarCollapsed && <span className="truncate text-white font-semibold">Salon Orders</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white uppercase tracking-wider shadow-xs shrink-0">
                    {metrics.pendingOrders > 0 ? `${metrics.pendingOrders} new` : orders.length}
                  </span>
                )}
                {/* Collapsed Absolute Notifier Badge (Zero layout disruption, pointer-events-none) */}
                {isSidebarCollapsed && (metrics.pendingOrders > 0 || orders.length > 0) && (
                  <span
                    className="absolute top-0 right-0 min-w-[17px] h-[17px] px-1 rounded-full text-[9px] font-black font-mono shadow-[0_2px_6px_rgba(0,0,0,0.35)] flex items-center justify-center border border-white/40 pointer-events-none select-none z-20 leading-none bg-white text-[#4F2D1C]"
                  >
                    {metrics.pendingOrders > 0
                      ? metrics.pendingOrders > 99
                        ? "99+"
                        : metrics.pendingOrders
                      : orders.length > 99
                      ? "99+"
                      : orders.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="pt-2.5 border-t border-white/10 space-y-1.5 shrink-0">
          {!isSidebarCollapsed && (
            <p className="text-[9px] text-center text-white/70 font-mono tracking-wider pt-0.5 font-bold">
              Yolanda Admin v1.0
            </p>
          )}
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT FLOATING CAPSULE APPLICATION CONTAINER
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-full rounded-none md:rounded-3xl shadow-xl border-0 md:border border-[#4F2D1C]/10 overflow-hidden bg-[#FAF6F0]">
        {/* 1. STICKY MOBILE TOP OPERATIONS BAR (Matches Desktop #4F2D1C Header) */}
        <header className="md:hidden sticky top-0 z-50 bg-[#4F2D1C] text-[#FFFFFF] px-4 pt-3 pb-3.5 shadow-md rounded-b-3xl">
          {/* Top Row: Brand Identity + Quick Actions + Profile Pill */}
          <div className="flex items-center justify-between gap-2">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#FAF6F0] text-[#4F2D1C] flex items-center justify-center font-serif font-bold text-xs shrink-0 ring-2 ring-white/20 shadow-xs overflow-hidden">
                {cmsForm.brandLogoImage || welcomeSettings?.brandLogoImage ? (
                  <img
                    src={cmsForm.brandLogoImage || welcomeSettings?.brandLogoImage}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Y"
                )}
              </div>
              <div className="truncate">
                <h1 className="font-serif font-bold text-base leading-none text-[#FFFFFF]">
                  Yolanda
                </h1>
                <p className="text-[9px] tracking-widest uppercase text-white/75 font-semibold mt-0.5 truncate">
                  Salon &amp; Makeup Equipm...
                </p>
              </div>
            </div>

            {/* Right Action Cluster: Search, Profile Avatar */}
            <div className="flex items-center gap-1.5 shrink-0">

              {/* Mobile Search Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen((prev) => !prev);
                  if (isMobileSearchOpen) {
                    setGlobalSearchQuery("");
                    setIsSearchOpen(false);
                  }
                }}
                aria-label="Search admin portal"
                className="w-9 h-9 rounded-full bg-[#2D1C14]/80 hover:bg-[#2D1C14] border border-white/10 flex items-center justify-center text-[#FFFFFF] active:scale-95 transition-transform cursor-pointer shadow-xs"
              >
                {isMobileSearchOpen ? (
                  <X className="w-4 h-4 stroke-[2.2]" />
                ) : (
                  <Search className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>

              {/* Admin Profile Pill ("YO") */}
              <div className="relative" ref={mobileProfileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="h-9 pl-1 pr-2 rounded-full bg-[#2D1C14]/90 border border-white/15 flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-full bg-[#4F2D1C] border border-white/20 flex items-center justify-center text-[11px] font-bold text-[#FFFFFF] overflow-hidden">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="Admin"
                        className="w-full h-full object-cover"
                      />
                    ) : currentUser.fullName ? (
                      currentUser.fullName.slice(0, 2).toUpperCase()
                    ) : (
                      "YO"
                    )}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mobile Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-[#4F2D1C]/10 shadow-[0_12px_36px_rgba(45,28,20,0.2)] p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 bg-[#FAF6F0] rounded-xl mb-1.5 border border-[#4F2D1C]/5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#4F2D1C] text-[#FAF6F0] shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt="Admin"
                            className="w-full h-full object-cover"
                          />
                        ) : currentUser.fullName ? (
                          currentUser.fullName.slice(0, 2).toUpperCase()
                        ) : (
                          "AD"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#4F2D1C] truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-[10px] text-[#4F2D1C]/60 truncate font-mono">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#4F2D1C] hover:bg-[#FAF6F0] transition text-left cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#4F2D1C]" />
                      <span>Profile &amp; Settings</span>
                    </button>
                    <div className="my-1 border-t border-[#4F2D1C]/10" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Search Input (matches Home page search) */}
          {isMobileSearchOpen && (
            <div className="mt-2.5 relative animate-in fade-in duration-150" ref={mobileSearchContainerRef}>
              <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search products, orders, categories..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-[#2D1C14] border border-white/15 text-xs text-[#FFFFFF] placeholder:text-white/50 focus:outline-none focus:border-white/40 shadow-inner"
              />
            {globalSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setGlobalSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Search Floating Popover on Mobile */}
            {isSearchOpen && globalSearchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white border border-[#4F2D1C]/10 shadow-[0_16px_40px_rgba(45,28,20,0.18)] max-h-[60vh] overflow-y-auto z-50 p-3 text-[#4F2D1C] animate-in fade-in slide-in-from-top-2 duration-150">
                {globalSearchResults.totalCount === 0 ? (
                  <div className="p-4 text-center">
                    <Search className="w-6 h-6 text-[#4F2D1C]/30 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-[#4F2D1C]">No records found</p>
                    <p className="text-[10px] text-[#4F2D1C]/60 mt-0.5">
                      No products, orders, or categories match &quot;{globalSearchQuery}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {globalSearchResults.products.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1 border-b border-[#4F2D1C]/5 text-[10px] font-bold text-[#4F2D1C]/50 uppercase tracking-wider">
                          <span>Product Catalog ({globalSearchResults.products.length})</span>
                        </div>
                        <div className="mt-1 space-y-1">
                          {globalSearchResults.products.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                handleOpenEditProduct(p);
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF6F0] transition text-left cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#4F2D1C]/10 flex items-center justify-center">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Box className="w-4 h-4 text-[#4F2D1C]" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#4F2D1C] truncate">{p.name}</p>
                                <p className="text-[10px] text-[#4F2D1C]/60 truncate font-mono">
                                  {Number(p.price || 0).toLocaleString()} ETB
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {globalSearchResults.orders.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1 border-b border-[#4F2D1C]/5 text-[10px] font-bold text-[#4F2D1C]/50 uppercase tracking-wider">
                          <span>Orders ({globalSearchResults.orders.length})</span>
                        </div>
                        <div className="mt-1 space-y-1">
                          {globalSearchResults.orders.map((o) => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => {
                                setOrderSearch(o.orderNumber || o.salonName || "");
                                setActiveTab("orders");
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-[#FAF6F0] transition text-left cursor-pointer"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#4F2D1C] truncate">
                                  {o.salonName || o.contactPerson || "Customer Order"}
                                </p>
                                <p className="text-[10px] text-[#4F2D1C]/60 truncate font-mono">
                                  #{o.orderNumber}
                                </p>
                              </div>
                              <span className="text-xs font-bold font-mono text-[#4F2D1C] shrink-0">
                                {Number(o.totalAmount || 0).toLocaleString()} ETB
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

        {/* Desktop Operations Header Bar */}
        <header className="hidden md:flex h-14 md:h-16 bg-[#4F2D1C] border-b border-white/10 px-4 sm:px-6 md:px-8 text-white items-center justify-between gap-4 shrink-0 relative z-40 shadow-xs">
          {/* Left: Mobile hamburger */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white shadow-xs cursor-pointer active:scale-[0.95]"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Global Search Input with Live Results Popover */}
          <div className="relative flex-1 max-w-xs sm:max-w-md mx-2" ref={searchContainerRef}>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2D1C14] border border-white/15 focus-within:border-white/35 focus-within:ring-2 focus-within:ring-white/20 text-xs text-white w-full transition shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]">
              <Search className="w-3.5 h-3.5 text-white/80 shrink-0" />
              <input
                type="text"
                placeholder="Search products, orders, categories..."
                value={globalSearchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsSearchOpen(false);
                  }
                }}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-white/60 w-full"
              />
              {globalSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setGlobalSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="text-white/80 hover:text-white cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Search Floating Popover */}
            {isSearchOpen && globalSearchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white border border-[#4F2D1C]/10 shadow-[0_16px_40px_rgba(45,28,20,0.18)] max-h-[75vh] overflow-y-auto z-50 p-3 text-[#4F2D1C] animate-in fade-in slide-in-from-top-2 duration-150">
                {globalSearchResults.totalCount === 0 ? (
                  <div className="p-6 text-center">
                    <Search className="w-7 h-7 text-[#4F2D1C]/30 mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#4F2D1C]">No records found</p>
                    <p className="text-[11px] text-[#4F2D1C]/60 mt-0.5">
                      No products, orders, or categories match &quot;{globalSearchQuery}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Products */}
                    {globalSearchResults.products.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-[#4F2D1C]/5 text-[10px] font-bold text-[#4F2D1C]/50 uppercase tracking-wider">
                          <span>Product Catalog ({globalSearchResults.products.length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              setProductSearch(globalSearchQuery);
                              setActiveTab("products");
                              setCatalogSubView("products");
                              setIsSearchOpen(false);
                            }}
                            className="text-[#4F2D1C] font-bold hover:underline cursor-pointer"
                          >
                            View all
                          </button>
                        </div>
                        <div className="mt-1 space-y-1">
                          {globalSearchResults.products.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                handleOpenEditProduct(p);
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF6F0] transition text-left cursor-pointer group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#4F2D1C]/10 flex items-center justify-center relative">
                                {p.image ? (
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <Package className="w-4 h-4 text-[#4F2D1C]" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#4F2D1C] truncate group-hover:text-[#4F2D1C]/80">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-[#4F2D1C]/60 truncate">
                                  {(typeof p.category === "object" ? p.category?.name : p.category) || "Salon Product"} &bull; {p.specs?.grade || "Commercial"}
                                </p>
                              </div>
                              <span className="text-xs font-bold font-mono text-[#4F2D1C] shrink-0">
                                {Number(p.price || 0).toLocaleString()} ETB
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Orders */}
                    {globalSearchResults.orders.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-[#4F2D1C]/5 text-[10px] font-bold text-[#4F2D1C]/50 uppercase tracking-wider">
                          <span>Orders &amp; Requests ({globalSearchResults.orders.length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              setOrderSearch(globalSearchQuery);
                              setActiveTab("orders");
                              setIsSearchOpen(false);
                            }}
                            className="text-[#4F2D1C] font-bold hover:underline cursor-pointer"
                          >
                            View all
                          </button>
                        </div>
                        <div className="mt-1 space-y-1">
                          {globalSearchResults.orders.map((o) => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => {
                                setOrderSearch(o.orderNumber || o.salonName || "");
                                setActiveTab("orders");
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#FAF6F0] transition text-left cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#4F2D1C] truncate group-hover:text-[#4F2D1C]/80">
                                  {o.salonName || o.contactPerson || "Customer Order"}
                                </p>
                                <p className="text-[10px] text-[#4F2D1C]/60 truncate font-mono">
                                  #{o.orderNumber} &bull; {o.phone || "No phone"}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  o.status === "DELIVERED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : o.status === "VERIFIED" || o.status === "CONFIRMED"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-[#4F2D1C]/10 text-[#4F2D1C]"
                                }`}>
                                  {o.status || "PENDING"}
                                </span>
                                <p className="text-[11px] font-bold font-mono text-[#4F2D1C] mt-0.5">
                                  {Number(o.totalAmount || 0).toLocaleString()} ETB
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories */}
                    {globalSearchResults.categories.length > 0 && (
                      <div>
                        <div className="px-2 pb-1.5 border-b border-[#4F2D1C]/5 text-[10px] font-bold text-[#4F2D1C]/50 uppercase tracking-wider">
                          Categories ({globalSearchResults.categories.length})
                        </div>
                        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {globalSearchResults.categories.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setSelectedProductCategory(c.name);
                                setActiveTab("products");
                                setCatalogSubView("products");
                                setIsSearchOpen(false);
                              }}
                              className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#FAF6F0] transition text-left cursor-pointer group"
                            >
                              <Layers className="w-3.5 h-3.5 text-[#4F2D1C] shrink-0" />
                              <span className="text-xs font-semibold text-[#4F2D1C] truncate group-hover:text-[#4F2D1C]/80">
                                {c.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Welcome CMS Matches */}
                    {globalSearchResults.cms.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-[#4F2D1C]/5 text-[10px] font-bold text-[#4F2D1C]/50 uppercase tracking-wider">
                          <span>Welcome &amp; Storefront Content ({globalSearchResults.cms.length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("welcome_cms");
                              setIsSearchOpen(false);
                            }}
                            className="text-[#4F2D1C] font-bold hover:underline cursor-pointer"
                          >
                            Open Editor
                          </button>
                        </div>
                        <div className="mt-1 space-y-1">
                          {globalSearchResults.cms.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setActiveTab("welcome_cms");
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF6F0] transition text-left cursor-pointer group"
                            >
                              <Layout className="w-3.5 h-3.5 text-[#4F2D1C] shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#4F2D1C] group-hover:text-[#4F2D1C]/80 truncate">
                                  {item.label}
                                </p>
                                <p className="text-[10px] text-[#4F2D1C]/60 truncate font-mono">
                                  {item.detail}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick System Actions & Shortcuts */}
                    {globalSearchResults.actions.length > 0 && (
                      <div>
                        <div className="px-2 pb-1.5 border-b border-[#4F2D1C]/5 text-[10px] font-bold text-[#4F2D1C]/50 uppercase tracking-wider">
                          Quick System Actions ({globalSearchResults.actions.length})
                        </div>
                        <div className="mt-1 space-y-1">
                          {globalSearchResults.actions.map((act, idx) => {
                            const IconComponent = act.icon;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  act.action();
                                  setIsSearchOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF6F0] transition text-left cursor-pointer group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C] shrink-0">
                                  <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-[#4F2D1C] group-hover:text-[#4F2D1C]/80 truncate">
                                    {act.name}
                                  </p>
                                  <p className="text-[10px] text-[#4F2D1C]/60 truncate">
                                    {act.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Admin User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Admin Profile Dropdown Pill */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 sm:gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full bg-[#2D1C14] hover:bg-[#20130d] border border-white/15 transition cursor-pointer select-none group shadow-xs"
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
                title="Admin Account & Settings"
              >
                <div className="w-8 h-8 rounded-full bg-[#4F2D1C] text-white flex items-center justify-center text-xs font-bold shadow-xs ring-2 ring-white/20 transition overflow-hidden">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullName || "Admin"}
                      className="w-full h-full object-cover"
                    />
                  ) : currentUser.fullName ? (
                    currentUser.fullName.slice(0, 2).toUpperCase()
                  ) : (
                    "AD"
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">
                    {currentUser.fullName}
                  </p>
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider block">
                    Administrator
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Tapdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#4F2D1C]/10 shadow-[0_12px_36px_rgba(45,28,20,0.2)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Header */}
                  <div className="px-3 py-2.5 bg-[#FAF6F0] rounded-xl mb-1.5 border border-[#4F2D1C]/5 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#4F2D1C] text-[#FAF6F0] shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden border border-[#4F2D1C]/10">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.fullName || "Admin"}
                          className="w-full h-full object-cover"
                        />
                      ) : currentUser.fullName ? (
                        currentUser.fullName.slice(0, 2).toUpperCase()
                      ) : (
                        "AD"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#4F2D1C] truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-[#4F2D1C]/60 truncate font-mono">
                        {currentUser.email}
                      </p>
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4F2D1C] text-[#FAF6F0] text-[9px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                        <span>Administrator</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                        activeTab === "profile"
                          ? "bg-[#4F2D1C] text-[#FAF6F0]"
                          : "text-[#4F2D1C] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <UserCheck className={`w-4 h-4 ${activeTab === "profile" ? "text-[#FAF6F0]" : "text-[#4F2D1C]"}`} />
                      <span>Profile &amp; Security Settings</span>
                    </button>
                  </div>

                  <div className="my-1.5 border-t border-[#4F2D1C]/10" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Fixed Welcome Action Bar (Save) directly below top nav bar */}
        {activeTab === "welcome_cms" && (
          <div className="md:hidden bg-[#FAF6F0] px-4 pt-2.5 pb-2 shrink-0 z-20">
            <div className="max-w-[430px] mx-auto">
              <button
                type="button"
                disabled={actionLoading}
                onClick={async () => {
                  await handleSaveWelcomeCMS();
                  setIsWelcomeSaved(true);
                  setTimeout(() => setIsWelcomeSaved(false), 1800);
                }}
                className="w-full h-9 px-3 rounded-xl bg-[#4F2D1C] hover:bg-[#2D1C14] text-[#FFFFFF] text-xs font-bold shadow-xs active:scale-[0.98] flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isWelcomeSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FFFFFF] shrink-0" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-[#FFFFFF] shrink-0" />
                    <span>{actionLoading ? "Saving..." : "Save Changes"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 pt-3 pb-28 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4 md:space-y-6">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === "overview" && (
          <>
            {/* Mobile View (Phones & Small Viewports: max-w-[430px]) */}
            <div className="block md:hidden max-w-[430px] mx-auto space-y-5 animate-in fade-in duration-200">
              {/* 2x2 KPI STAT CARDS GRID */}
              <section className="grid grid-cols-2 gap-3">
                {/* Card 1: TOTAL ORDERS SUBMITTED */}
                <div className="bg-[#FFFFFF] rounded-2xl p-3.5 border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.07),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F2D1C]/70 leading-tight whitespace-pre-line">
                      TOTAL ORDERS{"\n"}SUBMITTED
                    </p>
                    <div className="w-9 h-9 rounded-xl bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-sm">
                      <ClipboardList className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                  <div className="my-2.5 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#4F2D1C] tracking-tight leading-none">
                      {metrics.ordersCount}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-[#4F2D1C]/[0.08]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/10">
                      {metrics.pendingOrders} Pending
                    </span>
                  </div>
                </div>

                {/* Card 2: TOTAL ORDER VALUE */}
                <div className="bg-[#FFFFFF] rounded-2xl p-3.5 border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.07),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F2D1C]/70 leading-tight whitespace-pre-line">
                      TOTAL ORDER{"\n"}VALUE
                    </p>
                    <div className="w-9 h-9 rounded-xl bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-sm">
                      <Banknote className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                  <div className="my-2.5 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#4F2D1C] tracking-tight leading-none">
                      {metrics.totalRevenue.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-[#4F2D1C]/75">
                      ETB
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-[#4F2D1C]/[0.08]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/10">
                      Gross Pipeline
                    </span>
                  </div>
                </div>

                {/* Card 3: CATALOG PRODUCTS */}
                <div className="bg-[#FFFFFF] rounded-2xl p-3.5 border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.07),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F2D1C]/70 leading-tight whitespace-pre-line">
                      CATALOG{"\n"}PRODUCTS
                    </p>
                    <div className="w-9 h-9 rounded-xl bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-sm">
                      <Box className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                  <div className="my-2.5 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#4F2D1C] tracking-tight leading-none">
                      {metrics.productsCount}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-[#4F2D1C]/[0.08]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/10">
                      Active Catalog
                    </span>
                  </div>
                </div>

                {/* Card 4: SELL CATEGORIES */}
                <div className="bg-[#FFFFFF] rounded-2xl p-3.5 border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.07),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F2D1C]/70 leading-tight whitespace-pre-line">
                      SELL{"\n"}CATEGORIES
                    </p>
                    <div className="w-9 h-9 rounded-xl bg-[#4F2D1C] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-sm">
                      <Layers className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                  <div className="my-2.5 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#4F2D1C] tracking-tight leading-none">
                      {metrics.categoriesCount}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-[#4F2D1C]/[0.08]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/10">
                      Active
                    </span>
                  </div>
                </div>
              </section>

              {/* 3. RECENT SALON PRODUCT ORDERS CARD */}
              <section className="bg-[#FFFFFF] rounded-3xl p-4 border border-[#4F2D1C]/[0.08] shadow-[0_10px_25px_-6px_rgba(79,45,28,0.07)] space-y-3.5">
                {/* Section Header */}
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#4F2D1C]/[0.08]">
                  <h2 className="text-base font-extrabold text-[#4F2D1C] tracking-tight">
                    Recent Salon Product Orders
                  </h2>
                  <button
                    type="button"
                    onClick={navigateToSalonOrders}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#4F2D1C] hover:opacity-80 shrink-0 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile Stacked Order Card List */}
                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#4F2D1C]/60">
                    No orders have been submitted yet. Direct customer orders will appear here dynamically.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((ord) => {
                      const orderNum = ord.orderNumber || (ord.id ? `#${ord.id.slice(-6)}` : "SLN-ORDER");
                      const salonTitle = ord.salonName || ord.businessName || "Salon Client";
                      const client = ord.contactPerson || ord.clientName || "Valued Customer";
                      const phoneNum = ord.phone || ord.phoneNumber || "No phone";
                      const cityName = ord.city || ord.deliveryAddress || "Addis Ababa";
                      const totalAmount = Number(ord.totalAmount || 0);
                      const isConfirmed =
                        ord.status === "CONFIRMED" ||
                        ord.status === "PAYMENT_APPROVED" ||
                        ord.status === "COMPLETED" ||
                        ord.status === "DELIVERED";
                      const isInProgress =
                        ord.status === "IN_PROGRESS" ||
                        ord.status === "STOCK_REVIEW" ||
                        ord.status === "CONTACTED";
                      const isCancelled =
                        ord.status === "CANCELLED" ||
                        ord.status === "REJECTED";

                      const statusLabel = isConfirmed
                        ? "CONFIRMED"
                        : isInProgress
                        ? "IN REVIEW"
                        : isCancelled
                        ? "CANCELLED"
                        : "PENDING";

                      const statusColorClass = isConfirmed
                        ? "text-emerald-700"
                        : isInProgress
                        ? "text-amber-800"
                        : isCancelled
                        ? "text-rose-700"
                        : "text-blue-700";

                      return (
                        <div
                          key={ord.id}
                          className="rounded-2xl bg-[#FAF6F0]/60 border border-[#4F2D1C]/10 p-3.5 space-y-3"
                        >
                          {/* Row 1: Order # + Status Pill */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-[#2D1C14] tracking-tight font-mono">
                              {orderNum}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white border border-[#4F2D1C]/15 ${statusColorClass}`}>
                              {statusLabel}
                            </span>
                          </div>

                          {/* Row 2: Salon & Client Name + Contact & City */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-extrabold text-[#4F2D1C] leading-snug">
                                {salonTitle}
                              </h3>
                              <p className="text-xs text-[#4F2D1C]/65 font-medium">
                                {client}
                              </p>
                            </div>

                            <div className="text-right text-[11px] text-[#4F2D1C]/80 space-y-0.5">
                              <a
                                href={`tel:${phoneNum}`}
                                className="inline-flex items-center justify-end gap-1 font-semibold text-[#2D1C14] hover:underline"
                              >
                                <Phone className="w-3 h-3 text-[#4F2D1C]" />
                                {phoneNum}
                              </a>
                              <p className="flex items-center justify-end gap-1 text-[#4F2D1C]/70">
                                <MapPin className="w-3 h-3 text-[#4F2D1C]" />
                                {cityName}
                              </p>
                            </div>
                          </div>

                          {/* Row 3: Total Amount + Claymorphic "Manage" Button */}
                          <div className="pt-2.5 border-t border-[#4F2D1C]/10 flex items-center justify-between gap-2">
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider font-bold text-[#4F2D1C]/55">
                                Total Amount
                              </span>
                              <span className="text-sm font-extrabold text-[#4F2D1C] font-mono">
                                {totalAmount.toLocaleString()} ETB
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("orders");
                                setOrderSearch(ord.orderNumber);
                              }}
                              className="px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-[#FFFFFF] text-xs font-extrabold border border-[#4F2D1C]/15 shadow-[0_4px_10px_-2px_rgba(79,45,28,0.12),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,45,28,0.08)] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              Manage
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Desktop View (Tablets & Desktop Screens: hidden md:block) */}
            <div className="hidden md:block space-y-6 animate-in fade-in duration-200">
              {/* KPI Cards Grid (4-col on desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {/* Card 1: Orders */}
                <div className="group bg-[#FCFAF6] rounded-2xl p-5 border border-[#4F2D1C]/10 shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06),inset_0_2px_4px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(79,45,28,0.14)] hover:-translate-y-1.5 hover:border-[#4F2D1C]/25 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#4F2D1C]/70">
                        Total Orders Submitted
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#4F2D1C] mt-1 tracking-tight">
                        {metrics.ordersCount}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#4F2D1C] flex items-center justify-center text-white shadow-inner shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-md">
                      <ClipboardList className="w-6 h-6 stroke-[2] transition-transform duration-300 group-hover:rotate-3" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#4F2D1C]/10 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C]">
                      {metrics.pendingOrders} Pending
                    </span>
                  </div>
                </div>

                {/* Card 2: Revenue */}
                <div className="group bg-[#FCFAF6] rounded-2xl p-5 border border-[#4F2D1C]/10 shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06),inset_0_2px_4px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(79,45,28,0.14)] hover:-translate-y-1.5 hover:border-[#4F2D1C]/25 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#4F2D1C]/70">
                        Total Order Value
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#4F2D1C] mt-1 tracking-tight">
                        {metrics.totalRevenue.toLocaleString()}
                        <span className="text-sm font-semibold text-[#4F2D1C]/70 ml-1.5">
                          ETB
                        </span>
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#4F2D1C] flex items-center justify-center text-white shadow-inner shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-md">
                      <Banknote className="w-6 h-6 stroke-[2] transition-transform duration-300 group-hover:rotate-3" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#4F2D1C]/10 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C]">
                      Gross Pipeline
                    </span>
                  </div>
                </div>

                {/* Card 3: Products */}
                <div className="group bg-[#FCFAF6] rounded-2xl p-5 border border-[#4F2D1C]/10 shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06),inset_0_2px_4px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(79,45,28,0.14)] hover:-translate-y-1.5 hover:border-[#4F2D1C]/25 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#4F2D1C]/70">
                        Catalog Products
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#4F2D1C] mt-1 tracking-tight">
                        {metrics.productsCount}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#4F2D1C] flex items-center justify-center text-white shadow-inner shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-md">
                      <Package className="w-6 h-6 stroke-[2] transition-transform duration-300 group-hover:rotate-3" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#4F2D1C]/10 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C]">
                      Active Catalog
                    </span>
                  </div>
                </div>

                {/* Card 4: Categories */}
                <div className="group bg-[#FCFAF6] rounded-2xl p-5 border border-[#4F2D1C]/10 shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06),inset_0_2px_4px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_0_rgba(79,45,28,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(79,45,28,0.14)] hover:-translate-y-1.5 hover:border-[#4F2D1C]/25 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#4F2D1C]/70">
                        Sell Categories
                      </p>
                      <h3 className="text-3xl font-extrabold text-[#4F2D1C] mt-1 tracking-tight">
                        {metrics.categoriesCount}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#4F2D1C] flex items-center justify-center text-white shadow-inner shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-md">
                      <Layers className="w-6 h-6 stroke-[2] transition-transform duration-300 group-hover:rotate-3" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#4F2D1C]/10 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C]">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#4F2D1C]/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-serif font-bold text-[#4F2D1C]">
                    Recent Salon Product Orders
                  </h2>
                  <button
                    type="button"
                    onClick={navigateToSalonOrders}
                    className="text-xs font-bold text-[#4F2D1C] hover:text-[#4F2D1C]/80 hover:underline flex items-center gap-1.5 cursor-pointer group"
                    title="Go to Salon Orders page"
                  >
                    <span>View All Orders</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-[#4F2D1C]/60 text-xs">
                    No orders have been submitted yet. Direct customer orders will appear here dynamically.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#4F2D1C]/10 text-[#4F2D1C]/60 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3">Order #</th>
                          <th className="pb-3">Salon & Client</th>
                          <th className="pb-3">Phone</th>
                          <th className="pb-3">City</th>
                          <th className="pb-3">Total Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4F2D1C]/5">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#FAF6F0]/50 transition">
                            <td className="py-3 font-bold text-[#4F2D1C]">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3">
                              <p className="font-bold text-[#4F2D1C]">{ord.salonName}</p>
                              <p className="text-[10px] text-[#4F2D1C]/60">{ord.contactPerson}</p>
                            </td>
                            <td className="py-3 font-mono">{ord.phone}</td>
                            <td className="py-3">{ord.city || "Addis Ababa"}</td>
                            <td className="py-3 font-bold text-[#4F2D1C]">
                              {ord.totalAmount?.toLocaleString()} ETB
                            </td>
                            <td className="py-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FAF6F0] border border-[#4F2D1C]/15 ${
                                  ord.status === "CONFIRMED" || ord.status === "PAYMENT_APPROVED" || ord.status === "COMPLETED" || ord.status === "DELIVERED"
                                    ? "text-emerald-700"
                                    : ord.status === "IN_PROGRESS" || ord.status === "STOCK_REVIEW" || ord.status === "CONTACTED"
                                    ? "text-amber-800"
                                    : ord.status === "CANCELLED" || ord.status === "REJECTED"
                                    ? "text-rose-700"
                                    : "text-blue-700"
                                }`}
                              >
                                {ord.status === "CONFIRMED" || ord.status === "PAYMENT_APPROVED" || ord.status === "COMPLETED" || ord.status === "DELIVERED"
                                  ? "Confirmed"
                                  : ord.status === "IN_PROGRESS" || ord.status === "STOCK_REVIEW" || ord.status === "CONTACTED"
                                  ? "In Review"
                                  : ord.status === "CANCELLED" || ord.status === "REJECTED"
                                  ? "Cancelled"
                                  : "Pending"}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setActiveTab("orders");
                                  setOrderSearch(ord.orderNumber);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#4F2D1C]/10 text-[#4F2D1C] font-bold text-[11px] transition cursor-pointer"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ===================== UNIFIED TAB: PRODUCT CATALOG & CATEGORIES ===================== */}
        {(activeTab === "products" || activeTab === "categories") && (
          <>
            {/* Mobile View (Phones & Small Viewports: max-w-[430px]) */}
            <div className="block md:hidden max-w-[430px] mx-auto space-y-4 animate-in fade-in duration-200">
              {/* Simple Page Header */}
              <div>
                <h2 className="text-lg font-serif font-black text-[#4F2D1C] tracking-tight">
                  Manage your product and category
                </h2>
              </div>

              {/* Capsule Sub-View Switcher: Categories (3) | Products (8) */}
              <div className="bg-[#FAF6F0] p-1.5 rounded-full border border-[#4F2D1C]/15 grid grid-cols-2 gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setCatalogSubView("categories")}
                  className={`py-2 px-3 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    catalogSubView === "categories"
                      ? "bg-[#4F2D1C] text-[#FFFFFF] shadow-sm"
                      : "text-[#4F2D1C] hover:bg-[#4F2D1C]/5"
                  }`}
                >
                  Categories ({categories.length})
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogSubView("products")}
                  className={`py-2 px-3 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    catalogSubView === "products"
                      ? "bg-[#4F2D1C] text-[#FFFFFF] shadow-sm"
                      : "text-[#4F2D1C] hover:bg-[#4F2D1C]/5"
                  }`}
                >
                  Products ({products.length})
                </button>
              </div>

              {/* Sub-View 1: Categories */}
              {catalogSubView === "categories" && (
                <div className="space-y-3.5 pt-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#4F2D1C]/[0.08] shadow-[0_10px_24px_-6px_rgba(79,45,28,0.08)]"
                    >
                      {/* Category Cover Image + Top-Right Item Count Pill */}
                      <div className="relative h-44 w-full bg-[#FAF6F0]">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#FFFFFF]/95 backdrop-blur-xs text-[#4F2D1C] text-[11px] font-extrabold shadow-sm">
                          {cat.itemCount || 0} Products
                        </span>
                      </div>

                      {/* Category Footer: Title + Slug on Left, Claymorphic Edit & Trash Buttons on Right */}
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-extrabold text-[#4F2D1C] truncate">
                            {cat.name}
                          </h3>
                          {cat.slug?.trim() && (
                            <p className="font-mono text-xs text-[#4F2D1C]/55 mt-0.5 truncate">
                              slug: /{cat.slug}
                            </p>
                          )}
                        </div>

                        {/* Claymorphic Circular Edit & Delete Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cat)}
                            aria-label={`Edit ${cat.name}`}
                            className="w-10 h-10 rounded-full bg-[#FCFAF6] text-[#4F2D1C] border border-[#4F2D1C]/10 shadow-[0_6px_14px_-2px_rgba(79,45,28,0.14),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(79,45,28,0.10)] active:scale-95 flex items-center justify-center transition-transform cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 stroke-[2]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            aria-label={`Delete ${cat.name}`}
                            className="w-10 h-10 rounded-full bg-[#FCFAF6] text-[#DC2626] border border-[#DC2626]/15 shadow-[0_6px_14px_-2px_rgba(220,38,38,0.12),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(220,38,38,0.12)] active:scale-95 flex items-center justify-center transition-transform cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-View 2: Products */}
              {catalogSubView === "products" && (
                <div className="space-y-4">
                  {/* Search & Filter Panel Card */}
                  <div className="bg-[#FFFFFF] rounded-3xl p-3.5 border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06)] space-y-3">
                    {/* Expandable Product Search Bar on Mobile */}
                    {(isProductSearchOpen || productSearch) && (
                      <div className="relative animate-in fade-in duration-150">
                        <Search className="w-4 h-4 text-[#4F2D1C]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          autoFocus
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search products by title, SKU, or keyword..."
                          className="w-full h-10 pl-10 pr-9 rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/10 text-xs text-[#2D1C14] placeholder:text-[#4F2D1C]/45 focus:outline-none focus:border-[#4F2D1C]/30 shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProductSearch("");
                            setIsProductSearchOpen(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Compact Filter Controls (No horizontal scroll) */}
                    <div className="space-y-2">
                      {/* Category Dropdown Pill + Search Expand Button */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <select
                            value={selectedProductCategory}
                            onChange={(e) => setSelectedProductCategory(e.target.value)}
                            className="w-full h-9 pl-3 pr-8 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/10 text-xs font-bold text-[#4F2D1C] appearance-none focus:outline-none cursor-pointer"
                          >
                            <option value="All">All Categories</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-[#4F2D1C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {!isProductSearchOpen && !productSearch && (
                          <button
                            type="button"
                            onClick={() => setIsProductSearchOpen(true)}
                            aria-label="Expand product search"
                            className="w-9 h-9 shrink-0 rounded-xl bg-[#FAF6F0] hover:bg-[#FAF6F0]/80 border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] active:scale-95 transition-transform cursor-pointer shadow-xs"
                          >
                            <Search className="w-4 h-4 stroke-[2]" />
                          </button>
                        )}
                      </div>

                      {/* Full-Width 3-Column Stock Segmented Switcher */}
                      <div className="grid grid-cols-3 gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#4F2D1C]/10 w-full">
                        {(["All", "In Stock", "Out of Stock"] as const).map(
                          (status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setProductStockFilter(status)}
                              className={`py-1.5 px-1 rounded-lg text-[11px] font-extrabold text-center transition-all cursor-pointer ${
                                productStockFilter === status
                                  ? "bg-[#4F2D1C] text-[#FFFFFF] shadow-2xs"
                                  : "text-[#4F2D1C]/75 hover:text-[#4F2D1C]"
                              }`}
                            >
                              {status}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Cards Feed */}
                  {filteredProducts.length === 0 ? (
                    <div className="bg-[#FFFFFF] rounded-3xl p-8 text-center text-[#4F2D1C]/60 border border-[#4F2D1C]/10 shadow-xs">
                      <Package className="w-8 h-8 mx-auto text-[#4F2D1C]/30 mb-2" />
                      <p className="font-bold text-xs text-[#4F2D1C]">No products matching your search filter.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3.5">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#4F2D1C]/[0.08] shadow-[0_10px_24px_-6px_rgba(79,45,28,0.07)] flex flex-col"
                        >
                          {/* Clean Product Image Canvas */}
                          <div
                            onClick={() => handleOpenEditProduct(product)}
                            className="relative h-48 w-full bg-[#FAF6F0] cursor-pointer"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src =
                                  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                          </div>

                          {/* Card Body: Product Title + Monospace ETB Price + Claymorphic Action Row */}
                          <div className="p-4 space-y-3">
                            <div>
                              <h3
                                onClick={() => handleOpenEditProduct(product)}
                                className="text-[15px] font-extrabold text-[#4F2D1C] leading-snug line-clamp-2 cursor-pointer hover:text-[#2D1C14]"
                              >
                                {product.name}
                              </h3>
                              <p className="font-mono text-sm font-extrabold text-[#4F2D1C] mt-1.5">
                                {product.price ? `${Number(product.price).toLocaleString()} ETB` : "—"}
                              </p>
                            </div>

                            {/* Claymorphic Action Row: Wide "Quick Edit" Capsule + Circular Red Trash Button */}
                            <div className="pt-1 flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(product)}
                                className="flex-1 h-10 px-4 rounded-full bg-[#FCFAF6] text-[#4F2D1C] text-xs font-extrabold border border-[#4F2D1C]/10 shadow-[0_8px_20px_-3px_rgba(79,45,28,0.14),0_3px_6px_-1px_rgba(79,45,28,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(79,45,28,0.12)] active:scale-[0.98] flex items-center justify-center gap-2 transition-transform cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 stroke-[2.2]" />
                                <span>Quick Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                aria-label={`Delete ${product.name}`}
                                className="w-10 h-10 rounded-full bg-[#FCFAF6] text-[#DC2626] border border-[#DC2626]/15 shadow-[0_8px_20px_-3px_rgba(220,38,38,0.14),0_3px_6px_-1px_rgba(220,38,38,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(220,38,38,0.12)] active:scale-95 flex items-center justify-center shrink-0 transition-transform cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 stroke-[2]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop View (Tablets & Desktop Screens: hidden md:block) */}
            <div className="hidden md:block animate-in fade-in duration-200">
              {/* Header Controls - Sticky Claymorphic Card with minimal gap to top nav bar */}
              <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 pt-1.5 pb-1 bg-[#FAF6F0] z-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF6F0] py-2.5 px-5 sm:py-3 sm:px-6 rounded-2xl sm:rounded-3xl border border-[#4F2D1C]/15 shadow-[0_10px_25px_-5px_rgba(79,45,28,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,45,28,0.05)]">
                  <div>
                    <h1 className="text-base sm:text-lg font-serif font-bold text-[#4F2D1C] tracking-tight">
                      Product Catalog & Categories
                    </h1>
                  </div>

                  <div className="flex flex-row items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenAddCategory}
                      className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#4F2D1C] border border-[#4F2D1C]/15 text-xs font-bold transition shadow-xs cursor-pointer active:scale-[0.98]"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#4F2D1C]" />
                      <span>New Category</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddProduct}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_20px_rgba(79,45,28,0.32)] active:scale-[0.98] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                      <span>Add New Product</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-view Capsule Switcher */}
              <div className="mt-2 mb-4 w-full sm:w-fit grid grid-cols-2 sm:inline-flex items-center gap-1.5 p-1.5 bg-[#FAF6F0] rounded-2xl border border-[#4F2D1C]/15 shadow-xs">
              <button
                type="button"
                onClick={() => setCatalogSubView("categories")}
                className={`py-2.5 sm:py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center truncate cursor-pointer ${
                  catalogSubView === "categories"
                    ? "bg-[#4F2D1C] text-white shadow-sm"
                    : "text-[#4F2D1C] hover:bg-black/5"
                }`}
              >
                Categories ({categories.length})
              </button>
              <button
                type="button"
                onClick={() => setCatalogSubView("products")}
                className={`py-2.5 sm:py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center truncate cursor-pointer ${
                  catalogSubView === "products"
                    ? "bg-[#4F2D1C] text-white shadow-sm"
                    : "text-[#4F2D1C] hover:bg-black/5"
                }`}
              >
                Products ({products.length})
              </button>
            </div>

            {catalogSubView === "products" ? (
              <div className="space-y-4">

            {/* Search & Filter Bar Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-[#4F2D1C]/10 space-y-3">
              {/* Row 1: Full-width search bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#4F2D1C]/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title, SKU, or keyword..."
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-[#FAF6F0] border border-[#4F2D1C]/10 rounded-2xl text-xs sm:text-sm text-[#4F2D1C] placeholder-[#4F2D1C]/50 focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                />
              </div>

              {/* Row 2: Category Dropdown & Stock Filter (Horizontally scrollable on mobile) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                <div className="relative inline-block shrink-0">
                  <select
                    value={selectedProductCategory}
                    onChange={(e) => setSelectedProductCategory(e.target.value)}
                    className="appearance-none pl-3.5 pr-8 py-2 bg-[#FAF6F0] border border-[#4F2D1C]/10 rounded-xl text-xs font-bold text-[#4F2D1C] focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#4F2D1C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="inline-flex items-center p-1 bg-[#FAF6F0] border border-[#4F2D1C]/10 rounded-xl text-xs font-bold gap-1 shrink-0">
                  {(["All", "In Stock", "Out of Stock"] as const).map((filterOption) => (
                    <button
                      key={filterOption}
                      type="button"
                      onClick={() => setProductStockFilter(filterOption)}
                      className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                        productStockFilter === filterOption
                          ? "bg-[#4F2D1C] text-white shadow-xs"
                          : "text-[#4F2D1C] hover:bg-black/5"
                      }`}
                    >
                      {filterOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-[#4F2D1C]/60 border border-[#4F2D1C]/10 shadow-xs">
                <Package className="w-10 h-10 mx-auto text-[#4F2D1C]/30 mb-3" />
                <p className="font-bold text-[#4F2D1C]">No products matching your search filter.</p>
                <p className="text-xs text-[#4F2D1C]/60 mt-1">Try adjusting your search terms or category/stock filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#4F2D1C]/10 hover:shadow-md transition flex flex-col justify-between group"
                  >
                    {/* Compact Image Canvas */}
                    <div
                      onClick={() => handleOpenEditProduct(prod)}
                      className="h-44 relative bg-[#FAF6F0] overflow-hidden rounded-t-2xl cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Body: Name and Price only */}
                    <div className="p-4 space-y-3">
                      <div>
                        {/* Title */}
                        <h3
                          onClick={() => handleOpenEditProduct(prod)}
                          className="font-serif font-bold text-[15px] sm:text-base leading-snug text-[#4F2D1C] line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-[#2D1C14]"
                          title={prod.name}
                        >
                          {prod.name}
                        </h3>

                        {/* Price & Rating */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-base font-bold text-[#4F2D1C] font-mono">
                            {prod.price ? `${Number(prod.price).toLocaleString()} ETB` : "—"}
                          </span>
                          <div className="flex items-center gap-1" title={`Product Rating: ${Number(prod.rating || 5).toFixed(1)} / 5.0`}>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-[#4F2D1C]">
                              {Number(prod.rating || 5).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Claymorphic Action Buttons Row */}
                      <div className="flex items-center gap-2.5 pt-1">
                        {/* Quick Edit Claymorphic Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(prod)}
                          className="flex-1 py-2.5 px-4 bg-white border border-[#4F2D1C]/10 hover:border-[rgb(194,182,176)] rounded-full flex items-center justify-center gap-2 text-xs font-bold text-[#4F2D1C] shadow-[0_8px_20px_-3px_rgba(79,45,28,0.14),0_3px_6px_-1px_rgba(79,45,28,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(79,45,28,0.12)] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#4F2D1C]" />
                          <span>Quick Edit</span>
                        </button>

                        {/* Delete Claymorphic Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          title="Delete Product"
                          className="w-10 h-10 shrink-0 bg-white border border-[#4F2D1C]/10 hover:border-[rgb(194,182,176)] rounded-2xl flex items-center justify-center text-red-600 shadow-[0_8px_20px_-3px_rgba(79,45,28,0.14),0_3px_6px_-1px_rgba(79,45,28,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(220,38,38,0.12)] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Sub-view Content: Categories */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#4F2D1C]/5 flex flex-col justify-between"
                >
                  <div className="h-40 relative bg-[#FAF6F0] overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#4F2D1C] shadow-xs">
                      {cat.itemCount || 0} Products
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#4F2D1C]">
                        {cat.name}
                      </h3>
                      {cat.slug?.trim() && (
                        <p className="text-[11px] font-mono text-[#4F2D1C]/60">
                          slug: /{cat.slug}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="w-9.5 h-9.5 shrink-0 bg-white border border-[#4F2D1C]/10 hover:border-[rgb(194,182,176)] rounded-2xl flex items-center justify-center text-[#4F2D1C] shadow-[0_8px_20px_-3px_rgba(79,45,28,0.14),0_3px_6px_-1px_rgba(79,45,28,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(79,45,28,0.12)] transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="w-9.5 h-9.5 shrink-0 bg-white border border-[#4F2D1C]/10 hover:border-[rgb(194,182,176)] rounded-2xl flex items-center justify-center text-red-600 shadow-[0_8px_20px_-3px_rgba(79,45,28,0.14),0_3px_6px_-1px_rgba(79,45,28,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_5px_rgba(220,38,38,0.12)] transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )}

        {/* ===================== TAB 4: ORDERS ===================== */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-200 w-full max-w-full">
            {/* Header Controls - Fixed Card on Mobile, Compact Card on Desktop */}
            <div className="sticky -top-3 pt-1 pb-1 z-30 md:static md:p-0 bg-[#FAF6F0] mb-3 sm:mb-4">
              <div className="w-full md:w-fit bg-[#FAF6F0] py-2 px-3 sm:py-2 sm:px-3 rounded-2xl border border-[#4F2D1C]/15 shadow-[0_8px_20px_-4px_rgba(79,45,28,0.09),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,45,28,0.05)] flex items-center gap-2 sm:gap-2.5">
                {/* 2 Filter Buttons Dropdowns (Side-by-Side on mobile, inline on desktop) */}
                <div className="grid grid-cols-2 md:flex md:items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0">
                  {/* 1. Status Filter Dropdown */}
                  <div className="relative" ref={statusFilterRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsStatusFilterOpen((prev) => !prev);
                        setIsTimeFilterOpen(false);
                      }}
                      className="w-full md:w-auto h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#4F2D1C]/15 flex items-center justify-between md:justify-center gap-1.5 sm:gap-2 text-xs font-bold text-[#4F2D1C] shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span className="text-[10px] uppercase font-bold text-[#4F2D1C]/55 tracking-wider hidden sm:inline">Status:</span>
                      <span className="font-extrabold truncate text-xs">{currentStatusLabel}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#4F2D1C]/70 shrink-0 transition-transform duration-150 ${isStatusFilterOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isStatusFilterOpen && (
                      <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/15 shadow-[0_12px_28px_-4px_rgba(79,45,28,0.16),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,45,28,0.06)] p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                        {[
                          { id: "All", label: "All Statuses", color: "text-[#4F2D1C]" },
                          { id: "NEW_ORDER", label: "Pending", color: "text-blue-700" },
                          { id: "IN_PROGRESS", label: "In Review", color: "text-amber-800" },
                          { id: "CONFIRMED", label: "Confirmed", color: "text-emerald-700" },
                          { id: "CANCELLED", label: "Cancelled", color: "text-rose-700" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setOrderStatusFilter(opt.id);
                              setIsStatusFilterOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                              orderStatusFilter === opt.id
                                ? "bg-white text-[#4F2D1C] shadow-[0_2px_6px_rgba(79,45,28,0.08),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10"
                                : "hover:bg-white/60 text-[#4F2D1C]/80"
                            }`}
                          >
                            <span className={opt.color}>{opt.label}</span>
                            {orderStatusFilter === opt.id && (
                              <Check className="w-3.5 h-3.5 text-[#4F2D1C]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Period Filter Dropdown */}
                  <div className="relative" ref={timeFilterRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimeFilterOpen((prev) => !prev);
                        setIsStatusFilterOpen(false);
                      }}
                      className="w-full md:w-auto h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#4F2D1C]/15 flex items-center justify-between md:justify-center gap-1.5 sm:gap-2 text-xs font-bold text-[#4F2D1C] shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span className="text-[10px] uppercase font-bold text-[#4F2D1C]/55 tracking-wider hidden sm:inline">Period:</span>
                      <span className="font-extrabold truncate text-xs">{currentTimeLabel}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#4F2D1C]/70 shrink-0 transition-transform duration-150 ${isTimeFilterOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isTimeFilterOpen && (
                      <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/15 shadow-[0_12px_28px_-4px_rgba(79,45,28,0.16),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,45,28,0.06)] p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                        {[
                          { id: "all", label: "All Orders" },
                          { id: "24h", label: "Last 24 Hours" },
                          { id: "week", label: "This Week" },
                          { id: "month", label: "This Month" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setOrderTimeFilter(opt.id as any);
                              setIsTimeFilterOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                              orderTimeFilter === opt.id
                                ? "bg-white text-[#4F2D1C] shadow-[0_2px_6px_rgba(79,45,28,0.08),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(79,45,28,0.04)] border border-[#4F2D1C]/10"
                                : "hover:bg-white/60 text-[#4F2D1C]/80"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {orderTimeFilter === opt.id && (
                              <Check className="w-3.5 h-3.5 text-[#4F2D1C]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="mt-2">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-[#4F2D1C]/60 text-xs shadow-xs border border-[#4F2D1C]/5">
                  No orders found under this filter.
                </div>
              ) : (
                <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-5 shadow-xs border border-[#4F2D1C]/5 space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#4F2D1C]/5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#4F2D1C] bg-[#FAF6F0] px-3 py-1 rounded-lg">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-[#4F2D1C]/60">
                          {new Date(ord.createdAt).toLocaleDateString()} at{" "}
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Custom Status Tabdown Card (No Browser Select, No 1 2 3 Numbers) */}
                      <div className="flex items-center gap-2" data-order-status-popover>
                        <span className="text-[11px] font-bold text-[#4F2D1C]/60">Status:</span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveOrderActionId(activeOrderActionId === ord.id ? null : ord.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#FAF6F0] hover:bg-[#FAF6F0]/90 border border-[#4F2D1C]/15 shadow-2xs transition cursor-pointer ${
                              ord.status === "CONFIRMED" || ord.status === "PAYMENT_APPROVED" || ord.status === "COMPLETED" || ord.status === "DELIVERED"
                                ? "text-emerald-700"
                                : ord.status === "IN_PROGRESS" || ord.status === "STOCK_REVIEW" || ord.status === "CONTACTED"
                                ? "text-amber-800"
                                : ord.status === "CANCELLED" || ord.status === "REJECTED"
                                ? "text-rose-700"
                                : "text-blue-700"
                            }`}
                          >
                            <span>
                              {ord.status === "CONFIRMED" || ord.status === "PAYMENT_APPROVED" || ord.status === "COMPLETED" || ord.status === "DELIVERED"
                                ? "Confirmed"
                                : ord.status === "IN_PROGRESS" || ord.status === "STOCK_REVIEW" || ord.status === "CONTACTED"
                                ? "In Review"
                                : ord.status === "CANCELLED" || ord.status === "REJECTED"
                                ? "Cancelled"
                                : "Pending"}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${activeOrderActionId === ord.id ? "rotate-180" : ""}`} />
                          </button>

                          {activeOrderActionId === ord.id && (
                            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/15 shadow-[0_12px_30px_rgba(45,28,20,0.18)] p-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                              {[
                                { value: "NEW_ORDER", label: "Pending", color: "text-blue-700" },
                                { value: "IN_PROGRESS", label: "In Review", color: "text-amber-800" },
                                { value: "CONFIRMED", label: "Confirmed", color: "text-emerald-700" },
                                { value: "CANCELLED", label: "Cancelled", color: "text-rose-700" },
                              ].map((item) => (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => {
                                    setActiveOrderActionId(null);
                                    handleUpdateOrderStatus(ord.id, item.value);
                                  }}
                                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold hover:bg-white text-left transition cursor-pointer"
                                >
                                  <span className={item.color}>{item.label}</span>
                                  {((item.value === "CONFIRMED" && (ord.status === "CONFIRMED" || ord.status === "PAYMENT_APPROVED" || ord.status === "COMPLETED" || ord.status === "DELIVERED")) ||
                                    (item.value === "IN_PROGRESS" && (ord.status === "IN_PROGRESS" || ord.status === "STOCK_REVIEW" || ord.status === "CONTACTED")) ||
                                    (item.value === "CANCELLED" && (ord.status === "CANCELLED" || ord.status === "REJECTED")) ||
                                    (item.value === "NEW_ORDER" && (ord.status === "NEW_ORDER" || ord.status === "PENDING_VERIFICATION" || ord.status === "PENDING"))) && (
                                    <Check className="w-3.5 h-3.5 text-[#4F2D1C]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Salon Client & Location Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF6F0]/60 p-3.5 rounded-xl text-xs">
                      <div className="flex items-start gap-2.5">
                        <Building className="w-4 h-4 text-[#4F2D1C]/60 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#4F2D1C]">{ord.salonName}</p>
                          <p className="text-[11px] text-[#4F2D1C]/70">Contact: {ord.contactPerson}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Phone className="w-4 h-4 text-[#4F2D1C]/60 shrink-0 mt-0.5" />
                        <div>
                          <a
                            href={`tel:${ord.phone}`}
                            className="font-bold text-[#4F2D1C] hover:underline"
                          >
                            {ord.phone}
                          </a>
                          <p className="text-[10px] text-[#4F2D1C]/70 font-semibold">
                            Direct Salon Contact
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#4F2D1C]/60 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#4F2D1C]">{ord.city || "Addis Ababa"}</p>
                          <p className="text-[11px] text-[#4F2D1C]/70 line-clamp-1">{ord.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-[#4F2D1C]/60 uppercase tracking-wider">
                        Requested Products:
                      </p>
                      <div className="divide-y divide-[#4F2D1C]/5">
                        {ord.items?.map((item: any) => (
                          <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              {item.product?.image && (
                                <img
                                  src={item.product.image}
                                  alt={item.product?.name || "Product"}
                                  className="w-8 h-8 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <span className="font-bold text-[#4F2D1C]">
                                  {item.product?.name || "Product"}
                                </span>
                                <span className="text-[11px] text-[#4F2D1C]/60 ml-2">
                                  × {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-[#4F2D1C]">
                              {(item.price * item.quantity).toLocaleString()} ETB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Summary */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#4F2D1C]/5">
                      <span className="text-xs font-bold text-[#4F2D1C]/70">
                        Total Order Amount:
                      </span>
                      <span className="text-base font-serif font-black text-[#4F2D1C]">
                        {ord.totalAmount?.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: PROFILE & SECURITY ===================== */}
        {activeTab === "profile" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-black text-[#4F2D1C]">
                Administrator Account &amp; Branding Settings
              </h1>
              <p className="text-xs text-[#4F2D1C]/70 mt-0.5">
                Manage your administrative profile details, website brand logo, and security password in one view.
              </p>
            </div>

            {/* Side-by-Side 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* Column 1: Profile Info Form */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#4F2D1C]/5 space-y-4">
                <h2 className="text-sm sm:text-base font-serif font-bold text-[#4F2D1C] flex items-center gap-2 pb-2 border-b border-[#4F2D1C]/10">
                  <UserCheck className="w-4 h-4 text-[#4F2D1C]" />
                  <span>Admin Profile Information</span>
                </h2>

                <form id="profile-info-form" onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                  {/* Admin Avatar Picture Upload */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full bg-[#4F2D1C] text-[#FAF6F0] flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 shadow-md ring-2 ring-[#4F2D1C]/20">
                      {profileForm.avatar ? (
                        <img
                          src={profileForm.avatar}
                          alt={profileForm.fullName || "Admin Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.fullName || "Admin Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {profileForm.fullName
                            ? profileForm.fullName.slice(0, 2).toUpperCase()
                            : "AD"}
                        </span>
                      )}
                      {uploadingImage === "avatar" && (
                        <div className="absolute inset-0 bg-[#4F2D1C]/75 flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-[#FAF6F0] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <p className="font-bold text-[#4F2D1C] text-xs">Admin Profile Photo</p>
                      <p className="text-[10px] text-[#4F2D1C]/60 mt-0.5">
                        Upload your photo to replace initials across the admin portal &amp; top operations bar.
                      </p>

                      <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] text-[11px] font-bold cursor-pointer transition shadow-xs">
                          <Camera className="w-3.5 h-3.5 text-[#FAF6F0]" />
                          <span>
                            {uploadingImage === "avatar"
                              ? "Uploading..."
                              : profileForm.avatar
                              ? "Change Photo"
                              : "Upload Photo"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage === "avatar"}
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>

                        {profileForm.avatar && (
                          <button
                            type="button"
                            onClick={() => setProfileForm((prev) => ({ ...prev, avatar: "" }))}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#4F2D1C]/15 hover:bg-red-50 hover:text-red-600 text-[#4F2D1C]/70 text-[11px] font-bold transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      placeholder="+251 9..."
                    />
                  </div>
                </form>

                <div className="pt-2 border-t border-[#4F2D1C]/10">
                  <button
                    type="submit"
                    form="profile-info-form"
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] font-bold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5 text-[#FAF6F0]" />
                    <span>{actionLoading ? "Saving..." : "Save Profile Changes"}</span>
                  </button>
                </div>
              </div>

              {/* Column 2: Website Logo Card + Change Password Card */}
              <div className="space-y-5">
                {/* Website Brand Logo Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#4F2D1C]/5 space-y-3.5">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-[#4F2D1C] flex items-center gap-2 pb-2 border-b border-[#4F2D1C]/10">
                    <Sparkles className="w-4 h-4 text-[#4F2D1C]" />
                    <span>Website Brand Logo</span>
                  </h2>

                  <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full bg-white border border-[#4F2D1C]/10 shadow-md ring-2 ring-[#4F2D1C]/20 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={cmsForm.brandLogoImage || welcomeSettings?.brandLogoImage || "/yolanda-logo.jpg"}
                        alt="Website Brand Logo"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as any).src = "/yolanda-logo.jpg";
                        }}
                      />
                      {uploadingImage === "logo" && (
                        <div className="absolute inset-0 bg-[#1C120C]/80 flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-[#FAF6F0] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <p className="font-bold text-[#4F2D1C] text-xs">Official Storefront Logo</p>

                      <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] text-[11px] font-bold cursor-pointer transition shadow-xs">
                          <UploadCloud className="w-3.5 h-3.5 text-[#FAF6F0]" />
                          <span>
                            {uploadingImage === "logo" ? "Uploading to Cloud..." : "Change Logo"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage === "logo"}
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>

                        {cmsForm.brandLogoImage && cmsForm.brandLogoImage !== "/yolanda-logo.jpg" && (
                          <button
                            type="button"
                            onClick={async () => {
                              setCmsForm((prev: any) => ({ ...prev, brandLogoImage: "/yolanda-logo.jpg" }));
                              await updateWelcomeSettings({ brandLogoImage: "/yolanda-logo.jpg" });
                              showNotification("success", "Logo reset to default Yolanda logo.");
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#4F2D1C]/15 hover:bg-[#FAF6F0] text-[#4F2D1C]/70 text-[11px] font-bold transition cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Default</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change Password Card - Fits texts with NO blank space */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#4F2D1C]/5 space-y-3.5">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-[#4F2D1C] flex items-center gap-2 pb-2 border-b border-[#4F2D1C]/10">
                    <Lock className="w-4 h-4 text-[#4F2D1C]" />
                    <span>Change Password &amp; Security</span>
                  </h2>

                  <form id="password-change-form" onSubmit={handleChangePassword} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                        placeholder="Enter existing password"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#4F2D1C] mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="At least 6 chars"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#4F2D1C] mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="Repeat password"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#4F2D1C]/10">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] font-bold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#FAF6F0]" />
                        <span>{actionLoading ? "Updating..." : "Update Password"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: WELCOME PAGE CMS ===================== */}
        {activeTab === "welcome_cms" && (
          <>
            {/* Mobile View (Phones & Small Viewports: max-w-[430px]) */}
            <div className="block md:hidden max-w-[430px] mx-auto space-y-3.5 animate-in fade-in duration-200">
              {/* 5 COLLAPSIBLE CMS SECTIONS (1 to 5) */}
              <div className="space-y-3.5">
                {/* SECTION 1: Main Hero Banner & Brand Identity */}
                <section className="bg-[#FFFFFF] rounded-3xl border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenWelcomeSection(openWelcomeSection === 1 ? null : 1)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#4F2D1C] truncate">
                          1. Main Hero Banner &amp; Brand Identity
                        </h3>
                        <p className="text-[11px] text-[#4F2D1C]/60 truncate">
                          Headlines, brand title, and hero background images
                        </p>
                      </div>
                    </div>
                    {openWelcomeSection === 1 ? (
                      <ChevronUp className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    )}
                  </button>

                  {openWelcomeSection === 1 && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#4F2D1C]/[0.08] space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Brand Name (Top Left &amp; Badges)
                        </label>
                        <input
                          type="text"
                          value={cmsForm.brandName || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, brandName: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Brand Subtitle (e.g. Salon &amp; Makeup Products)
                        </label>
                        <input
                          type="text"
                          value={cmsForm.brandSubtitle || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, brandSubtitle: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                            Hero Headline - Line 1
                          </label>
                          <input
                            type="text"
                            value={cmsForm.heroTitleLine1 || ""}
                            onChange={(e) => setCmsForm({ ...cmsForm, heroTitleLine1: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                            Hero Headline - Line 2 (Italic Accent)
                          </label>
                          <input
                            type="text"
                            value={cmsForm.heroTitleLine2 || ""}
                            onChange={(e) => setCmsForm({ ...cmsForm, heroTitleLine2: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-serif italic font-semibold text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Hero Subtitle / Description
                        </label>
                        <textarea
                          rows={2}
                          value={cmsForm.heroSubtitle || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, heroSubtitle: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Badge Text (Top Right of Hero)
                        </label>
                        <input
                          type="text"
                          value={cmsForm.heroBadge || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, heroBadge: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono font-bold text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Mobile Welcome Subtitle (Under Portrait)
                        </label>
                        <input
                          type="text"
                          value={cmsForm.heroMotto || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, heroMotto: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                        />
                      </div>

                      {/* Desktop & Mobile Hero Image Inputs */}
                      <div className="space-y-2.5 pt-1">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-[#4F2D1C]">
                              Desktop Hero Background Image
                            </label>
                            <label className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4F2D1C] bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#4F2D1C]/15 cursor-pointer">
                              <UploadCloud className="w-3 h-3" />
                              <span>{uploadingImage === "heroBgImage" ? "Uploading..." : "Upload from device"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingImage === "heroBgImage"}
                                onChange={(e) => handleHeroBgUpload(e, "heroBgImage")}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={cmsForm.heroBgImage || ""}
                            onChange={(e) => setCmsForm({ ...cmsForm, heroBgImage: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-[11px] font-mono text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-[#4F2D1C]">
                              Mobile Hero Background Image
                            </label>
                            <label className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4F2D1C] bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#4F2D1C]/15 cursor-pointer">
                              <UploadCloud className="w-3 h-3" />
                              <span>{uploadingImage === "mobileHeroBgImage" ? "Uploading..." : "Upload from device"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingImage === "mobileHeroBgImage"}
                                onChange={(e) => handleHeroBgUpload(e, "mobileHeroBgImage")}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={cmsForm.mobileHeroBgImage || ""}
                            onChange={(e) => setCmsForm({ ...cmsForm, mobileHeroBgImage: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-[11px] font-mono text-[#2D1C14] focus:outline-none focus:border-[#4F2D1C]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* SECTION 2: Pillars of Trust ("Why Top Salons Trust Yolanda") */}
                <section className="bg-[#FFFFFF] rounded-3xl border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenWelcomeSection(openWelcomeSection === 2 ? null : 2)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#4F2D1C] truncate">
                          2. Pillars of Trust (&quot;Why Top Salons Trust Yolanda&quot;)
                        </h3>
                        <p className="text-[11px] text-[#4F2D1C]/60 truncate">
                          3 value proposition cards shown below the hero
                        </p>
                      </div>
                    </div>
                    {openWelcomeSection === 2 ? (
                      <ChevronUp className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    )}
                  </button>

                  {openWelcomeSection === 2 && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#4F2D1C]/[0.08] space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Section Sub-Tag
                        </label>
                        <input
                          type="text"
                          value={cmsForm.pillarSectionTag || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, pillarSectionTag: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={cmsForm.pillarSectionTitle || ""}
                            onChange={(e) => setCmsForm({ ...cmsForm, pillarSectionTitle: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                            Section Subtitle / Lead
                          </label>
                          <input
                            type="text"
                            value={cmsForm.pillarSectionSubtitle || ""}
                            onChange={(e) => setCmsForm({ ...cmsForm, pillarSectionSubtitle: e.target.value })}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                          />
                        </div>
                      </div>

                      {/* Mobile Segmented Switcher for Card #1, Card #2, Card #3 */}
                      <div className="pt-1">
                        <div className="grid grid-cols-3 gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#4F2D1C]/10">
                          {["Card #1", "Card #2", "Card #3"].map((label, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActivePillarIndex(idx)}
                              className={`py-1.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                                activePillarIndex === idx
                                  ? "bg-[#4F2D1C] text-[#FFFFFF] shadow-xs"
                                  : "text-[#4F2D1C]/70 hover:text-[#4F2D1C]"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Active Pillar Card Editor */}
                        <div className="mt-2.5 p-3.5 rounded-2xl bg-[#FAF6F0]/70 border border-[#4F2D1C]/10 space-y-2.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4F2D1C]/60">
                            {activePillarIndex === 0
                              ? "CARD #1 (LEFT)"
                              : activePillarIndex === 1
                              ? "CARD #2 (MIDDLE)"
                              : "CARD #3 (RIGHT)"}
                          </span>

                          <div>
                            <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                              Card Title
                            </label>
                            <input
                              type="text"
                              value={
                                activePillarIndex === 0
                                  ? cmsForm.pillar1Title || ""
                                  : activePillarIndex === 1
                                  ? cmsForm.pillar2Title || ""
                                  : cmsForm.pillar3Title || ""
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (activePillarIndex === 0) setCmsForm({ ...cmsForm, pillar1Title: val });
                                else if (activePillarIndex === 1) setCmsForm({ ...cmsForm, pillar2Title: val });
                                else setCmsForm({ ...cmsForm, pillar3Title: val });
                              }}
                              className="w-full h-9 px-3 rounded-xl bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs font-semibold text-[#2D1C14]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={
                                activePillarIndex === 0
                                  ? cmsForm.pillar1Desc || ""
                                  : activePillarIndex === 1
                                  ? cmsForm.pillar2Desc || ""
                                  : cmsForm.pillar3Desc || ""
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (activePillarIndex === 0) setCmsForm({ ...cmsForm, pillar1Desc: val });
                                else if (activePillarIndex === 1) setCmsForm({ ...cmsForm, pillar2Desc: val });
                                else setCmsForm({ ...cmsForm, pillar3Desc: val });
                              }}
                              className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs text-[#2D1C14]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                              Badge / Check Text
                            </label>
                            <input
                              type="text"
                              value={
                                activePillarIndex === 0
                                  ? cmsForm.pillar1Badge || ""
                                  : activePillarIndex === 1
                                  ? cmsForm.pillar2Badge || ""
                                  : cmsForm.pillar3Badge || ""
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (activePillarIndex === 0) setCmsForm({ ...cmsForm, pillar1Badge: val });
                                else if (activePillarIndex === 1) setCmsForm({ ...cmsForm, pillar2Badge: val });
                                else setCmsForm({ ...cmsForm, pillar3Badge: val });
                              }}
                              className="w-full h-9 px-3 rounded-xl bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* SECTION 3: "How It Works" 3-Step Ordering Process */}
                <section className="bg-[#FFFFFF] rounded-3xl border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenWelcomeSection(openWelcomeSection === 3 ? null : 3)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shrink-0">
                        <ListChecks className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#4F2D1C] truncate">
                          3. &quot;How It Works&quot; 3-Step Ordering Process
                        </h3>
                        <p className="text-[11px] text-[#4F2D1C]/60 truncate">
                          Customer onboarding &amp; ordering steps
                        </p>
                      </div>
                    </div>
                    {openWelcomeSection === 3 ? (
                      <ChevronUp className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    )}
                  </button>

                  {openWelcomeSection === 3 && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#4F2D1C]/[0.08] space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Process Section Title
                        </label>
                        <input
                          type="text"
                          value={cmsForm.howItWorksTitle || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, howItWorksTitle: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                        />
                      </div>

                      {/* Mobile Segmented Switcher for Step #1, Step #2, Step #3 */}
                      <div className="grid grid-cols-3 gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#4F2D1C]/10">
                        {["Step #1", "Step #2", "Step #3"].map((label, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveStepIndex(idx)}
                            className={`py-1.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                              activeStepIndex === idx
                                ? "bg-[#4F2D1C] text-[#FFFFFF] shadow-xs"
                                : "text-[#4F2D1C]/70 hover:text-[#4F2D1C]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF6F0]/70 border border-[#4F2D1C]/10 space-y-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4F2D1C]/60">
                          {activeStepIndex === 0
                            ? "STEP #1"
                            : activeStepIndex === 1
                            ? "STEP #2"
                            : "STEP #3"}
                        </span>

                        <div>
                          <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                            Step Title
                          </label>
                          <input
                            type="text"
                            value={
                              activeStepIndex === 0
                                ? cmsForm.step1Title || ""
                                : activeStepIndex === 1
                                ? cmsForm.step2Title || ""
                                : cmsForm.step3Title || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeStepIndex === 0) setCmsForm({ ...cmsForm, step1Title: val });
                              else if (activeStepIndex === 1) setCmsForm({ ...cmsForm, step2Title: val });
                              else setCmsForm({ ...cmsForm, step3Title: val });
                            }}
                            className="w-full h-9 px-3 rounded-xl bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs font-semibold text-[#2D1C14]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                            Explanation
                          </label>
                          <textarea
                            rows={2}
                            value={
                              activeStepIndex === 0
                                ? cmsForm.step1Desc || ""
                                : activeStepIndex === 1
                                ? cmsForm.step2Desc || ""
                                : cmsForm.step3Desc || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeStepIndex === 0) setCmsForm({ ...cmsForm, step1Desc: val });
                              else if (activeStepIndex === 1) setCmsForm({ ...cmsForm, step2Desc: val });
                              else setCmsForm({ ...cmsForm, step3Desc: val });
                            }}
                            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#4F2D1C]/15 text-xs text-[#2D1C14]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* SECTION 4: Showroom Contact, Location & Hours */}
                <section className="bg-[#FFFFFF] rounded-3xl border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenWelcomeSection(openWelcomeSection === 4 ? null : 4)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#4F2D1C] truncate">
                          4. Showroom Contact, Location &amp; Hours
                        </h3>
                        <p className="text-[11px] text-[#4F2D1C]/60 truncate">
                          Direct salon hotline, Telegram, and Addis Ababa address
                        </p>
                      </div>
                    </div>
                    {openWelcomeSection === 4 ? (
                      <ChevronUp className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    )}
                  </button>

                  {openWelcomeSection === 4 && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#4F2D1C]/[0.08] space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Phone Number (Direct Salon Hotline)
                        </label>
                        <input
                          type="text"
                          value={cmsForm.contactPhone || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, contactPhone: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono font-semibold text-[#2D1C14]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Telegram Channel / Support URL
                        </label>
                        <input
                          type="text"
                          value={cmsForm.contactTelegram || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, contactTelegram: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono text-[#2D1C14]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Showroom Address / Location
                        </label>
                        <input
                          type="text"
                          value={cmsForm.contactLocation || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, contactLocation: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Business Hours
                        </label>
                        <input
                          type="text"
                          value={cmsForm.contactHours || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, contactHours: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* SECTION 5: Footer Content, Social Media & Trust Assurances */}
                <section className="bg-[#FFFFFF] rounded-3xl border border-[#4F2D1C]/[0.08] shadow-[0_8px_20px_-6px_rgba(79,45,28,0.06)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenWelcomeSection(openWelcomeSection === 5 ? null : 5)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#4F2D1C] truncate">
                          5. Footer Content, Social Media &amp; Trust
                        </h3>
                        <p className="text-[11px] text-[#4F2D1C]/60 truncate">
                          Mission statement, social links, and 4 wholesale assurances
                        </p>
                      </div>
                    </div>
                    {openWelcomeSection === 5 ? (
                      <ChevronUp className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#4F2D1C]/70 shrink-0" />
                    )}
                  </button>

                  {openWelcomeSection === 5 && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#4F2D1C]/[0.08] space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Footer Brand Mission / Overview
                        </label>
                        <textarea
                          rows={3}
                          value={cmsForm.footerDescription || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, footerDescription: e.target.value })}
                          className="w-full p-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs text-[#2D1C14]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Official Inquiries Email
                        </label>
                        <input
                          type="email"
                          value={cmsForm.contactEmail || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, contactEmail: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono text-[#2D1C14]"
                        />
                      </div>

                      {/* Social Media Channels */}
                      <div className="pt-2 border-t border-[#4F2D1C]/10 space-y-2.5">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#4F2D1C]/70">
                          Social Media &amp; Direct Channels
                        </p>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              Instagram URL
                            </label>
                            <input
                              type="text"
                              value={cmsForm.socialInstagram || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, socialInstagram: e.target.value })}
                              className="w-full h-9 px-2.5 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono text-[#2D1C14]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              TikTok URL
                            </label>
                            <input
                              type="text"
                              value={cmsForm.socialTiktok || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, socialTiktok: e.target.value })}
                              className="w-full h-9 px-2.5 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono text-[#2D1C14]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              Facebook Page URL
                            </label>
                            <input
                              type="text"
                              value={cmsForm.socialFacebook || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, socialFacebook: e.target.value })}
                              className="w-full h-9 px-2.5 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono text-[#2D1C14]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              WhatsApp Direct Link
                            </label>
                            <input
                              type="text"
                              value={cmsForm.socialWhatsapp || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, socialWhatsapp: e.target.value })}
                              className="w-full h-9 px-2.5 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-mono text-[#2D1C14]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Wholesale Service Assurances (4 Highlights) */}
                      <div className="pt-2 border-t border-[#4F2D1C]/10 space-y-2.5">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#4F2D1C]/70">
                          Wholesale Service Assurances (4 Highlights)
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              Assurance #1 (Delivery)
                            </label>
                            <input
                              type="text"
                              value={cmsForm.footerService1 || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, footerService1: e.target.value })}
                              className="w-full h-9 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              Assurance #2 (Warranty)
                            </label>
                            <input
                              type="text"
                              value={cmsForm.footerService2 || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, footerService2: e.target.value })}
                              className="w-full h-9 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              Assurance #3 (Grade)
                            </label>
                            <input
                              type="text"
                              value={cmsForm.footerService3 || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, footerService3: e.target.value })}
                              className="w-full h-9 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#4F2D1C] mb-1">
                              Assurance #4 (Support)
                            </label>
                            <input
                              type="text"
                              value={cmsForm.footerService4 || ""}
                              onChange={(e) => setCmsForm({ ...cmsForm, footerService4: e.target.value })}
                              className="w-full h-9 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs font-medium text-[#2D1C14]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#4F2D1C] mb-1">
                          Footer Copyright Text
                        </label>
                        <input
                          type="text"
                          value={cmsForm.copyrightText || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, copyrightText: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-[#FAF6F0] border border-[#4F2D1C]/15 text-xs text-[#2D1C14]"
                        />
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Desktop View (Tablets & Desktop Screens: hidden md:block) */}
            <div className="hidden md:block animate-in fade-in duration-200">
              {/* Header / Actions - Claymorphic pinned card with minimal gap to top nav bar */}
              <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 pt-1.5 pb-1 bg-[#FAF6F0] z-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF6F0] py-2.5 px-5 sm:py-3 sm:px-6 rounded-2xl sm:rounded-3xl border border-[#4F2D1C]/15 shadow-[0_10px_25px_-5px_rgba(79,45,28,0.08),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,45,28,0.05)]">
                  <div>
                    <h1 className="text-base sm:text-lg font-serif font-bold text-[#4F2D1C] tracking-tight">
                      Manage your welcome page
                    </h1>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="submit"
                      form="welcome-cms-form"
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_20px_rgba(79,45,28,0.32)] active:scale-[0.98] cursor-pointer disabled:opacity-50 select-none"
                      title="Save All Changes"
                    >
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span>{actionLoading ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </div>
              </div>

            <form id="welcome-cms-form" onSubmit={handleSaveWelcomeCMS} className="mt-2 space-y-6">
              {/* SECTION 1: HERO BANNER & BRAND IDENTITY */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#4F2D1C]/5 space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#4F2D1C]/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#4F2D1C]">
                      1. Main Hero Banner & Brand Identity
                    </h2>
                    <p className="text-[11px] text-[#4F2D1C]/60">
                      Configure your brand name, main hero headline, subtext, and background banners.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Brand Name (Top Left & Badges)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.brandName}
                      onChange={(e) => setCmsForm({ ...cmsForm, brandName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Brand Subtitle (e.g. Salon & Makeup Products)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.brandSubtitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, brandSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Hero Headline - Line 1
                    </label>
                    <input
                      type="text"
                      value={cmsForm.heroTitleLine1}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroTitleLine1: e.target.value })}
                      placeholder="e.g. Equipping Top Salons,"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Hero Headline - Line 2 (Italic Accent)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.heroTitleLine2}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroTitleLine2: e.target.value })}
                      placeholder="e.g. Across Ethiopia."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={cmsForm.heroSubtitle || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSubtitle: e.target.value })}
                      placeholder="Direct importer of commercial products for beauty salons & makeup studios. (leave empty to hide)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Badge Text (Top Right of Hero)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.heroBadge || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroBadge: e.target.value })}
                      placeholder="e.g. Wholesale Products (leave empty to hide)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Mobile Motto Line (Under Portrait)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.heroMotto || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroMotto: e.target.value })}
                      placeholder="Commercial Products ✦ For Beauty & Makeup Salons (leave empty to hide)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-[#4F2D1C]">
                        Desktop Hero Background Image
                      </label>
                      <label className="text-[10px] text-[#4F2D1C] font-bold hover:underline cursor-pointer flex items-center gap-1">
                        <UploadCloud className="w-3 h-3" />
                        <span>{uploadingImage === "heroBgImage" ? "Uploading..." : "Upload from device"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage === "heroBgImage"}
                          onChange={(e) => handleHeroBgUpload(e, "heroBgImage")}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={cmsForm.heroBgImage}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroBgImage: e.target.value })}
                      placeholder="/hero-bg.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-[#4F2D1C]">
                        Mobile Hero Background Image
                      </label>
                      <label className="text-[10px] text-[#4F2D1C] font-bold hover:underline cursor-pointer flex items-center gap-1">
                        <UploadCloud className="w-3 h-3" />
                        <span>{uploadingImage === "mobileHeroBgImage" ? "Uploading..." : "Upload from device"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage === "mobileHeroBgImage"}
                          onChange={(e) => handleHeroBgUpload(e, "mobileHeroBgImage")}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={cmsForm.mobileHeroBgImage}
                      onChange={(e) => setCmsForm({ ...cmsForm, mobileHeroBgImage: e.target.value })}
                      placeholder="/mobile-welcome-hero.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PILLARS OF TRUST */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#4F2D1C]/5 space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#4F2D1C]/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#4F2D1C]">
                      2. Pillars of Trust ("Why Top Salons Trust Yolanda")
                    </h2>
                    <p className="text-[11px] text-[#4F2D1C]/60">
                      The 3 value proposition cards that prove your commercial product reliability to salon owners.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs pb-4 border-b border-[#4F2D1C]/10">
                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Section Sub-Tag
                    </label>
                    <input
                      type="text"
                      value={cmsForm.pillarSectionTag}
                      onChange={(e) => setCmsForm({ ...cmsForm, pillarSectionTag: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Section Main Title
                    </label>
                    <input
                      type="text"
                      value={cmsForm.pillarSectionTitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, pillarSectionTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Section Subtitle / Brief
                    </label>
                    <input
                      type="text"
                      value={cmsForm.pillarSectionSubtitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, pillarSectionSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                    />
                  </div>
                </div>

                {/* 3 Pillar Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Card 1 */}
                  <div className="bg-[#FAF6F0] p-5 rounded-2xl space-y-3.5 border border-[#4F2D1C]/5">
                    <span className="font-bold text-[10px] uppercase text-[#4F2D1C]/60 block">
                      Trust Card 01
                    </span>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Card Title</label>
                      <input
                        type="text"
                        value={cmsForm.pillar1Title || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar1Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                        placeholder="e.g. Commercial Salon Grade (leave blank to hide)"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={cmsForm.pillar1Desc || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar1Desc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Badge / Check Text</label>
                      <input
                        type="text"
                        value={cmsForm.pillar1Badge || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar1Badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#FAF6F0] p-5 rounded-2xl space-y-3.5 border border-[#4F2D1C]/5">
                    <span className="font-bold text-[10px] uppercase text-[#4F2D1C]/60 block">
                      Trust Card 02
                    </span>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Card Title</label>
                      <input
                        type="text"
                        value={cmsForm.pillar2Title || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar2Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                        placeholder="e.g. Warranty & Support (leave blank to hide)"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={cmsForm.pillar2Desc || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar2Desc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Badge / Check Text</label>
                      <input
                        type="text"
                        value={cmsForm.pillar2Badge || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar2Badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#FAF6F0] p-5 rounded-2xl space-y-3.5 border border-[#4F2D1C]/5">
                    <span className="font-bold text-[10px] uppercase text-[#4F2D1C]/60 block">
                      Trust Card 03
                    </span>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Card Title</label>
                      <input
                        type="text"
                        value={cmsForm.pillar3Title || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar3Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                        placeholder="e.g. Nationwide Delivery (leave blank to hide)"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={cmsForm.pillar3Desc || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar3Desc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Badge / Check Text</label>
                      <input
                        type="text"
                        value={cmsForm.pillar3Badge || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, pillar3Badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: HOW IT WORKS */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#4F2D1C]/5 space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#4F2D1C]/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C]">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#4F2D1C]">
                      3. "How It Works" 3-Step Ordering Process
                    </h2>
                    <p className="text-[11px] text-[#4F2D1C]/60">
                      Customize instructions explaining how salon owners register, view catalog in ETB, and submit orders.
                    </p>
                  </div>
                </div>

                <div className="pb-4 border-b border-[#4F2D1C]/10 text-xs">
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Process Section Title
                  </label>
                  <input
                    type="text"
                    value={cmsForm.howItWorksTitle || ""}
                    onChange={(e) => setCmsForm({ ...cmsForm, howItWorksTitle: e.target.value })}
                    className="w-full max-w-md px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                    placeholder="Simple 3-Step Process (leave empty to hide)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Step 1 */}
                  <div className="bg-[#FAF6F0] p-5 rounded-2xl space-y-3.5 border border-[#4F2D1C]/5">
                    <span className="font-bold text-[10px] uppercase text-[#4F2D1C]/60 block">
                      Step 01
                    </span>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Step Title</label>
                      <input
                        type="text"
                        value={cmsForm.step1Title || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, step1Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                        placeholder="Register Account (leave blank to hide)"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Explanation</label>
                      <textarea
                        rows={3}
                        value={cmsForm.step1Desc || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, step1Desc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none"
                      />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-[#FAF6F0] p-5 rounded-2xl space-y-3.5 border border-[#4F2D1C]/5">
                    <span className="font-bold text-[10px] uppercase text-[#4F2D1C]/60 block">
                      Step 02
                    </span>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Step Title</label>
                      <input
                        type="text"
                        value={cmsForm.step2Title || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, step2Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                        placeholder="Browse Wholesale Catalog (leave blank to hide)"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Explanation</label>
                      <textarea
                        rows={3}
                        value={cmsForm.step2Desc || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, step2Desc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none"
                      />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-[#FAF6F0] p-5 rounded-2xl space-y-3.5 border border-[#4F2D1C]/5">
                    <span className="font-bold text-[10px] uppercase text-[#4F2D1C]/60 block">
                      Step 03
                    </span>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Step Title</label>
                      <input
                        type="text"
                        value={cmsForm.step3Title || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, step3Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                        placeholder="Submit & Receive Freight (leave blank to hide)"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#4F2D1C] mb-1">Explanation</label>
                      <textarea
                        rows={3}
                        value={cmsForm.step3Desc || ""}
                        onChange={(e) => setCmsForm({ ...cmsForm, step3Desc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SHOWROOM CONTACT & HOURS */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#4F2D1C]/5 space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#4F2D1C]/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#4F2D1C]">
                      4. Showroom Contact, Location & Hours
                    </h2>
                    <p className="text-[11px] text-[#2E1A11]/60">
                      Contact numbers and showroom details displayed in the footer and help buttons.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Phone Number (Direct Salon Hotline)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.contactPhone || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      placeholder="+251 91 122 3344 (leave empty to hide)"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Telegram Channel / Support URL
                    </label>
                    <input
                      type="text"
                      value={cmsForm.contactTelegram || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactTelegram: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      placeholder="https://t.me/yolandabeauty (leave empty to hide)"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Showroom Address / Location
                    </label>
                    <input
                      type="text"
                      value={cmsForm.contactLocation || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      placeholder="Bole Medhanialem, Addis Ababa (leave empty to hide)"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Business Hours
                    </label>
                    <input
                      type="text"
                      value={cmsForm.contactHours || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      placeholder="Mon - Sat: 8:30 AM - 7:00 PM (leave empty to hide)"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: FOOTER CONTENT, SOCIAL MEDIA & ASSURANCE BADGES */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#4F2D1C]/5 space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#4F2D1C]/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#4F2D1C]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#4F2D1C]">
                      5. Footer Content, Social Media & Trust Assurances
                    </h2>
                    <p className="text-[11px] text-[#2E1A11]/60">
                      Customize footer brand statement, support email, social networks, wholesale guarantees, and copyright.
                    </p>
                  </div>
                </div>

                <div className="space-y-5 text-xs">
                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Footer Brand Mission / Overview
                    </label>
                    <textarea
                      rows={3}
                      value={cmsForm.footerDescription || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, footerDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 resize-none leading-relaxed"
                      placeholder="Ethiopia's premier wholesale supplier of professional salon & barber machinery... (leave empty to hide)"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Official Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={cmsForm.contactEmail || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      placeholder="contact@yolandabeauty.com (leave empty to hide)"
                    />
                  </div>

                  {/* Social Networks */}
                  <div className="pt-2 border-t border-[#4F2D1C]/10">
                    <h3 className="font-bold text-[#4F2D1C] mb-3 text-xs tracking-wider uppercase">
                      Social Media & Direct Channels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">Instagram URL</label>
                        <input
                          type="text"
                          value={cmsForm.socialInstagram || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, socialInstagram: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="https://instagram.com/yolandabeauty_et"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">TikTok URL</label>
                        <input
                          type="text"
                          value={cmsForm.socialTiktok || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, socialTiktok: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="https://tiktok.com/@yolandabeauty_et"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">Facebook Page URL</label>
                        <input
                          type="text"
                          value={cmsForm.socialFacebook || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, socialFacebook: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="https://facebook.com/yolandasalonet"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">WhatsApp Direct Link / Number</label>
                        <input
                          type="text"
                          value={cmsForm.socialWhatsapp || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, socialWhatsapp: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="https://wa.me/251911223344"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wholesale Assurances */}
                  <div className="pt-2 border-t border-[#4F2D1C]/10">
                    <h3 className="font-bold text-[#4F2D1C] mb-1 text-xs tracking-wider uppercase">
                      Wholesale Service Assurances (4 Highlights)
                    </h3>
                    <p className="text-[11px] text-[#2E1A11]/60 mb-3">
                      Use &quot;Title: Description&quot; format so the title renders in bold on the storefront. Leave blank to hide.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">Assurance #1 (Delivery)</label>
                        <input
                          type="text"
                          value={cmsForm.footerService1 || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, footerService1: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="Nationwide Shipping: Direct freight & delivery to all Ethiopian regions"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">Assurance #2 (Warranty)</label>
                        <input
                          type="text"
                          value={cmsForm.footerService2 || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, footerService2: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="Official Warranty: 1-Year comprehensive product guarantee"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">Assurance #3 (Grade)</label>
                        <input
                          type="text"
                          value={cmsForm.footerService3 || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, footerService3: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="Commercial Grade: Heavy-duty components built for salon volume"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#4F2D1C] mb-1">Assurance #4 (Support)</label>
                        <input
                          type="text"
                          value={cmsForm.footerService4 || ""}
                          onChange={(e) => setCmsForm({ ...cmsForm, footerService4: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                          placeholder="Technical Support: Spare parts & maintenance guidance available"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Copyright Notice */}
                  <div className="pt-2 border-t border-[#4F2D1C]/10">
                    <label className="block font-bold text-[#4F2D1C] mb-1">
                      Footer Copyright Text
                    </label>
                    <input
                      type="text"
                      value={cmsForm.copyrightText || ""}
                      onChange={(e) => setCmsForm({ ...cmsForm, copyrightText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                      placeholder="© 2026 Yolanda Salon Products. All rights reserved. (leave empty to hide)"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
      </main>

      {/* Floating Action Button (FAB) — Mobile Only for Product & Category Tabs */}
      {(activeTab === "products" || activeTab === "categories") && (
        <button
          type="button"
          onClick={catalogSubView === "categories" ? handleOpenAddCategory : handleOpenAddProduct}
          aria-label={catalogSubView === "categories" ? "New Category" : "Add Product"}
          className="md:hidden fixed bottom-22 right-4 z-40 px-4 py-3 rounded-full text-xs font-bold flex items-center gap-1.5 bg-[#4F2D1C] text-white shadow-xl border border-[#2D1C14] shadow-[0_8px_20px_-3px_rgba(79,45,28,0.28),0_3px_6px_-1px_rgba(79,45,28,0.16)] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white stroke-[2.5]" />
          <span>{catalogSubView === "categories" ? "New Category" : "Add Product"}</span>
        </button>
      )}

      {/* 4. FLOATING PILL BOTTOM NAVIGATION BAR (Luxury Style 02) */}
      <nav className="fixed md:hidden bottom-4 left-3 right-3 z-40 max-w-[400px] mx-auto bg-[#4F2D1C]/95 backdrop-blur-md text-[#FFFFFF] p-1.5 border border-white/20 shadow-[0_16px_36px_-6px_rgba(45,28,20,0.5),0_6px_16px_-4px_rgba(45,28,20,0.35)] rounded-full">
        <div className="grid grid-cols-4 gap-1 items-center">
          {/* Tab 1: Dashboard Overview */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("overview");
              setIsMobileSidebarOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            <span className="text-[10px] font-bold mt-0.5 leading-tight truncate">
              Overview
            </span>
          </button>

          {/* Tab 2: Welcome Page */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("welcome_cms");
              setIsMobileSidebarOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeTab === "welcome_cms"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <Layout className="w-4 h-4 stroke-[2]" />
            <span className="text-[10px] font-semibold mt-0.5 leading-tight truncate">
              Welcome
            </span>
          </button>

          {/* Tab 3: Product Catalog (with badge) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("products");
              setCatalogSubView("products");
              setIsMobileSidebarOpen(false);
            }}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeTab === "products" || activeTab === "categories"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <div className="relative">
              <Box className="w-4 h-4 stroke-[2]" />
              {metrics.productsCount > 0 && (
                <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full bg-[#FFFFFF] text-[#4F2D1C] text-[9px] font-extrabold leading-tight shadow-xs">
                  {metrics.productsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-0.5 leading-tight truncate">
              Products
            </span>
          </button>

          {/* Tab 4: Salon Orders (with badge) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("orders");
              setIsMobileSidebarOpen(false);
            }}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-[#2D1C14] text-[#FFFFFF] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
                : "text-white/75 hover:text-[#FFFFFF]"
            }`}
          >
            <div className="relative">
              <ClipboardList className="w-4 h-4 stroke-[2]" />
              {metrics.pendingOrders > 0 && (
                <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 px-1 rounded-full bg-[#FFFFFF] text-[#4F2D1C] text-[9px] font-extrabold flex items-center justify-center leading-none shadow-xs border border-white/40">
                  {metrics.pendingOrders}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-0.5 leading-tight truncate">
              Orders
            </span>
          </button>
        </div>
      </nav>
      </div>

      {/* ===================== ADD / EDIT PRODUCT MODAL (Bottom Sheet on Mobile) ===================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-2xl w-full max-h-[88vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border-t sm:border border-[#4F2D1C]/20">
            {/* Mobile Sheet Drag Handle */}
            <div
              className="sm:hidden -mt-1 pb-2 flex flex-col items-center cursor-pointer"
              onClick={() => setIsProductModalOpen(false)}
            >
              <div className="w-11 h-1.5 rounded-full bg-[#4F2D1C]/25" />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#4F2D1C]/10">
              <h2 className="text-lg font-serif font-bold text-[#4F2D1C]">
                {editingProduct ? "Edit Product Details" : "Publish New Product"}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#FAF6F0] text-[#4F2D1C]/60 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Pro Hydra-Facial Dermabrasion 9-in-1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Department Category *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Price in ETB *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 48500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Original Price in ETB <span className="font-normal text-[#4F2D1C]/60">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="e.g. 54000 (comparative price)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Warranty Duration
                  </label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                    placeholder="e.g. 1 Year Official Ethiopian Warranty"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Product Rating (1.0 - 5.0 Stars)
                  </label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={productForm.rating}
                      onChange={(e) =>
                        setProductForm({ ...productForm, rating: e.target.value })
                      }
                      placeholder="5.0"
                      className="w-24 px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                    />
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              rating: Number(star).toFixed(1),
                            })
                          }
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          title={`Set rating to ${star}.0`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= Math.round(Number(productForm.rating || 5))
                                ? "fill-amber-400 text-amber-400"
                                : "fill-[#4F2D1C]/10 text-[#4F2D1C]/25"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-[#4F2D1C]">
                      Product Image (Cloudinary or URL) *
                    </label>
                    <button
                      type="button"
                      onClick={() => productFileInputRef.current?.click()}
                      disabled={uploadingImage === "product"}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] text-[11px] font-bold cursor-pointer transition shadow-xs disabled:opacity-50"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#FAF6F0]" />
                      <span>{uploadingImage === "product" ? "Uploading to Cloud..." : "Upload from Device"}</span>
                    </button>
                    <input
                      ref={productFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </div>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="Upload a local image above, or paste https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                  />
                  {productForm.image && (
                    <div className="mt-2.5 p-2 rounded-2xl bg-[#FAF6F0] border border-[#4F2D1C]/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          onClick={() => productFileInputRef.current?.click()}
                          className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#4F2D1C]/15 shrink-0 relative group cursor-pointer"
                          title="Click to replace photo"
                        >
                          <img
                            src={productForm.image}
                            alt="Preview"
                            className="w-full h-full object-cover transition group-hover:opacity-75"
                            onError={(e) => {
                              (e.target as any).src =
                                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#4F2D1C] truncate">
                            {uploadingImage === "product" ? "Uploading photo..." : "Active Product Photo"}
                          </p>
                          <p className="text-[10px] text-[#4F2D1C]/60 truncate font-mono mt-0.5">
                            {productForm.image}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => productFileInputRef.current?.click()}
                          disabled={uploadingImage === "product"}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#4F2D1C]/15 hover:bg-[#4F2D1C]/5 text-[11px] font-bold text-[#4F2D1C] cursor-pointer transition disabled:opacity-50"
                        >
                          Replace Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductForm((prev) => ({ ...prev, image: "" }))}
                          disabled={uploadingImage === "product"}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer transition disabled:opacity-50"
                          title="Clear image"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#4F2D1C] mb-1">
                    Product Description & Specifications
                  </label>
                  <textarea
                    rows={5}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe product capabilities, power consumption, operating voltage, dimensions, and salon benefits..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30 leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4F2D1C] select-none">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-[#4F2D1C] focus:ring-[#4F2D1C] accent-[#4F2D1C] cursor-pointer"
                    />
                    <span className="text-xs">Available in Stock</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#4F2D1C]/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#4F2D1C]/10 text-[#4F2D1C] font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploadingImage === "product"}
                  className="px-5 py-2.5 rounded-xl bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : uploadingImage === "product" ? "Uploading Image..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== ADD / EDIT CATEGORY MODAL ===================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#4F2D1C]/10">
              <h2 className="text-lg font-serif font-bold text-[#4F2D1C]">
                {editingCategory ? "Edit Category" : "Add Salon Department"}
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#FAF6F0] text-[#4F2D1C]/60 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#4F2D1C] mb-1">
                  Category Department Name
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Hair Salon Products"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4F2D1C] mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g. hair-salon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#4F2D1C]">
                    Department Cover Image (Cloudinary or URL)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] text-[11px] font-bold cursor-pointer transition shadow-xs">
                    <UploadCloud className="w-3 h-3 text-[#FAF6F0]" />
                    <span>{uploadingImage === "category" ? "Uploading to Cloud..." : "Upload from Device"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage === "category"}
                      onChange={handleCategoryImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="Upload a local image above, or paste https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] text-[#4F2D1C] focus:outline-none focus:ring-1 focus:ring-[#4F2D1C]/30"
                />
                {categoryForm.image && (
                  <div className="mt-2 w-full h-28 rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#4F2D1C]/10">
                    <img
                      src={categoryForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#4F2D1C]/10">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#4F2D1C]/10 text-[#4F2D1C] font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#4F2D1C] hover:bg-[#1a100b] text-[#FAF6F0] font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  {actionLoading ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===================== CUSTOM CONFIRMATION MODAL ===================== */}
      {confirmDialog?.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#4F2D1C]/15 space-y-5 animate-in zoom-in-95 duration-150 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setConfirmDialog(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#FAF6F0] text-[#4F2D1C]/50 hover:text-[#4F2D1C] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon & Title Row */}
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmDialog.type === "warning"
                    ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                    : "bg-red-500/10 text-red-600 border border-red-500/20"
                }`}
              >
                {confirmDialog.type === "warning" ? (
                  <RotateCcw className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <Trash2 className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>

              <div className="space-y-1.5 pr-4">
                <h3 className="text-lg font-serif font-black text-[#4F2D1C] leading-snug">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-[#4F2D1C]/75 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#4F2D1C]/10">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#4F2D1C]/10 text-[#4F2D1C] font-bold text-xs transition cursor-pointer"
              >
                {confirmDialog.cancelLabel || "Cancel"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  if (action) await action();
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer active:scale-[0.98] text-white ${
                  confirmDialog.type === "warning"
                    ? "bg-[#4F2D1C] hover:bg-[#2D1C14]"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmDialog.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
