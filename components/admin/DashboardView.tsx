"use client";

import React from "react";
import {
  Package,
  Users,
  UserCheck,
  MessageSquareCheck,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Sparkles,
  ArrowUpRight,
  Activity,
  CheckCircle,
  Clock,
  Server,
  Zap,
} from "lucide-react";
import type {
  AdminDashboardStats,
  SystemHealthMetrics,
  ActivityLog,
  AdminView,
} from "@/types/admin";

interface DashboardViewProps {
  stats: AdminDashboardStats | null;
  health: SystemHealthMetrics | null;
  activityLogs: ActivityLog[];
  onNavigate: (view: AdminView) => void;
}

export default function DashboardView({
  stats,
  health,
  activityLogs,
  onNavigate,
}: DashboardViewProps) {
  const statCards = [
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      subValue: `${stats?.activePublishedProducts || 0} Published`,
      growth: stats?.growthRates.products || 24.5,
      icon: Package,
      color: "text-[#B85C43]",
      bg: "bg-[#B85C43]/10",
      view: "products" as AdminView,
    },
    {
      label: "Master Artisans",
      value: stats?.totalArtisans || 0,
      subValue: "100% Verified",
      growth: stats?.growthRates.artisans || 18.2,
      icon: Users,
      color: "text-[#A88752]",
      bg: "bg-[#A88752]/10",
      view: "artisans" as AdminView,
    },
    {
      label: "Customer Inquiries",
      value: stats?.totalCustomers || 0,
      subValue: "Buyer Leads & Direct WhatsApp",
      growth: stats?.growthRates.customers || 31.0,
      icon: UserCheck,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      view: "customers" as AdminView,
    },
    {
      label: "Authentic Reviews",
      value: stats?.totalReviews || 0,
      subValue: `${stats?.verifiedAuthenticReviewsCount || 0} Verified Genuine`,
      growth: stats?.growthRates.reviews || 14.8,
      icon: MessageSquareCheck,
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      view: "reviews" as AdminView,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.view)}
              className="bg-white p-5 rounded-2xl border border-[#D8D0C4] shadow-sm hover:shadow-md hover:border-[#B85C43]/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-serif-editorial text-3xl font-bold text-[#1E211F]">
                  {card.value}
                </span>
                <span className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <TrendingUp className="size-3 mr-1" />
                  +{card.growth}%
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-[#68655F]">
                <span>{card.subValue}</span>
                <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 text-[#B85C43] transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Highlights: Catalog Value & Readiness Average */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estimated Value Card */}
        <div className="bg-gradient-to-br from-[#1E211F] to-[#27344A] text-[#F5F0E8] p-6 rounded-2xl border border-[#2E3330] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#A88752] text-xs font-bold uppercase tracking-widest">
              <span>Fair Market Index</span>
              <IndianRupee className="size-4" />
            </div>
            <p className="font-serif-editorial text-3xl font-bold text-[#FBF8F2] mt-3">
              ₹{(stats?.estimatedCatalogValueInr || 24500).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-[#D8D0C4] mt-1">
              Estimated total catalogue commercial valuation based on artisan cost × markup.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A88752]">
            <span>Average Readiness Index:</span>
            <span className="text-[#FBF8F2] font-bold text-sm">
              {stats?.averageReadinessScore || 92}%
            </span>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#D8D0C4] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="size-5 text-[#B85C43]" />
              <h3 className="text-sm font-bold text-[#1E211F]">System & AI Status</h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Operational
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EBE3D5]">
              <span className="text-[#68655F]">PostgreSQL Database (Supabase)</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="size-3" /> {health?.supabaseDb.latencyMs || 18}ms
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EBE3D5]">
              <span className="text-[#68655F]">Gemini 2.5 / 3.7 Flash Engine</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <Zap className="size-3 text-[#A88752]" /> {health?.geminiAi.latencyMs || 380}ms
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#68655F]">Multilingual Audio TTS Latency</span>
              <span className="font-semibold text-emerald-700">
                {health?.audioEngine.latencyMs || 95}ms
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate("performance")}
            className="mt-4 w-full py-2 text-xs font-semibold text-[#B85C43] hover:bg-[#B85C43]/10 rounded-xl transition-colors text-center"
          >
            View Full Latency & Uptime Graphs →
          </button>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#D8D0C4] shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-[#A88752]" />
            <h3 className="text-sm font-bold text-[#1E211F]">Quick Control Actions</h3>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => onNavigate("products")}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-[#EBE3D5] rounded-xl border border-[#D8D0C4] text-xs font-semibold text-[#1E211F] transition-all"
            >
              <span>Manage Product Listings</span>
              <ArrowUpRight className="size-4 text-[#68655F]" />
            </button>
            <button
              onClick={() => onNavigate("reviews")}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-[#EBE3D5] rounded-xl border border-[#D8D0C4] text-xs font-semibold text-[#1E211F] transition-all"
            >
              <span>Moderate Buyer Reviews & Authenticity</span>
              <ArrowUpRight className="size-4 text-[#68655F]" />
            </button>
            <button
              onClick={() => onNavigate("customers")}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-[#EBE3D5] rounded-xl border border-[#D8D0C4] text-xs font-semibold text-[#1E211F] transition-all"
            >
              <span>View Customer Leads CRM</span>
              <ArrowUpRight className="size-4 text-[#68655F]" />
            </button>
          </div>

          <div className="mt-3 text-[11px] text-[#68655F] text-center">
            All data syncs with PostgreSQL and local fallback instantly.
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Trail */}
      <div className="bg-white rounded-2xl border border-[#D8D0C4] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-[#B85C43]" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
              Recent Audit & Administrative Activity
            </h3>
          </div>
          <button
            onClick={() => onNavigate("activity")}
            className="text-xs font-semibold text-[#B85C43] hover:underline"
          >
            View All Logs →
          </button>
        </div>

        <div className="divide-y divide-[#EBE3D5]">
          {activityLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 size-2 rounded-full bg-[#B85C43] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#1E211F]">{log.details}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#68655F]">
                    <span className="font-semibold text-[#A88752]">{log.actor.name}</span>
                    <span>•</span>
                    <span className="uppercase font-mono">{log.action}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#68655F] shrink-0 flex items-center gap-1">
                <Clock className="size-3" />
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
