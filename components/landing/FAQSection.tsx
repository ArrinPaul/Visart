"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do artisans need prior digital or computer skills to use VISART?",
      a: "No digital fluency is required. An artisan can simply snap a photo on their phone and speak about the craft in their local language (Hindi, Kannada, Assamese, or English). VISART automatically transcribes, generates professional stories, calculates pricing, and produces a live catalogue page.",
    },
    {
      q: "How does the Fair Price Guidance algorithm calculate rates?",
      a: "VISART computes fair price bounds using a transparent mathematical formula: Raw Material Costs + (Master Craft Hours × Fair Regional Living Wage) + Heritage Complexity Multipliers. It provides a Floor Price, Recommended Fair Price, and Premium Gallery Valuation to ensure artisans are never exploited.",
    },
    {
      q: "How does VISART protect against cheap machine-made replicas?",
      a: "VISART incorporates multimodal AI audits and customer review inspection. It checks for natural grain/weave indicators, artisanal hand-chisel marks, and geographical indication (GI) cluster provenance. Machine-printed or plastic molded replicas are flagged by Gemini AI.",
    },
    {
      q: "Which languages are supported for digital storytelling?",
      a: "Currently, VISART generates full digital product descriptions, WhatsApp broadcasts, and voice audio narration in English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ), with support expanding to Assamese, Telugu, and Tamil.",
    },
    {
      q: "Is VISART free for rural artisans and craft self-help groups?",
      a: "Yes. VISART was built as an open artisan empowerment studio for InHack Problem Statement 2, ensuring generational Indian craftspeople have direct, zero-cost access to commercial digital visibility.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#FAF7F2] border-b border-[#D8D0C4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85C43]/10 text-[#B85C43] border border-[#B85C43]/30 text-xs font-mono uppercase tracking-wider mb-4">
              <HelpCircle className="size-3.5 text-[#B85C43]" />
              Frequently Asked Questions
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E211F] tracking-tight">
              Everything You Need to Know About VISART
            </h2>
            <p className="text-sm sm:text-base text-[#68655F] mt-3">
              Clear answers on digital onboarding, fair pricing algorithms, and regional reach.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <FadeIn key={idx} delay={idx * 0.05} direction="up">
                <div className="bg-white rounded-2xl border border-[#D8D0C4] overflow-hidden shadow-xs transition-all">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F5F0E8]/50 transition-colors"
                  >
                    <span className="font-serif-editorial text-lg font-bold text-[#1E211F] pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`size-5 text-[#68655F] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#B85C43]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#68655F] leading-relaxed border-t border-[#EBE3D5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
