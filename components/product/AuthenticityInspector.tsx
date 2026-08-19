"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  Hand,
  FlaskConical,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import type { AuthenticityAudit } from "@/types/feedback";

interface AuthenticityInspectorProps {
  audit: AuthenticityAudit;
  onOpenReportModal?: () => void;
}

export function AuthenticityInspector({
  audit,
  onOpenReportModal,
}: AuthenticityInspectorProps) {
  const [activeTab, setActiveTab] = useState<"guide" | "markers" | "warnings">("guide");
  const [isExpanded, setIsExpanded] = useState(false);

  const getVerdictBadge = () => {
    switch (audit.verdict) {
      case "VERIFIED_AUTHENTIC":
        return {
          bg: "bg-[#54745A]/10 text-[#54745A] border-[#54745A]/30",
          icon: <ShieldCheck className="w-4 h-4 text-[#54745A]" />,
          label: "Gemini AI & Community Verified Authentic",
        };
      case "LIKELY_AUTHENTIC":
        return {
          bg: "bg-[#A88752]/10 text-[#A88752] border-[#A88752]/30",
          icon: <CheckCircle2 className="w-4 h-4 text-[#A88752]" />,
          label: "Likely Authentic Handcraft",
        };
      case "SUSPICIOUS":
        return {
          bg: "bg-[#B85C43]/15 text-[#B85C43] border-[#B85C43]/40",
          icon: <AlertTriangle className="w-4 h-4 text-[#B85C43]" />,
          label: "Under Authenticity Verification",
        };
      default:
        return {
          bg: "bg-red-500/10 text-red-700 border-red-300",
          icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
          label: "High Counterfeit Risk Flagged",
        };
    }
  };

  const badge = getVerdictBadge();

  return (
    <section aria-labelledby="authenticity-section-title" className="p-6 sm:p-7 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl shadow-xs space-y-6">
      {/* Header with AI Badge & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D0C4] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#27344A]/10 rounded-lg text-[#27344A]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 id="authenticity-section-title" className="font-serif text-xl sm:text-2xl font-bold text-[#1E211F]">
              Gemini AI Authenticity Audit
            </h2>
          </div>
          <p className="text-xs text-[#68655F]">
            Cryptographically grounded craft verification, material forensics & anti-counterfeit analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#54745A]">
              {audit.overallScore}%
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#68655F]">
              Authenticity Score
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${badge.bg}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      {/* 3-Pillar Forensic Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-[#68655F]">
            <span>Material Honesty</span>
            <span className="font-bold text-[#1E211F]">{audit.materialIntegrityScore}%</span>
          </div>
          <div className="h-1.5 bg-[#D8D0C4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#54745A] rounded-full transition-all duration-500"
              style={{ width: `${audit.materialIntegrityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#68655F]/90 pt-0.5">
            Verified natural raw medium vs synthetic plastics.
          </p>
        </div>

        <div className="p-3.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-[#68655F]">
            <span>Craft Technique</span>
            <span className="font-bold text-[#1E211F]">{audit.techniqueIntegrityScore}%</span>
          </div>
          <div className="h-1.5 bg-[#D8D0C4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A88752] rounded-full transition-all duration-500"
              style={{ width: `${audit.techniqueIntegrityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#68655F]/90 pt-0.5">
            Manual joinery & tooling vs factory molds.
          </p>
        </div>

        <div className="p-3.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-[#68655F]">
            <span>Fair Wage & Labor Match</span>
            <span className="font-bold text-[#1E211F]">{audit.pricingIntegrityScore}%</span>
          </div>
          <div className="h-1.5 bg-[#D8D0C4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#27344A] rounded-full transition-all duration-500"
              style={{ width: `${audit.pricingIntegrityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#68655F]/90 pt-0.5">
            Realistic compensation for craft duration.
          </p>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-4 bg-[#F5F0E8]/70 border-l-3 border-[#54745A] rounded-r-xl text-xs sm:text-sm text-[#1E211F]/90 leading-relaxed">
        {audit.summary}
      </div>

      {/* Tab Navigation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#D8D0C4]">
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === "guide"
                ? "text-[#B85C43] border-b-2 border-[#B85C43]"
                : "text-[#68655F] hover:text-[#1E211F]"
            }`}
          >
            How to Spot a Fake (Buyer Guide)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("markers")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === "markers"
                ? "text-[#B85C43] border-b-2 border-[#B85C43]"
                : "text-[#68655F] hover:text-[#1E211F]"
            }`}
          >
            Authentic Craft Markers ({audit.authenticMarkers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("warnings")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === "warnings"
                ? "text-[#B85C43] border-b-2 border-[#B85C43]"
                : "text-[#68655F] hover:text-[#1E211F]"
            }`}
          >
            Counterfeit Red Flags
          </button>
        </div>

        {/* Tab 1: How to Spot a Fake Buyer Guide */}
        {activeTab === "guide" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Tactile */}
            <div className="p-4 bg-[#FBF8F2] border border-[#D8D0C4] rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A88752]">
                <Hand className="w-4 h-4" />
                <span>1. Tactile & Weight Check</span>
              </div>
              <ul className="space-y-2 text-xs text-[#68655F]">
                {audit.spotAFakeGuide.tactileChecks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A88752] mt-1.5 flex-shrink-0" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual */}
            <div className="p-4 bg-[#FBF8F2] border border-[#D8D0C4] rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#54745A]">
                <Eye className="w-4 h-4" />
                <span>2. Visual & Tooling Check</span>
              </div>
              <ul className="space-y-2 text-xs text-[#68655F]">
                {audit.spotAFakeGuide.visualChecks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#54745A] mt-1.5 flex-shrink-0" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Material */}
            <div className="p-4 bg-[#FBF8F2] border border-[#D8D0C4] rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#27344A]">
                <FlaskConical className="w-4 h-4" />
                <span>3. Non-Destructive Test</span>
              </div>
              <ul className="space-y-2 text-xs text-[#68655F]">
                {audit.spotAFakeGuide.materialTests.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27344A] mt-1.5 flex-shrink-0" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Authentic Markers */}
        {activeTab === "markers" && (
          <div className="space-y-3 pt-1">
            {audit.authenticMarkers.map((marker, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#F5F0E8]/80 border border-[#D8D0C4] rounded-xl space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#54745A]" />
                  <h4 className="font-serif text-sm font-bold text-[#1E211F]">
                    {marker.trait}
                  </h4>
                </div>
                <p className="text-xs text-[#68655F] leading-relaxed">
                  {marker.description}
                </p>
                <div className="pt-1.5 border-t border-[#D8D0C4]/60 flex items-start gap-2 text-[11px] text-[#27344A]">
                  <span className="font-bold">Verification:</span>
                  <span>{marker.howToVerify}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Red Flags */}
        {activeTab === "warnings" && (
          <div className="space-y-2.5 pt-1">
            {audit.counterfeitWarningSigns.map((warning, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl flex items-start gap-3 text-xs text-red-900"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{warning}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Protection Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#68655F] border-t border-[#D8D0C4]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#54745A]" />
          <span>
            Backed by <strong className="text-[#1E211F]">{audit.communityTrustScore}% Community Consensus</strong> ({audit.totalFeedbackCount} verified reviews)
          </span>
        </div>

        {onOpenReportModal && (
          <button
            type="button"
            onClick={onOpenReportModal}
            className="text-xs font-semibold text-[#B85C43] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Suspected Counterfeit</span>
          </button>
        )}
      </div>
    </section>
  );
}
