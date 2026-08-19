"use client";

import React, { useState } from "react";
import { IndianRupee, Sparkles, Clock, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";

export default function FairPricingWidget() {
  const [materialCost, setMaterialCost] = useState<number>(450);
  const [craftDays, setCraftDays] = useState<number>(2);
  const [techniqueComplexity, setTechniqueComplexity] = useState<"standard" | "master" | "heritage">("master");

  const hourlyRate = 120; // fair living wage for Indian master artisans
  const laborCost = craftDays * 7 * hourlyRate;

  const multiplier =
    techniqueComplexity === "standard" ? 1.4 : techniqueComplexity === "master" ? 1.8 : 2.4;

  const floorPrice = Math.round((materialCost + laborCost * 0.7) * 1.15);
  const recommendedPrice = Math.round((materialCost + laborCost) * multiplier);
  const premiumPrice = Math.round(recommendedPrice * 1.45);

  return (
    <section id="pricing-calculator" className="py-20 bg-[#FAF7F2] border-b border-[#D8D0C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A88752]/10 text-[#A88752] border border-[#A88752]/30 text-xs font-mono uppercase tracking-wider mb-4">
              <Sparkles className="size-3.5 text-[#B85C43]" />
              Artisan Fair Pricing Engine
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E211F] tracking-tight">
              Transparent Pricing. Zero Middleman Exploitation.
            </h2>
            <p className="text-sm sm:text-base text-[#68655F] mt-4 leading-relaxed">
              Traditional artisans frequently undersell their masterpieces due to lack of market data. VISART automatically calculates fair market price bounds based on raw material expenses, living labor wages, and heritage complexity.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Interactive Calculator Inputs */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#D8D0C4] shadow-sm space-y-6">
            <h3 className="font-serif-editorial text-xl font-bold text-[#1E211F]">
              Simulate Craft Fair Value
            </h3>

            {/* Material Cost Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#1E211F]">
                <span>Raw Material Cost</span>
                <span className="font-serif-editorial text-sm text-[#B85C43]">₹{materialCost}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
                className="w-full accent-[#B85C43]"
              />
              <div className="flex justify-between text-[10px] text-[#68655F]">
                <span>₹100 (Clay / Fibers)</span>
                <span>₹3,000 (Pure Silver / Silk)</span>
              </div>
            </div>

            {/* Crafting Time Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#1E211F]">
                <span>Crafting Duration</span>
                <span className="font-serif-editorial text-sm text-[#B85C43]">
                  {craftDays} {craftDays === 1 ? "Day" : "Days"} (~{craftDays * 7} hours)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                step="1"
                value={craftDays}
                onChange={(e) => setCraftDays(Number(e.target.value))}
                className="w-full accent-[#B85C43]"
              />
              <div className="flex justify-between text-[10px] text-[#68655F]">
                <span>1 Day</span>
                <span>14 Days (Intricate Masterwork)</span>
              </div>
            </div>

            {/* Technique Tier */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#1E211F]">
                Technique Heritage Complexity
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "standard", label: "Traditional" },
                  { id: "master", label: "GI Mastercraft" },
                  { id: "heritage", label: "Heirloom Grade" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setTechniqueComplexity(tier.id as any)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                      techniqueComplexity === tier.id
                        ? "bg-[#1E211F] text-[#FBF8F2] border-[#1E211F] shadow-xs"
                        : "bg-[#F5F0E8] text-[#68655F] border-[#D8D0C4] hover:border-[#1E211F]"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Output Breakdown */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#1E211F] to-[#27344A] text-[#FBF8F2] p-6 sm:p-8 rounded-3xl border border-[#2E3330] shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A88752]">
                Recommended Price Guidance
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-bold">
                100% Fair Wage Guaranteed
              </span>
            </div>

            <div>
              <span className="text-xs text-[#D8D0C4]">Suggested Fair Market Price:</span>
              <p className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#FBF8F2] mt-1">
                ₹{recommendedPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-[#A88752] mt-1">
                Ensures fair artisan take-home margin of ₹{(recommendedPrice - materialCost).toLocaleString("en-IN")}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
              <div className="bg-[#1E211F]/70 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[#A88752] block text-[11px]">Direct Wholesale Floor:</span>
                <span className="font-serif-editorial text-lg font-bold text-[#FBF8F2]">
                  ₹{floorPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="bg-[#1E211F]/70 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[#A88752] block text-[11px]">Premium Gallery Valuation:</span>
                <span className="font-serif-editorial text-lg font-bold text-[#FBF8F2]">
                  ₹{premiumPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <Link
              href="/create"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#B85C43] hover:bg-[#9E4730] text-white text-xs font-bold rounded-xl shadow-md transition-all group"
            >
              <span>Generate Listing with Price Guidance</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
