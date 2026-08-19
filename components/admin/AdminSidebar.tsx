"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  MessageSquareCheck,
  BarChart3,
  Activity,
  Gauge,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { AdminView } from "@/types/admin";

interface AdminSidebarProps {
  currentView: AdminView;
  onSelectView: (view: AdminView) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  reviewPendingCount?: number;
  onLogout?: () => void;
}

export default function AdminSidebar({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapsed,
  reviewPendingCount = 0,
  onLogout,
}: AdminSidebarProps) {
  const navItems: {
    id: AdminView;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Product Listing CMS", icon: Package },
    { id: "artisans", label: "Artisans & Users", icon: Users },
    { id: "customers", label: "Customers & Leads", icon: UserCheck },
    {
      id: "reviews",
      label: "Reviews & Authenticity",
      icon: MessageSquareCheck,
      badge: reviewPendingCount > 0 ? reviewPendingCount : undefined,
      badgeColor: "bg-[#B85C43] text-white",
    },
    { id: "analytics", label: "Craft Analytics", icon: BarChart3 },
    { id: "performance", label: "System & AI Health", icon: Gauge },
    { id: "activity", label: "Audit & Activity Logs", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1E211F] text-[#F5F0E8] border-r border-[#2E3330] transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[#2E3330]">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-[#B85C43] to-[#A88752] flex items-center justify-center text-white shadow-md">
              <Sparkles className="size-5" />
            </div>
            <div>
              <span className="font-serif-editorial text-xl font-bold tracking-wider text-[#FBF8F2] block">
                VISART
              </span>
              <span className="text-[10px] text-[#A88752] tracking-widest uppercase font-semibold block">
                Admin & CMS
              </span>
            </div>
          </div>
        ) : (
          <div className="size-9 mx-auto rounded-xl bg-gradient-to-br from-[#B85C43] to-[#A88752] flex items-center justify-center text-white shadow-md">
            <Sparkles className="size-5" />
          </div>
        )}

        <button
          onClick={onToggleCollapsed}
          className="size-8 rounded-lg bg-[#27344A]/50 hover:bg-[#27344A] text-[#D8D0C4] flex items-center justify-center transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#B85C43] text-white shadow-sm font-semibold"
                  : "text-[#D8D0C4] hover:bg-[#27344A]/60 hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    item.badgeColor || "bg-[#27344A] text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section & Quick Public Link */}
      <div className="p-3 border-t border-[#2E3330] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#A88752] hover:text-[#FBF8F2] hover:bg-[#27344A]/40 rounded-lg transition-colors"
        >
          <ExternalLink className="size-4 shrink-0" />
          {!collapsed && <span>View Live Studio</span>}
        </Link>

        <div className="flex items-center gap-3 px-2 py-2 bg-[#27344A]/30 rounded-xl border border-[#2E3330]">
          <div className="size-8 rounded-full bg-[#B85C43]/30 border border-[#B85C43] flex items-center justify-center text-xs font-bold text-[#FBF8F2]">
            AP
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#FBF8F2] truncate">Arrin Paul</p>
              <p className="text-[10px] text-[#A88752] truncate">Super Admin</p>
            </div>
          )}
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <span>{collapsed ? "Exit" : "Sign Out"}</span>
          </button>
        )}
      </div>
    </aside>
  );
}
