"use client";

import React, { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import Score from "@/components/ui/Score";
import Badge from "@/components/ui/Badge";
import { Sparkles, Check, Globe2, IndianRupee, Layers } from "lucide-react";
import { demoProduct } from "@/lib/demo/demoProduct";

export default function TransformationSection() {
  return (
    <section className="py-20 bg-[#F5F0E8] border-b border-[#D8D0C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest uppercase text-[#A88752] font-semibold">
              THE AI TRANSFORMATION
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E211F] mt-2">
              From Raw Craft Photo to Market-Ready Listing
            </h2>
            <p className="text-sm sm:text-base text-[#68655F] mt-3 leading-relaxed">
              Watch how 1 raw workshop photo and basic artisan facts are instantly transformed into a commercial presentation.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* INPUT CARD */}
          <div className="lg:col-span-5">
            <FadeIn direction="right">
              <div className="bg-[#FBF8F2] border border-[#D8D0C4] rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
                  <span className="text-xs font-mono tracking-widest uppercase text-[#68655F]">
                    ARTISAN INPUT
                  </span>
                  <Badge variant="terracotta">1 Photo + 4 Facts</Badge>
                </div>

                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#D8D0C4] bg-[#F5F0E8]">
                  <img
                    src={demoProduct.product.imageUrl}
                    alt={demoProduct.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#F5F0E8] p-4 rounded-2xl border border-[#D8D0C4]">
                  <div>
                    <span className="text-[#68655F]">Craft:</span>
                    <p className="font-semibold text-[#1E211F] truncate">Bamboo Basket</p>
                  </div>
                  <div>
                    <span className="text-[#68655F]">Raw Material:</span>
                    <p className="font-semibold text-[#1E211F]">₹450 Cane</p>
                  </div>
                  <div>
                    <span className="text-[#68655F]">Work Time:</span>
                    <p className="font-semibold text-[#1E211F]">2 Days</p>
                  </div>
                  <div>
                    <span className="text-[#68655F]">Origin:</span>
                    <p className="font-semibold text-[#1E211F]">Barpeta, Assam</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* TRANSFORMATION ARROW */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center my-4 lg:my-0">
            <div className="size-16 rounded-3xl bg-[#1E211F] text-[#B85C43] flex items-center justify-center shadow-xl border border-[#A88752]">
              <Sparkles className="size-8 text-[#A88752] animate-spin-slow" />
            </div>
            <span className="text-xs font-serif-editorial font-bold text-[#1E211F] mt-2.5 tracking-wider uppercase">
              VISART AI
            </span>
          </div>

          {/* OUTPUT CARD */}
          <div className="lg:col-span-5">
            <FadeIn direction="left">
              <div className="bg-[#1E211F] text-[#FBF8F2] border border-[#2E3330] rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono tracking-widest uppercase text-[#A88752]">
                    GENERATED DIGITAL SUITE
                  </span>
                  <Score score={demoProduct.readiness.overall} size="sm" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif-editorial text-xl font-bold text-[#FBF8F2]">
                    {demoProduct.product.title}
                  </h3>
                  <p className="text-xs text-[#D8D0C4] line-clamp-2 leading-relaxed">
                    {demoProduct.product.shortDescription}
                  </p>
                </div>

                <div className="bg-[#27344A]/60 p-4 rounded-2xl border border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#A88752]">Fair Pricing Guidance:</span>
                    <p className="font-serif-editorial text-xl font-bold text-[#FBF8F2]">
                      ₹{demoProduct.pricing.recommended.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#A88752]">Readiness Index:</span>
                    <p className="font-serif-editorial text-xl font-bold text-emerald-400">
                      {demoProduct.readiness.overall} / 100
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1">
                    <Check className="size-3 text-emerald-400" /> WhatsApp Broadcast
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1">
                    <Check className="size-3 text-emerald-400" /> Instagram Copy
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1">
                    <Globe2 className="size-3 text-[#A88752]" /> Hindi & Kannada
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
