"use client";

import React from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import Score from "@/components/ui/Score";

interface ReadinessPanelProps {
  readiness: VisartGeneration["readiness"];
}

export default function ReadinessPanel({ readiness }: ReadinessPanelProps) {
  const categories = [
    { label: "Photography", score: readiness.photography },
    { label: "Description", score: readiness.description },
    { label: "Discoverability", score: readiness.discoverability },
    { label: "Pricing", score: readiness.pricingPresentation },
    { label: "Marketing", score: readiness.marketing },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <Card className="bg-[#F5F0E8] border border-[#D8D0C4] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono tracking-widest uppercase text-[#B85C43] font-semibold">
            DIGITAL READINESS ASSESSMENT
          </span>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#1E211F]">
            Market Readiness Score
          </h2>
          <p className="text-sm text-[#68655F] max-w-lg">
            This score measures how completely your craft listing is prepared for digital marketplaces, search discoverability, and buyer confidence.
          </p>
        </div>

        <Score score={readiness.overall} size="lg" />
      </Card>

      {/* Category Breakdown & Top Moves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category breakdown bars */}
        <Card className="flex flex-col gap-4">
          <h3 className="font-serif-editorial text-lg font-semibold text-[#1E211F] border-b border-[#D8D0C4] pb-3">
            Readiness Breakdown
          </h3>

          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <div key={cat.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-[#1E211F] font-semibold">{cat.label}</span>
                  <span className="font-mono text-[#68655F]">{cat.score} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-[#F5F0E8] rounded-full overflow-hidden border border-[#D8D0C4]">
                  <div 
                    className="h-full bg-[#27344A] rounded-full transition-all duration-500" 
                    style={{ width: `${cat.score}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top 3 Actions */}
        <Card className="flex flex-col gap-4 bg-[#FBF8F2] border-[#D8D0C4]">
          <h3 className="font-serif-editorial text-lg font-semibold text-[#1E211F] border-b border-[#D8D0C4] pb-3 flex items-center justify-between">
            <span>YOUR NEXT THREE MOVES</span>
            <span className="text-xs font-mono text-[#B85C43] uppercase tracking-wider font-semibold">
              Action Plan
            </span>
          </h3>

          <div className="flex flex-col gap-3">
            {readiness.topActions.map((action, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#F5F0E8] p-4 rounded-xl border border-[#D8D0C4]">
                <div className="w-6 h-6 rounded-full bg-[#B85C43] text-[#FBF8F2] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  0{i + 1}
                </div>
                <p className="text-sm text-[#1E211F] font-medium leading-relaxed">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
