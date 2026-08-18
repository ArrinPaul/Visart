"use client";

import React from "react";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import { PlusCircle, ArrowRight, Sparkles } from "lucide-react";
import { demoProduct } from "@/lib/demo/demoProduct";

export default function Hero() {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <FadeIn delay={0.1} direction="up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A88752]/10 text-[#A88752] border border-[#A88752]/30 text-xs font-mono tracking-wider uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#B85C43]" />
                Visart AI Craft Platform
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
              <p className="text-lg sm:text-xl text-[#68655F] mt-6 max-w-xl leading-relaxed">
                Show VISART what you make. We'll help turn it into a market-ready digital story, price guidance, and multilingual customer reach.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} direction="up" className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
                <Button href="/create" size="lg" variant="secondary" className="w-full sm:w-auto shadow-md">
                  <PlusCircle className="w-5 h-5" />
                  <span>Create my listing</span>
                </Button>

                <Button href="#how-it-works" size="lg" variant="outline" className="w-full sm:w-auto">
                  <span>See how it works</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.5} direction="up">
              <div className="flex items-center gap-6 mt-10 text-xs text-[#68655F] border-t border-[#D8D0C4] pt-6 font-mono">
                <span>✓ No digital fluency required</span>
                <span>•</span>
                <span>✓ 5-Minute creation</span>
                <span>•</span>
                <span>✓ Multilingual reach</span>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Dominant Editorial Product Photography */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.3} direction="left">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-[#D8D0C4] bg-[#FBF8F2] shadow-xl group">
                <img
                  src={demoProduct.product.imageUrl}
                  alt={demoProduct.product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Craft Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#FBF8F2]/90 backdrop-blur-md p-4 rounded-2xl border border-[#D8D0C4] shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#A88752] font-semibold block">
                      Authentic Indian Craft
                    </span>
                    <h4 className="font-serif-editorial text-base font-bold text-[#1E211F]">
                      {demoProduct.product.title}
                    </h4>
                  </div>
                  <span className="font-serif-editorial text-lg font-bold text-[#B85C43]">
                    ₹{demoProduct.pricing.recommended.toLocaleString("en-IN")}
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
