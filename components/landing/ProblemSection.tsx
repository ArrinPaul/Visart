"use client";

import React from "react";
import FadeIn from "@/components/motion/FadeIn";

export default function ProblemSection() {
  const pillars = [
    {
      num: "01",
      title: "Writing",
      desc: "Turn simple product facts and a photo into a full, professional catalogue listing with search keywords.",
    },
    {
      num: "02",
      title: "Pricing",
      desc: "Get transparent AI-assisted price guidance based on material costs, crafting time, and market benchmarks.",
    },
    {
      num: "03",
      title: "Reach",
      desc: "Prepare customer-ready content across English, Hindi, and Kannada for social media and direct messaging.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FBF8F2] border-y border-[#D8D0C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B85C43] font-semibold">
              THE ARTISAN BARRIER
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#1E211F] mt-2">
              You know your craft. <br />
              You shouldn&apos;t have to learn the internet.
            </h2>
            <p className="text-base text-[#68655F] mt-4 leading-relaxed">
              Craftspeople spend days creating beautiful heritage products but struggle to turn them into digital listings. VISART bridges that gap in three steps.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {pillars.map((p, idx) => (
            <FadeIn key={p.num} delay={idx * 0.15} direction="up">
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#F5F0E8] border border-[#D8D0C4] h-full hover:border-[#1E211F] transition-colors">
                <span className="font-serif-editorial text-4xl font-bold text-[#A88752]">
                  {p.num}
                </span>

                <h3 className="font-serif-editorial text-2xl font-bold text-[#1E211F]">
                  {p.title}
                </h3>

                <p className="text-sm text-[#68655F] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
