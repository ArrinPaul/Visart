"use client";

import React from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Info, Tag, CheckCircle2 } from "lucide-react";

interface PricingPanelProps {
  pricing: VisartGeneration["pricing"];
}

export default function PricingPanel({ pricing }: PricingPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Recommended Price Hero Box */}
      <Card className="bg-[#F5F0E8] border border-[#D8D0C4] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <Badge variant="brass" className="w-fit">
            AI-Assisted Price Guidance
          </Badge>
          <span className="text-xs text-[#68655F] uppercase font-mono tracking-wider">
            Suggested Market Range
          </span>
          <div className="text-2xl font-semibold text-[#68655F]">
            ₹{pricing.min.toLocaleString()} — ₹{pricing.max.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#FBF8F2] border border-[#A88752] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center min-w-[240px]">
          <span className="text-xs font-mono tracking-widest uppercase text-[#A88752] font-semibold flex items-center gap-1 mb-1">
            <Tag className="w-3.5 h-3.5 text-[#B85C43]" />
            Recommended Price
          </span>
          <div className="font-serif-editorial text-4xl font-bold text-[#1E211F]">
            ₹{pricing.recommended.toLocaleString()}
          </div>
          <span className="text-xs text-[#54745A] font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Optimal artisan margin
          </span>
        </div>
      </Card>

      {/* Rationale Breakdown */}
      <Card className="flex flex-col gap-4">
        <h3 className="font-serif-editorial text-xl font-semibold text-[#1E211F] border-b border-[#D8D0C4] pb-3">
          Why this pricing range?
        </h3>

        <div className="flex flex-col gap-3">
          {pricing.rationale.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-[#1E211F]">
              <div className="w-6 h-6 rounded-full bg-[#A88752]/10 text-[#A88752] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                0{idx + 1}
              </div>
              <p className="leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D8D0C4] text-xs text-[#68655F] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#A88752] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Disclaimer:</strong> {pricing.disclaimer} This recommendation serves as transparent guidance, allowing you to adjust according to your local buyers and direct production overheads.
        </p>
      </div>
    </div>
  );
}
