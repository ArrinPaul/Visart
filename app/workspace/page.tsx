"use client";

import React, { useState, useEffect } from "react";
import { VisartGeneration } from "@/types/visart";
import { WorkspaceTab } from "@/types/frontend";
import { demoProduct } from "@/lib/demo/demoProduct";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs";
import ListingPanel from "@/components/workspace/ListingPanel";
import PricingPanel from "@/components/workspace/PricingPanel";
import MarketingPanel from "@/components/workspace/MarketingPanel";
import ReachPanel from "@/components/workspace/ReachPanel";
import ReadinessPanel from "@/components/workspace/ReadinessPanel";

export default function WorkspacePage() {
  const [generation, setGeneration] = useState<VisartGeneration>(demoProduct);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("LISTING");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("visart_active_generation");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setGeneration(parsed);
        } catch {
          // Fallback to demo fixture
        }
      }
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header Summary */}
      <WorkspaceHeader generation={generation} />

      {/* Tabs */}
      <WorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Dynamic Panel Content */}
      <div className="min-h-[400px]">
        {activeTab === "LISTING" && (
          <ListingPanel product={generation.product} story={generation.story} />
        )}
        {activeTab === "PRICING" && (
          <PricingPanel pricing={generation.pricing} />
        )}
        {activeTab === "MARKETING" && (
          <MarketingPanel marketing={generation.marketing} />
        )}
        {activeTab === "REACH" && (
          <ReachPanel translations={generation.translations} />
        )}
        {activeTab === "READINESS" && (
          <ReadinessPanel readiness={generation.readiness} />
        )}
      </div>
    </div>
  );
}
