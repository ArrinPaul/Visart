"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Eye } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";
import { SEED_PRODUCTS } from "@/lib/data/seed";

export default function CraftCatalogueSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Masterworks" },
    { id: "Bamboo & Cane", label: "Bamboo & Cane" },
    { id: "Metal Inlay Craft", label: "Bidriware Metal" },
    { id: "Traditional Folk Art", label: "Mithila Painting" },
  ];

  const filteredProducts = SEED_PRODUCTS.filter((p) => {
    if (selectedCategory === "all") return true;
    const cat = p.generated_data?.product?.category || "";
    return cat.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <section id="catalogue" className="py-20 bg-[#F5F0E8] border-b border-[#D8D0C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85C43]/10 text-[#B85C43] border border-[#B85C43]/30 text-xs font-mono uppercase tracking-wider mb-4">
                <Sparkles className="size-3.5 text-[#B85C43]" />
                Live Artisan Catalogue
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E211F] tracking-tight">
                Authentic Indian Crafts Digitally Storytold
              </h2>
              <p className="text-sm sm:text-base text-[#68655F] mt-2 max-w-xl">
                Explore real handmade listings generated on VISART with transparent provenance, fair pricing, and multi-language stories.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-[#1E211F] text-[#FBF8F2] shadow-sm"
                      : "bg-white text-[#68655F] border border-[#D8D0C4] hover:border-[#1E211F]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => {
            const title = product.generated_data.product.title;
            const artisanName = product.artisan?.name || "Master Artisan";
            const location = product.artisan?.location || product.input_data?.location || "India";
            const recPrice = product.generated_data.pricing.recommended;
            const readiness = product.generated_data.readiness?.overall || 92;

            return (
              <FadeIn key={product.id} delay={idx * 0.1} direction="up">
                <div className="bg-white rounded-3xl border border-[#D8D0C4] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#B85C43]/50 transition-all group flex flex-col justify-between h-full">
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] bg-[#EBE3D5] overflow-hidden">
                    <img
                      src={product.image_url || product.generated_data.product.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E211F]/80 backdrop-blur-md text-white text-[11px] font-mono">
                      <ShieldCheck className="size-3 text-[#A88752]" />
                      <span>GI Verified</span>
                    </div>

                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1E211F] text-[11px] font-bold shadow-xs">
                      {readiness}% Readiness
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A88752] font-semibold block">
                        {product.generated_data.product.category}
                      </span>
                      <h3 className="font-serif-editorial text-xl font-bold text-[#1E211F] mt-1 group-hover:text-[#B85C43] transition-colors line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-xs text-[#68655F] mt-2 line-clamp-2 leading-relaxed">
                        {product.generated_data.product.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#EBE3D5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#68655F] block">Artisan & Origin</span>
                        <p className="text-xs font-bold text-[#1E211F] flex items-center gap-1">
                          <MapPin className="size-3 text-[#B85C43]" />
                          {artisanName} ({location.split(",")[0]})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#68655F] block">Fair Price</span>
                        <p className="font-serif-editorial text-lg font-bold text-[#B85C43]">
                          ₹{recPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* View Story Action */}
                    <Link
                      href={`/product/${product.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FAF7F2] hover:bg-[#1E211F] hover:text-white text-[#1E211F] text-xs font-bold rounded-xl border border-[#D8D0C4] transition-all group/btn"
                    >
                      <Eye className="size-3.5" />
                      <span>View Multilingual Story Page</span>
                      <ArrowRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
