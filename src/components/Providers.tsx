"use client";

import React from "react";
import { ShopProvider } from "@/context/ShopContext";
import AuthModal from "@/components/AuthModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      {children}
      <AuthModal />
    </ShopProvider>
  );
}
