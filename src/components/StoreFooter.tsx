"use client";

import React from "react";
import { useShop, DEFAULT_WELCOME_SETTINGS } from "@/context/ShopContext";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
  Award,
  Sparkles,
  Building2,
} from "lucide-react";

export default function StoreFooter() {
  const { welcomeSettings } = useShop();
  const ws = welcomeSettings || DEFAULT_WELCOME_SETTINGS;

  // Social Link Visibility Checks
  const hasTelegram = Boolean(ws.contactTelegram?.trim());
  const hasInstagram = Boolean(ws.socialInstagram?.trim());
  const hasTiktok = Boolean(ws.socialTiktok?.trim());
  const hasFacebook = Boolean(ws.socialFacebook?.trim());
  const hasWhatsapp = Boolean(ws.socialWhatsapp?.trim());
  const hasAnySocial = hasTelegram || hasInstagram || hasTiktok || hasFacebook || hasWhatsapp;

  // Contact Info Checks
  const hasLocation = Boolean(ws.contactLocation?.trim());
  const hasPhone = Boolean(ws.contactPhone?.trim());
  const hasEmail = Boolean(ws.contactEmail?.trim());
  const hasHours = Boolean(ws.contactHours?.trim());

  // Wholesale Service Assurance Checks
  const service1 = ws.footerService1?.trim() || "1-Year Commercial Warranty";
  const service2 = ws.footerService2?.trim() || "Salon Equipment Voltage Certified";
  const service3 = ws.footerService3?.trim() || "Nationwide Salon Delivery";
  const service4 = ws.footerService4?.trim() || "Direct Phone & Order Support";

  const description =
    ws.footerDescription?.trim() ||
    "Ethiopia's premier commercial salon equipment supplier. Equipping hair salons, estheticians, barbershops, and luxury vanity studios across Addis Ababa and all regions.";

  const copyright =
    ws.copyrightText?.trim() ||
    `© ${new Date().getFullYear()} Yolanda Salon Equipment Supplier. All rights reserved.`;

  return (
    <footer className="w-full mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#4F2D1C]/15 text-[#4F2D1C]">
      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP FOOTER (3 CLEAN BALANCED COLUMNS)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-12 pb-8">
        {/* Col 1: Brand Identity & Mission (5 cols) */}
        <div className="md:col-span-5 space-y-3.5">
          <div className="flex items-center gap-3">
            <img
              src={ws.brandLogoImage || "/yolanda-logo.jpg"}
              alt="Yolanda Logo"
              className="w-10 h-10 rounded-full object-cover shadow-2xs border border-[#4F2D1C]/10"
            />
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight text-[#4F2D1C]">
                {ws.brandName}
              </h3>
              {ws.brandSubtitle?.trim() && (
                <p className="text-[10px] uppercase tracking-wider text-[#4F2D1C]/70 font-semibold">
                  {ws.brandSubtitle}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-[#4F2D1C]/75 leading-relaxed max-w-md">
            {description}
          </p>

          {/* Social Media Link Icons */}
          {hasAnySocial && (
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#4F2D1C]/60 block mb-2.5">
                Follow & Connect
              </span>
              <div className="flex items-center gap-2">
                {hasTelegram && (
                  <a
                    href={ws.contactTelegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-white flex items-center justify-center transition shadow-2xs group cursor-pointer border border-[#4F2D1C]/10"
                  >
                    <Send className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </a>
                )}

                {hasInstagram && (
                  <a
                    href={ws.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-white flex items-center justify-center transition shadow-2xs group cursor-pointer border border-[#4F2D1C]/10"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}

                {hasTiktok && (
                  <a
                    href={ws.socialTiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-white flex items-center justify-center transition shadow-2xs group cursor-pointer border border-[#4F2D1C]/10"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z" />
                    </svg>
                  </a>
                )}

                {hasFacebook && (
                  <a
                    href={ws.socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-white flex items-center justify-center transition shadow-2xs group cursor-pointer border border-[#4F2D1C]/10"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}

                {hasWhatsapp && (
                  <a
                    href={ws.socialWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#4F2D1C] text-[#4F2D1C] hover:text-white flex items-center justify-center transition shadow-2xs group cursor-pointer border border-[#4F2D1C]/10"
                  >
                    <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Col 2: Showroom & Direct Contact (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#4F2D1C]/60 block">
            Showroom & Contacts
          </span>
          <ul className="space-y-2.5 text-xs text-[#4F2D1C]/80">
            {hasLocation && (
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4F2D1C] shrink-0 mt-0.5" />
                <span className="leading-snug">{ws.contactLocation}</span>
              </li>
            )}
            {hasPhone && (
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4F2D1C] shrink-0" />
                <a
                  href={`tel:${ws.contactPhone.replace(/\s+/g, "")}`}
                  className="hover:text-[#4F2D1C] hover:underline font-semibold transition"
                >
                  {ws.contactPhone}
                </a>
              </li>
            )}
            {hasEmail && (
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4F2D1C] shrink-0" />
                <a
                  href={`mailto:${ws.contactEmail}`}
                  className="hover:text-[#4F2D1C] hover:underline transition truncate"
                >
                  {ws.contactEmail}
                </a>
              </li>
            )}
            {hasHours && (
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#4F2D1C] shrink-0" />
                <span>{ws.contactHours}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Col 3: Wholesale Assurances (3 cols) */}
        <div className="md:col-span-3 space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#4F2D1C]/60 block">
            Wholesale Assurances
          </span>
          <ul className="space-y-2.5 text-xs text-[#4F2D1C]/80">
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#4F2D1C] shrink-0" />
              <span>{service1}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#4F2D1C] shrink-0" />
              <span>{service2}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-[#4F2D1C] shrink-0" />
              <span>{service3}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-[#4F2D1C] shrink-0" />
              <span>{service4}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE COMPACT FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden space-y-3.5 pb-3">
        <div className="flex items-center gap-2.5">
          <img
            src={ws.brandLogoImage || "/yolanda-logo.jpg"}
            alt="Yolanda Logo"
            className="w-8 h-8 rounded-full object-cover shadow-2xs border border-[#4F2D1C]/10 shrink-0"
          />
          <div>
            <h3 className="font-serif text-sm font-bold text-[#4F2D1C]">
              {ws.brandName}
            </h3>
            {ws.brandSubtitle?.trim() && (
              <p className="text-[9px] uppercase tracking-wider text-[#4F2D1C]/70 font-semibold">
                {ws.brandSubtitle}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-[#4F2D1C]/75 leading-relaxed">
          {description}
        </p>

        {(hasLocation || hasPhone || hasEmail) && (
          <div className="space-y-1.5 text-xs text-[#4F2D1C]/80 pt-1">
            {hasLocation && (
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#4F2D1C] shrink-0 mt-0.5" />
                <span>{ws.contactLocation}</span>
              </p>
            )}
            {hasPhone && (
              <p className="flex items-center gap-2 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#4F2D1C] shrink-0" />
                <a
                  href={`tel:${ws.contactPhone.replace(/\s+/g, "")}`}
                  className="hover:underline font-semibold"
                >
                  {ws.contactPhone}
                </a>
              </p>
            )}
            {hasEmail && (
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#4F2D1C] shrink-0" />
                <a href={`mailto:${ws.contactEmail}`} className="hover:underline">
                  {ws.contactEmail}
                </a>
              </p>
            )}
          </div>
        )}

        {/* Mobile Social Links */}
        {hasAnySocial && (
          <div className="flex items-center gap-2 pt-1">
            {hasTelegram && (
              <a
                href={ws.contactTelegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-7 h-7 rounded-full bg-white border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shadow-2xs"
              >
                <Send className="w-3 h-3" />
              </a>
            )}
            {hasInstagram && (
              <a
                href={ws.socialInstagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-white border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shadow-2xs"
              >
                <svg
                  className="w-3 h-3 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}
            {hasTiktok && (
              <a
                href={ws.socialTiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-7 h-7 rounded-full bg-white border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shadow-2xs"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z" />
                </svg>
              </a>
            )}
            {hasFacebook && (
              <a
                href={ws.socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded-full bg-white border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shadow-2xs"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {hasWhatsapp && (
              <a
                href={ws.socialWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-7 h-7 rounded-full bg-white border border-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] shadow-2xs"
              >
                <MessageCircle className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM DIVIDER & COPYRIGHT
      ═══════════════════════════════════════════════════════════════ */}
      <div className="pt-6 border-t border-[#4F2D1C]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#4F2D1C]/70">
        <p className="text-center sm:text-left">{copyright}</p>
      </div>
    </footer>
  );
}