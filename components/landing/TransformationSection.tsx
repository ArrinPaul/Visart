"use client";

import React from "react";
import FadeIn from "@/components/motion/FadeIn";
import Score from "@/components/ui/Score";
import Badge from "@/components/ui/Badge";
import { Sparkles, Check, Globe } from "lucide-react";

export default function TransformationSection() {
  return (
    <section className="py-20 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest uppercase text-[#A88752] font-semibold">
              THE AI TRANSFORMATION
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#1E211F] mt-2">
              From raw craft photo to market-ready listing
            </h2>
            <p className="text-base text-[#68655F] mt-3">
              See how simple artisan inputs are transformed into a complete commercial presentation.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* INPUT CARD */}
          <div className="lg:col-span-5">
            <FadeIn direction="right">
              <div className="bg-[#FBF8F2] border border-[#D8D0C4] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
                  <span className="text-xs font-mono tracking-widest uppercase text-[#68655F]">
                    INPUT FROM ARTISAN
                  </span>
                  <Badge variant="terracotta">1 Photo + 4 Facts</Badge>
                </div>

                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#D8D0C4] bg-[#F5F0E8]">
                  <img
                    src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800"
                    alt="Bamboo Basket"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#F5F0E8] p-4 rounded-xl border border-[#D8D0C4]">
                  <div>
                    <span className="text-[#68655F]">Product:</span>
                    <p className="font-semibold text-[#1E211F]">Bamboo Basket</p>
                  </div>
                  <div>
                    <span className="text-[#68655F]">Cost:</span>
                    <p className="font-semibold text-[#1E211F]">₹450</p>
                  </div>
                  <div>
                    <span className="text-[#68655F]">Time:</span>
                    <p className="font-semibold text-[#1E211F]">2 days</p>
                  </div>
                  <div>
                    <span className="text-[#68655F]">Location:</span>
                    <p className="font-semibold text-[#1E211F]">Assam</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* TRANSFORMATION ARROW */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center my-4 lg:my-0">
            <div className="w-14 h-14 rounded-full bg-[#27344A] text-[#B85C43] flex items-center justify-center shadow-md border border-[#A88752]">
              <Sparkles className="w-7 h-7 text-[#A88752] animate-spin-slow" />
            </div>
            <span className="text-xs font-serif-editorial font-bold text-[#1E211F] mt-2 tracking-wider uppercase">
              VISART AI
            </span>
          </div>

          {/* OUTPUT CARD */}
          <div className="lg:col-span-5">
            <FadeIn direction="left">
              <div className="bg-[#27344A] text-[#FBF8F2] border border-[#A88752]/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#A88752]/30 pb-3">
                  <span className="text-xs font-mono tracking-widest uppercase text-[#A88752]">
                    GENERATED DIGITAL OUTPUT
                  </span>
                  <Score score={82} size="sm" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-serif-editorial text-xl font-bold text-[#FBF8F2]">
                    Handcrafted Assamese Bamboo Basket
                  </h3>
                  <p className="text-xs text-[#F5F0E8]/80 line-clamp-2">
                    A durable, handwoven storage basket made from sustainable golden bamboo in Assam using traditional techniques...
                  </p>
                </div>

                <div className="bg-[#1E211F]/80 p-4 rounded-xl border border-[#A88752]/30 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#A88752]">Recommended Price:</span>
                    <p className="text-lg font-bold text-[#FBF8F2]">₹999</p>
                  </div>
                  <div>
                    <span className="text-[#A88752]">Readiness Score:</span>
                    <p className="text-lg font-bold text-[#54745A]">82 / 100</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="bg-[#FBF8F2]/10 px-2.5 py-1 rounded-full border border-[#FBF8F2]/20 flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#54745A]" /> Instagram Post
                  </span>
                  <span className="bg-[#FBF8F2]/10 px-2.5 py-1 rounded-full border border-[#FBF8F2]/20 flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#54745A]" /> WhatsApp Direct
                  </span>
                  <span className="bg-[#FBF8F2]/10 px-2.5 py-1 rounded-full border border-[#FBF8F2]/20 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#A88752]" /> Hindi & Kannada
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
