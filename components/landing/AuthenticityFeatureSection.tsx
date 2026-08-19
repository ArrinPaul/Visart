"use client";

import React from "react";
import { ShieldCheck, Search, Sparkles, CheckCircle2, AlertTriangle, Eye } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";

export default function AuthenticityFeatureSection() {
  const checks = [
    {
      title: "Microscopic Grain & Weave Inspection",
      desc: "Distinguishes natural hand-split river bamboo, spun raw silk, and hand-chiseled Bidri zinc alloy from injection-molded plastics and synthetic prints.",
    },
    {
      title: "Artisanal Tool Mark Verification",
      desc: "Detects human hand irregularities, organic pigment variance, and natural chisel joinery that machine-printed mass replicas cannot mimic.",
    },
    {
      title: "GI Geographical Cluster Mapping",
      desc: "Validates provenance against recognized Indian GI handicraft clusters and traditional regional artisan guilds.",
    },
    {
      title: "Community Buyer Fraud Reporting",
      desc: "Empowers craft collectors to audit received goods with Gemini AI real-time risk scoring (0–100%) against counterfeit listings.",
    },
  ];

  return (
    <section className="py-20 bg-[#1E211F] text-[#FBF8F2] relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B85C43]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn direction="up">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A88752]/20 text-[#A88752] border border-[#A88752]/30 text-xs font-mono uppercase tracking-wider mb-4">
              <ShieldCheck className="size-3.5 text-[#B85C43]" />
              Authenticity & Anti-Counterfeit Shield
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FBF8F2] tracking-tight">
              Protecting India's Heritage from Machine Replicas
            </h2>
            <p className="text-sm sm:text-base text-[#D8D0C4] mt-4 leading-relaxed">
              Industrial mass manufacturing floods markets with cheap counterfeit copies of handmade Indian crafts. VISART equips genuine artisans and buyers with multi-layered AI authenticity audits.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {checks.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1} direction="up">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#27344A]/40 border border-white/10 hover:border-[#A88752]/50 transition-all flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-[#B85C43] to-[#A88752] flex items-center justify-center text-white shadow-md">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <h3 className="font-serif-editorial text-xl font-bold text-[#FBF8F2]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D8D0C4] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A88752]">
                  <span>AI Authenticity Model Active</span>
                  <span className="font-mono text-[11px] text-emerald-400">✓ Verified Handcraft</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
