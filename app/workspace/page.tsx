"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VisartGeneration } from "@/types/visart";
import { WorkspaceTab } from "@/types/frontend";
import { demoProduct } from "@/lib/demo/demoProduct";
import { getProductById } from "@/lib/supabase/products";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs";
import ListingPanel from "@/components/workspace/ListingPanel";
import PricingPanel from "@/components/workspace/PricingPanel";
import MarketingPanel from "@/components/workspace/MarketingPanel";
import ReachPanel from "@/components/workspace/ReachPanel";
import ReadinessPanel from "@/components/workspace/ReadinessPanel";

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");
  const [generation, setGeneration] = useState<VisartGeneration>(demoProduct);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("LISTING");
  const [activeId, setActiveId] = useState<string>("demo-bamboo-basket");

  useEffect(() => {
    async function loadWorkspaceData() {
      // 1. Try URL param ID
      if (requestedId) {
        setActiveId(requestedId);
        const record = await getProductById(requestedId);
        if (record?.generated_data) {
          setGeneration({
            ...record.generated_data,
            product: {
              ...record.generated_data.product,
              imageUrl: record.image_url || record.generated_data.product.imageUrl,
              location: record.input_data?.location || record.generated_data.product.location,
            },
          });
          return;
        }
      }

      if (typeof window !== "undefined") {
        // 2. Try stored active product ID
        const storedId = sessionStorage.getItem("visart_active_product_id");
        if (storedId) {
          setActiveId(storedId);
          const record = await getProductById(storedId);
          if (record?.generated_data) {
            setGeneration(record.generated_data);
            return;
          }
        }

        // 3. Try stored active generation
        const stored = sessionStorage.getItem("visart_active_generation");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setGeneration(parsed);
            return;
          } catch {
            // Fallback to demo fixture
          }
        }
      }
    }

    loadWorkspaceData();
  }, [requestedId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header Summary */}
      <WorkspaceHeader 
        generation={generation} 
        onSave={() => {
          if (typeof window !== "undefined") {
            window.location.href = `/product/${activeId}`;
          }
        }}
      />

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

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#68655F]">
        Loading workbench...
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
