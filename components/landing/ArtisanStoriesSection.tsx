"use client";

import React from "react";
import { Quote, Sparkles, MapPin, Award } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";

export default function ArtisanStoriesSection() {
  const stories = [
    {
      name: "Pabitra Das",
      craft: "Barpeta Bamboo & Cane",
      location: "Barpeta, Assam",
      quote:
        "Before VISART, city buyers bought our bamboo baskets for ₹400 and sold them in boutique stores for ₹2,500. With VISART's fair pricing guidance and Hindi catalogue, we now sell directly at ₹1,200.",
      impact: "+180% Income Margin",
      image:
        "https://images.unsplash.com/photo-1590845947698-8924d7409b56?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Mohammad Abdul Rauf",
      craft: "Master Bidriware Inlayer",
      location: "Bidar, Karnataka",
      quote:
        "I don't know English or Instagram hashtags. I only spoke into the VISART microphone about our 99.9% pure silver inlay and soil oxidation. It generated a five-star international story in 3 minutes.",
      impact: "7 Direct Corporate Inquiries",
      image:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Smt. Shanti Devi",
      craft: "Mithila Folk Painting",
      location: "Madhubani, Bihar",
      quote:
        "People kept buying cheap screen-printed paper thinking it was Madhubani. VISART's authenticity badge highlights our natural twig nib strokes and organic cow-dung primed canvas.",
      impact: "100% Genuine Certified",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="py-20 bg-[#F5F0E8] border-b border-[#D8D0C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A88752]/10 text-[#A88752] border border-[#A88752]/30 text-xs font-mono uppercase tracking-wider mb-4">
              <Award className="size-3.5 text-[#B85C43]" />
              Artisan Impact & Heritage Voices
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E211F] tracking-tight">
              Real Craftspeople. Real Livelihoods.
            </h2>
            <p className="text-sm sm:text-base text-[#68655F] mt-4 leading-relaxed">
              Listen to how master artisans across Indian states are transforming generational heritage into thriving independent digital businesses.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((s, idx) => (
            <FadeIn key={idx} delay={idx * 0.15} direction="up">
              <div className="bg-white rounded-3xl border border-[#D8D0C4] p-8 shadow-sm hover:shadow-xl hover:border-[#B85C43]/50 transition-all flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <Quote className="size-8 text-[#A88752]/40" />
                  <p className="font-serif-editorial text-base text-[#1E211F] italic leading-relaxed">
                    "{s.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EBE3D5] flex items-center justify-between">
                  <div>
                    <h4 className="font-serif-editorial text-base font-bold text-[#1E211F]">
                      {s.name}
                    </h4>
                    <p className="text-xs text-[#A88752] font-semibold">{s.craft}</p>
                    <p className="text-[11px] text-[#68655F] flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-[#B85C43]" />
                      {s.location}
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
                    {s.impact}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
