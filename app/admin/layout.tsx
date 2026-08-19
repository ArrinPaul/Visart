import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "VISART Admin — Studio & Content Management System",
  description: "Executive administrative portal and content management system for Visart handcrafted artisan platform.",
};

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
