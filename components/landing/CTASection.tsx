"use client";

import React from "react";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import { PlusCircle, Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-[#1E211F] text-[#FBF8F2] relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#B85C43]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
        <FadeIn direction="up">
          <div className="size-14 rounded-2xl bg-[#27344A] text-[#B85C43] flex items-center justify-center mx-auto mb-6 border border-[#A88752] shadow-lg">
            <Sparkles className="size-7 text-[#A88752]" />
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FBF8F2] leading-tight tracking-tight">
            Ready to Show the World What You Make?
          </h2>

          <p className="text-base sm:text-lg text-[#D8D0C4] mt-4 max-w-2xl mx-auto leading-relaxed">
            Upload one photo and speak about your craft. VISART will generate your market-ready listing, pricing guidance, and multilingual customer reach in under 3 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button href="/create" size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl">
              <PlusCircle className="size-5" />
              <span>Create my listing now</span>
            </Button>

            <Link
              href="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
            >
              <LayoutDashboard className="size-4 text-[#A88752]" />
              <span>Access Admin & CMS</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <p className="text-xs text-[#A88752] font-mono mt-8">
            Free for all rural craftspeople & self-help artisan guilds across India.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
