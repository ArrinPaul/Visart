"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardView from "@/components/admin/DashboardView";
import ProductsCMSView from "@/components/admin/ProductsCMSView";
import ArtisansUsersView from "@/components/admin/ArtisansUsersView";
import CustomersView from "@/components/admin/CustomersView";
import ReviewsCMSView from "@/components/admin/ReviewsCMSView";
import AnalyticsView from "@/components/admin/AnalyticsView";
import PerformanceView from "@/components/admin/PerformanceView";
import ActivityLogsView from "@/components/admin/ActivityLogsView";
import SettingsView from "@/components/admin/SettingsView";
import AdminLoginPage from "@/components/admin/AdminLoginPage";

import type {
  AdminView,
  AdminDashboardStats,
  AdminProductSummary,
  ArtisanProfile,
  CustomerLead,
  ReviewModerationItem,
  SystemHealthMetrics,
  PerformanceMetrics,
  ActivityLog,
  AdminSystemSettings,
} from "@/types/admin";
import type { VisartGeneration } from "@/types/visart";

import {
  getAdminDashboardStats,
  getAdminProductsCMS,
  getArtisansList,
  getCustomerLeads,
  getAllReviewsCMS,
  getSystemHealthMetrics,
  getPerformanceAnalytics,
  getAdminActivityLogs,
  getAdminSettings,
  toggleProductPublish,
  deleteProductCMS,
  updateArtisanStatus,
  addCustomerLead,
  updateReviewStatus,
  updateAdminSettings,
} from "@/lib/supabase/admin";
import { updateProductData } from "@/lib/supabase/products";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default to authenticated for instant accessibility
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("visart_admin_session");
      if (session === "unauthenticated") {
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Data states
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [products, setProducts] = useState<AdminProductSummary[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [customers, setCustomers] = useState<CustomerLead[]>([]);
  const [reviews, setReviews] = useState<ReviewModerationItem[]>([]);
  const [health, setHealth] = useState<SystemHealthMetrics | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AdminSystemSettings | null>(null);

  const loadAllData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [
        statsData,
        productsData,
        artisansData,
        customersData,
        reviewsData,
        healthData,
        perfData,
        logsData,
        settingsData,
      ] = await Promise.all([
        getAdminDashboardStats(),
        getAdminProductsCMS(),
        getArtisansList(),
        getCustomerLeads(),
        getAllReviewsCMS(),
        getSystemHealthMetrics(),
        getPerformanceAnalytics(),
        getAdminActivityLogs(100),
        getAdminSettings(),
      ]);

      setStats(statsData);
      setProducts(productsData);
      setArtisans(artisansData);
      setCustomers(customersData);
      setReviews(reviewsData);
      setHealth(healthData);
      setPerformance(perfData);
      setActivityLogs(logsData);
      setSettings(settingsData);
    } catch (err) {
      console.error("Failed to load admin portal data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleTogglePublish = async (productId: string, isPublished: boolean) => {
    await toggleProductPublish(productId, isPublished);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_published: isPublished } : p))
    );
    const updatedStats = await getAdminDashboardStats();
    setStats(updatedStats);
    const updatedLogs = await getAdminActivityLogs(20);
    setActivityLogs(updatedLogs);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProductCMS(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    const updatedStats = await getAdminDashboardStats();
    setStats(updatedStats);
    const updatedLogs = await getAdminActivityLogs(20);
    setActivityLogs(updatedLogs);
  };

  const handleUpdateProduct = async (
    productId: string,
    patch: Partial<VisartGeneration>
  ) => {
    await updateProductData(productId, patch);
    const refreshed = await getAdminProductsCMS();
    setProducts(refreshed);
    const updatedLogs = await getAdminActivityLogs(20);
    setActivityLogs(updatedLogs);
  };

  const handleUpdateArtisanStatus = async (
    artisanId: string,
    newStatus: "ACTIVE" | "VERIFIED" | "PENDING"
  ) => {
    await updateArtisanStatus(artisanId, newStatus);
    setArtisans((prev) =>
      prev.map((a) => (a.id === artisanId ? { ...a, status: newStatus } : a))
    );
    const updatedLogs = await getAdminActivityLogs(20);
    setActivityLogs(updatedLogs);
  };

  const handleAddCustomer = async (lead: Omit<CustomerLead, "id" | "lastActive">) => {
    const newLead = await addCustomerLead(lead);
    setCustomers((prev) => [newLead, ...prev]);
    const updatedStats = await getAdminDashboardStats();
    setStats(updatedStats);
  };

  const handleUpdateReviewStatus = async (
    reviewId: string,
    newStatus: "APPROVED" | "FLAGGED" | "REJECTED"
  ) => {
    await updateReviewStatus(reviewId, newStatus);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
    );
    const updatedLogs = await getAdminActivityLogs(20);
    setActivityLogs(updatedLogs);
    const updatedStats = await getAdminDashboardStats();
    setStats(updatedStats);
  };

  const handleUpdateSettings = async (patch: Partial<AdminSystemSettings>) => {
    const updated = await updateAdminSettings(patch);
    setSettings(updated);
    const updatedLogs = await getAdminActivityLogs(20);
    setActivityLogs(updatedLogs);
  };

  const pendingReviewCount = reviews.filter(
    (r) => r.status === "PENDING" || r.status === "FLAGGED"
  ).length;

  const renderActiveView = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B85C43]"></div>
          <p className="text-xs font-semibold text-[#68655F]">Loading Visart Admin Portal...</p>
        </div>
      );
    }

    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView
            stats={stats}
            health={health}
            activityLogs={activityLogs}
            onNavigate={(view) => setCurrentView(view)}
          />
        );
      case "products":
        return (
          <ProductsCMSView
            products={products}
            onTogglePublish={handleTogglePublish}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
          />
        );
      case "artisans":
        return (
          <ArtisansUsersView
            artisans={artisans}
            onUpdateStatus={handleUpdateArtisanStatus}
          />
        );
      case "customers":
        return (
          <CustomersView
            customers={customers}
            onAddCustomer={handleAddCustomer}
          />
        );
      case "reviews":
        return (
          <ReviewsCMSView
            reviews={reviews}
            onUpdateStatus={handleUpdateReviewStatus}
          />
        );
      case "analytics":
        return <AnalyticsView performance={performance} />;
      case "performance":
        return <PerformanceView health={health} performance={performance} />;
      case "activity":
        return <ActivityLogsView logs={activityLogs} />;
      case "settings":
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return (
          <DashboardView
            stats={stats}
            health={health}
            activityLogs={activityLogs}
            onNavigate={(view) => setCurrentView(view)}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          loadAllData();
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      {/* Collapsible Sidebar */}
      <AdminSidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        reviewPendingCount={pendingReviewCount}
        onLogout={() => {
          if (typeof window !== "undefined") {
            localStorage.setItem("visart_admin_session", "unauthenticated");
          }
          setIsAuthenticated(false);
        }}
      />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header Bar */}
        <AdminHeader
          currentView={currentView}
          onRefresh={() => loadAllData(true)}
          refreshing={refreshing}
          health={health}
        />

        {/* View Workspace */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
