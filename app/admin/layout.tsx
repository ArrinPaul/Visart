import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VISART Admin — Studio & Content Management System",
  description: "Executive administrative portal and content management system for Visart handcrafted artisan platform.",
};

// Wraps every /admin route. Provides page metadata and shared styling only — no auth check
// happens here or anywhere else server-side for this route tree. See docs/AUTHENTICATION.md.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1E211F]">
      {children}
    </div>
  );
}
