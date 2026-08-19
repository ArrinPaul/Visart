"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import type { AdminView, SystemHealthMetrics } from "@/types/admin";

interface AdminHeaderProps {
  currentView: AdminView;
  onRefresh: () => void;
  refreshing: boolean;
  health: SystemHealthMetrics | null;
  onQuickNewProduct?: () => void;
}

const VIEW_TITLES: Record<AdminView, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Executive Dashboard",
    subtitle: "Overview of platform health, artisan growth, and catalogue value.",
  },
  products: {
    title: "Product Listing & Story CMS",
    subtitle: "Manage, edit, translate, and publish handcrafted artisan listings.",
  },
  artisans: {
    title: "Artisans & Users Directory",
    subtitle: "Verified master craftspeople, workshops, and user profiles.",
  },
  customers: {
    title: "Customer Inquiries & Reach",
    subtitle: "Track buyer leads, direct WhatsApp inquiries, and customer interest.",
  },
  reviews: {
    title: "Reviews & Authenticity Moderation",
    subtitle: "AI counterfeit risk evaluation and handcrafted certification checks.",
  },
  analytics: {
    title: "Craft Analytics & Intelligence",
    subtitle: "Trends, geographic distribution, and craft category market shares.",
  },
  performance: {
    title: "System & AI Performance",
    subtitle: "Gemini 2.5/3.7 inference latency, Supabase DB health, and TTS speeds.",
  },
  activity: {
    title: "Audit & Activity Logs",
    subtitle: "Chronological audit trail of all administrative and system events.",
  },
  settings: {
    title: "Platform Settings",
    subtitle: "System configuration, AI model parameters, and pricing algorithms.",
  },
};

export default function AdminHeader({
  currentView,
  onRefresh,
  refreshing,
  health,
  onQuickNewProduct,
}: AdminHeaderProps) {
  const currentMeta = VIEW_TITLES[currentView] || VIEW_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#D8D0C4] px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and breadcrumbs */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A88752]">
            <span>Visart Admin</span>
            <span>/</span>
            <span>{currentMeta.title}</span>
          </div>
          <h1 className="font-serif-editorial text-2xl font-bold text-[#1E211F] mt-0.5">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5">{currentMeta.subtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Health Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#D8D0C4] text-xs font-medium">
            {health?.status === "healthy" ? (
              <>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-semibold">Systems Healthy</span>
              </>
            ) : (
              <>
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-700 font-semibold">Service Degraded</span>
              </>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white border border-[#D8D0C4] text-[#1E211F] hover:bg-[#EBE3D5] transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin text-[#B85C43]" : ""}`} />
          </button>

          {/* Create New Product CTA */}
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#B85C43] hover:bg-[#9E4730] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <PlusCircle className="size-4" />
            <span>New Craft Listing</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
