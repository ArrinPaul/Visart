"use client";

import React from "react";
import FadeIn from "@/components/motion/FadeIn";
import { Camera, Sparkles, Share2, ArrowRight } from "lucide-react";

export default function ProblemSection() {
  const steps = [
    {
      num: "01",
      icon: Camera,
      title: "Snap & Speak",
      subtitle: "Zero Technical Hassle",
      desc: "Upload 1 photo and speak naturally in Hindi, Kannada, Assamese, or English. VISART captures your craft story without complex forms.",
      badge: "Voice-First Input",
    },
    {
      num: "02",
      icon: Sparkles,
      title: "AI Provenance Engine",
      subtitle: "Story, Pricing & Translations",
      desc: "Gemini AI analyzes craft techniques, computes transparent fair pricing bounds, generates artisan stories, and crafts translations.",
      badge: "Multilingual Intelligence",
    },
    {
      num: "03",
      icon: Share2,
      title: "Instant Buyer Reach",
      subtitle: "Global & Local Discovery",
      desc: "Get a live shareable catalogue link, 1-click WhatsApp direct broadcast, and Instagram marketing copy ready to convert.",
      badge: "Commercial Impact",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FBF8F2] border-b border-[#D8D0C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B85C43] font-semibold">
              THE 3-STEP ARTISAN FLOW
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E211F] mt-2">
              You know your craft. <br />
              You shouldn't have to learn the internet.
            </h2>
            <p className="text-sm sm:text-base text-[#68655F] mt-4 leading-relaxed">
              Generational Indian craftspeople spend days creating heritage products but struggle to turn them into digital listings. VISART bridges that gap in under 3 minutes.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((p, idx) => {
            const Icon = p.icon;
            return (
              <FadeIn key={p.num} delay={idx * 0.15} direction="up">
                <div className="flex flex-col justify-between p-8 rounded-3xl bg-[#F5F0E8] border border-[#D8D0C4] h-full hover:border-[#1E211F] hover:shadow-lg transition-all group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif-editorial text-4xl font-bold text-[#A88752]">
                        {p.num}
                      </span>
                      <div className="size-11 rounded-2xl bg-white border border-[#D8D0C4] flex items-center justify-center text-[#B85C43] group-hover:bg-[#B85C43] group-hover:text-white transition-colors">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A88752] font-semibold block">
                        {p.subtitle}
                      </span>
                      <h3 className="font-serif-editorial text-2xl font-bold text-[#1E211F] mt-0.5">
                        {p.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#68655F] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#D8D0C4] flex items-center justify-between text-xs font-semibold text-[#1E211F]">
                    <span>{p.badge}</span>
                    <ArrowRight className="size-4 text-[#B85C43] group-hover:translate-x-1 transition-transform" />
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
