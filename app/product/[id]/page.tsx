"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { VisartGeneration } from "@/types/visart";
import { demoProduct } from "@/lib/demo/demoProduct";
import { getProductById } from "@/lib/supabase/products";
import ProductHero from "@/components/product/ProductHero";
import ProductDetails from "@/components/product/ProductDetails";
import ArtisanStory from "@/components/product/ArtisanStory";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [generation, setGeneration] = useState<VisartGeneration>(demoProduct);

  useEffect(() => {
    async function loadProductData() {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (id && id !== "demo-1") {
        const record = await getProductById(id);
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

    loadProductData();
  }, [params?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-4">
        <button
          onClick={() => router.push("/workspace")}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#68655F] hover:text-[#1E211F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </button>

        <span className="text-xs font-mono text-[#A88752] bg-[#A88752]/10 px-3 py-1 rounded-full border border-[#A88752]/30 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B85C43]" />
          VISART Verified Listing Page
        </span>
      </div>

      {/* Hero Section */}
      <ProductHero product={generation.product} pricing={pricingAdapter(generation.pricing)} />

      {/* Details & Specifications */}
      <ProductDetails product={generation.product} translations={generation.translations} />

      {/* Artisan Narrative */}
      <ArtisanStory story={generation.story} />
    </div>
  );
}

function pricingAdapter(pricing: VisartGeneration["pricing"]) {
  return {
    ...pricing,
    currency: "INR" as const,
  };
}
