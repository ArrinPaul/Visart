"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import Score from "@/components/ui/Score";
import {
  CheckCircle2,
  Circle,
  Lightbulb,
  Camera,
  FileText,
  Search,
  Tag,
  Share2,
  Sparkles,
} from "lucide-react";
import { AudioPlayerControl } from "@/components/ui/AudioPlayerControl";

interface ReadinessPanelProps {
  readiness: VisartGeneration["readiness"];
}

interface CategoryGuidance {
  label: string;
  score: number;
  icon: any;
  whyItMatters: string;
  action: string;
}

export default function ReadinessPanel({ readiness }: ReadinessPanelProps) {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const toggleAction = (index: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const categories: CategoryGuidance[] = [
    {
      label: "Photography",
      score: readiness.photography,
      icon: Camera,
      whyItMatters: "High-clarity texture photos increase buyer trust by over 40%.",
      action:
        readiness.photography >= 80
          ? "Good photo quality. Consider adding 1 tactile detail close-up."
          : "Take 1 bright photo near a natural window showing material texture and size perspective.",
    },
    {
      label: "Story & Description",
      score: readiness.description,
      icon: FileText,
      whyItMatters: "Editorial details justify fair-trade pricing over mass-manufactured goods.",
      action:
        readiness.description >= 85
          ? "Strong artisan narrative. Review the story in your native language tab."
          : "Highlight specific crafting steps and hours spent to reinforce authenticity.",
    },
    {
      label: "Discoverability & Search",
      score: readiness.discoverability,
      icon: Search,
      whyItMatters: "Accurate keywords help urban and international buyers find regional crafts.",
      action:
        readiness.discoverability >= 80
          ? "Keywords are well-indexed for digital discovery."
          : "Include material name, region, and functional utility in product keywords.",
    },
    {
      label: "Pricing Transparency",
      score: readiness.pricingPresentation,
      icon: Tag,
      whyItMatters: "Clear cost rationale reassures buyers they are supporting fair artisan wages.",
      action:
        readiness.pricingPresentation >= 80
          ? "Solid 3-tier price breakdown established."
          : "Share the 3-point pricing rationale when negotiating custom orders.",
    },
    {
      label: "Marketing & Reach",
      score: readiness.marketing,
      icon: Share2,
      whyItMatters: "Direct WhatsApp and social templates allow immediate customer broadcasts.",
      action:
        readiness.marketing >= 80
          ? "Ready for WhatsApp broadcasts and Instagram posts."
          : "Send the WhatsApp product link to 5 existing repeat customers today.",
    },
  ];

  const narrationText = `Digital readiness score is ${readiness.overall} out of 100. Top three next moves are: First, ${readiness.topActions[0] || "improve product photography"}. Second, ${readiness.topActions[1] || "clarify craft story"}. Third, ${readiness.topActions[2] || "share WhatsApp catalog"}.`;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Assessment Banner */}
      <Card className="bg-[#F5F0E8] border border-[#D8D0C4] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B85C43] font-semibold">
              DIGITAL READINESS ASSESSMENT
            </span>
            <span className="text-[#D8D0C4]">•</span>
            <span className="text-xs font-mono text-[#68655F]">
              {readiness.overall >= 80 ? "Market Ready" : "Optimization Recommended"}
            </span>
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1E211F]">
            Market Readiness Score
          </h2>
          <p className="text-sm text-[#68655F] max-w-lg leading-relaxed">
            Measures how completely your craft listing is prepared for digital marketplaces, search discoverability, and buyer confidence.
          </p>

          <div className="pt-2">
            <AudioPlayerControl
              text={narrationText}
              label="Listen to Readiness Advice"
              variant="compact"
            />
          </div>
        </div>

        <Score score={readiness.overall} size="lg" />
      </Card>

      {/* Top 3 Interactive Action Plan */}
      <Card className="flex flex-col gap-4 bg-[#FBF8F2] border-[#D8D0C4]">
        <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B85C43]" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
              Your Top 3 Next Moves
            </h3>
          </div>
          <span className="text-xs font-mono text-[#B85C43] uppercase tracking-wider font-semibold">
            Interactive Checklist
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {readiness.topActions.map((action, i) => {
            const isDone = !!completedActions[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleAction(i)}
                aria-pressed={isDone}
                className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                  isDone
                    ? "bg-[#54745A]/10 border-[#54745A]/30 text-[#54745A]"
                    : "bg-[#F5F0E8] border-[#D8D0C4] hover:border-[#B85C43]/40 text-[#1E211F]"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[#54745A]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#68655F]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#68655F]">
                      Move 0{i + 1}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-semibold text-[#54745A] bg-[#54745A]/15 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDone ? "line-through text-[#68655F]" : "font-medium text-[#1E211F]"
                    }`}
                  >
                    {action}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Category Diagnostic Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="font-serif-editorial text-xl font-bold text-[#1E211F]">
          Detailed Category Diagnostic
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.label}
                className="flex flex-col justify-between p-5 bg-[#FBF8F2] border border-[#D8D0C4] space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#D8D0C4]/60 pb-3 mb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1E211F]">
                      <div className="w-7 h-7 rounded-lg bg-[#27344A]/10 text-[#27344A] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{cat.label}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#F5F0E8] border border-[#D8D0C4] rounded-lg text-[#1E211F]">
                      {cat.score} / 100
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#F5F0E8] rounded-full overflow-hidden border border-[#D8D0C4] mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.score >= 80
                          ? "bg-[#54745A]"
                          : cat.score >= 60
                          ? "bg-[#A88752]"
                          : "bg-[#B85C43]"
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-[#68655F]">
                      <strong className="text-[#1E211F]">Why it matters:</strong> {cat.whyItMatters}
                    </p>
                    <div className="p-2.5 bg-[#F5F0E8] rounded-lg border border-[#D8D0C4]/60 flex items-start gap-2 text-xs text-[#1E211F]">
                      <Lightbulb className="w-3.5 h-3.5 text-[#B85C43] shrink-0 mt-0.5" />
                      <span>{cat.action}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

