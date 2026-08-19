"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import {
  PlusCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Globe2,
  IndianRupee,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { SEED_PRODUCTS } from "@/lib/data/seed";

export default function Hero() {
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const featuredCrafts = SEED_PRODUCTS.slice(0, 3);
  const activeCraft = featuredCrafts[selectedProductIdx];

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden bg-[#F5F0E8] border-b border-[#D8D0C4]">
      {/* Editorial Decorative Background Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#A88752]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <FadeIn delay={0.1} direction="up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A88752]/10 text-[#A88752] border border-[#A88752]/30 text-xs font-mono tracking-wider uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#B85C43]" />
                Visart AI Craft Platform • InHack 2026
              </div>
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <h1 className="font-serif-editorial text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1E211F] leading-[1.05] tracking-tight">
                YOUR CRAFT. <br />
                <span className="text-[#B85C43] italic">DIGITALLY</span> <br />
                UNDERSTOOD.
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} direction="up">
              <p className="text-base sm:text-xl text-[#68655F] mt-6 max-w-xl leading-relaxed">
                Show VISART what you make. We turn raw artisan photos and spoken native dialect into commercial listings, transparent price guidance, and multilingual buyer reach.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} direction="up" className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
                <Button href="/create" size="lg" variant="secondary" className="w-full sm:w-auto shadow-md">
                  <PlusCircle className="w-5 h-5" />
                  <span>Create my listing</span>
                </Button>

                <Button href="/admin" size="lg" variant="outline" className="w-full sm:w-auto bg-white/80">
                  <span>Explore Admin & CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.5} direction="up">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-10 text-xs text-[#68655F] border-t border-[#D8D0C4] pt-6 font-mono">
                <span className="flex items-center gap-1">✓ No digital fluency needed</span>
                <span>•</span>
                <span className="flex items-center gap-1">✓ 100% Fair Price Guidance</span>
                <span>•</span>
                <span className="flex items-center gap-1">✓ Multilingual Audio & Story</span>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Interactive Featured Craft Showcase Card */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.3} direction="left">
              <div className="relative w-full rounded-3xl overflow-hidden border border-[#D8D0C4] bg-white shadow-2xl group flex flex-col">
                {/* Visual Image */}
                <div className="relative w-full aspect-[4/3] bg-[#EBE3D5] overflow-hidden">
                  <img
                    src={activeCraft.image_url || activeCraft.generated_data.product.imageUrl}
                    alt={activeCraft.generated_data.product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E211F]/80 backdrop-blur-md text-white text-[11px] font-mono">
                    <ShieldCheck className="size-3 text-[#A88752]" />
                    <span>GI Verified Handcraft</span>
                  </div>

                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1E211F] text-[11px] font-bold shadow-xs">
                    {activeCraft.generated_data.readiness?.overall || 94}% Readiness
                  </div>
                </div>

                {/* Craft Details Box */}
                <div className="p-6 bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A88752] font-semibold block">
                        {activeCraft.generated_data.product.category}
                      </span>
                      <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F] line-clamp-1">
                        {activeCraft.generated_data.product.title}
                      </h3>
                      <p className="text-xs text-[#68655F] mt-0.5">
                        By {activeCraft.artisan?.name} ({activeCraft.artisan?.location?.split(",")[0]})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#68655F] block">Fair Valuation</span>
                      <span className="font-serif-editorial text-xl font-bold text-[#B85C43]">
                        ₹{activeCraft.generated_data.pricing.recommended.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Switcher Tabs */}
                  <div className="pt-3 border-t border-[#EBE3D5] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#68655F]">Featured Masterworks:</span>
                    <div className="flex items-center gap-1.5">
                      {featuredCrafts.map((craft, idx) => (
                        <button
                          key={craft.id}
                          onClick={() => setSelectedProductIdx(idx)}
                          className={`size-7 rounded-lg text-xs font-bold transition-all ${
                            selectedProductIdx === idx
                              ? "bg-[#B85C43] text-white shadow-xs"
                              : "bg-[#F5F0E8] text-[#68655F] hover:bg-[#EBE3D5]"
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/product/${activeCraft.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FAF7F2] hover:bg-[#1E211F] hover:text-white text-[#1E211F] text-xs font-bold rounded-xl border border-[#D8D0C4] transition-all"
                  >
                    <span>Inspect Full Digital Provenance</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
