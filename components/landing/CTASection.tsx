"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import { PlusCircle, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-[#1E211F] text-[#FBF8F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn direction="up">
          <div className="w-12 h-12 rounded-full bg-[#27344A] text-[#B85C43] flex items-center justify-center mx-auto mb-6 border border-[#A88752]">
            <Sparkles className="w-6 h-6 text-[#A88752]" />
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#FBF8F2] leading-tight">
            Ready to show the world what you make?
          </h2>

          <p className="text-base sm:text-lg text-[#F5F0E8]/80 mt-4 max-w-xl mx-auto leading-relaxed">
            Upload one photo and basic craft facts. VISART will generate your market-ready listing, pricing guidance, and multilingual reach in minutes.
          </p>

          <div className="mt-8">
            <Link href="/create">
              <Button size="lg" variant="secondary" className="shadow-lg">
                <PlusCircle className="w-5 h-5" />
                <span>Create my listing</span>
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
