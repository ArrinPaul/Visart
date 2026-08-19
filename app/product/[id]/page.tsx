import React from "react";
import type { Metadata } from "next";
import { getProductById } from "@/lib/supabase/products";
import { ProductView } from "@/components/product/ProductView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getProductFeedback } from "@/lib/supabase/feedback";
import { generateAuthenticityAudit } from "@/lib/ai/authenticity";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found — VISART",
    };
  }

  return {
    title: `${product.generated_data.product.title} — VISART Craft Catalogue`,
    description: product.generated_data.product.shortDescription,
    openGraph: {
      title: product.generated_data.product.title,
      description: product.generated_data.product.shortDescription,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#FBF8F2] border border-[#D8D0C4] p-8 rounded-2xl space-y-4 shadow-sm">
          <h1 className="font-serif-editorial text-2xl font-bold text-[#1E211F]">
            Product Listing Not Found
          </h1>
          <p className="text-sm text-[#68655F]">
            The craft listing you are looking for may have expired or is unavailable.
          </p>
          <div className="pt-2">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#27344A] text-[#FBF8F2] rounded-xl text-xs font-semibold hover:bg-[#1E211F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Workspace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const feedbacks = await getProductFeedback(id);
  const audit = await generateAuthenticityAudit(product, feedbacks);

  return <ProductView product={product} initialFeedbacks={feedbacks} initialAudit={audit} />;
}
