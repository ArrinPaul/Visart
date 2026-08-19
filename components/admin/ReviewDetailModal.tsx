"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  UserCheck,
  Star,
} from "lucide-react";
import type { ReviewModerationItem } from "@/types/admin";

interface ReviewDetailModalProps {
  review: ReviewModerationItem;
  onClose: () => void;
  onUpdateStatus: (reviewId: string, status: "APPROVED" | "FLAGGED" | "REJECTED") => Promise<void>;
}

export default function ReviewDetailModal({
  review,
  onClose,
  onUpdateStatus,
}: ReviewDetailModalProps) {
  const isHighRisk = review.geminiAnalysis?.riskScore ? review.geminiAnalysis.riskScore > 40 : false;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F5F0E8] w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-[#D8D0C4] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1E211F] text-[#F5F0E8] flex items-center justify-between border-b border-[#2E3330]">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#A88752] flex items-center justify-center text-white">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg font-bold text-[#FBF8F2]">
                Customer Review & Authenticity Audit
              </h2>
              <p className="text-xs text-[#A88752]">Review ID: {review.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-white/10 hover:bg-white/20 text-[#D8D0C4] flex items-center justify-center transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Product & Buyer summary */}
          <div className="p-4 bg-white rounded-xl border border-[#D8D0C4] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#68655F]">Product</p>
              <p className="text-sm font-bold text-[#1E211F]">{review.productTitle}</p>
              <p className="text-xs text-[#A88752] mt-0.5">By {review.artisanName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#68655F]">Buyer</p>
              <p className="text-sm font-bold text-[#1E211F]">{review.userName}</p>
              <p className="text-xs text-[#68655F]">{review.userLocation || "India"}</p>
            </div>
          </div>

          {/* Rating and Comment */}
          <div className="p-4 bg-white rounded-xl border border-[#D8D0C4] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 ${
                      star <= review.rating
                        ? "fill-[#A88752] text-[#A88752]"
                        : "text-[#D8D0C4]"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  review.authenticityRating === "GENUINE_HANDCRAFTED"
                    ? "bg-emerald-100 text-emerald-800"
                    : review.authenticityRating === "CONFIRMED_FAKE_REPLICA"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {review.authenticityRating.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-sm text-[#1E211F] italic pt-1">"{review.comment}"</p>
          </div>

          {/* Craft Checks */}
          <div className="p-4 bg-white rounded-xl border border-[#D8D0C4] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E211F]">
              Handcrafted Verification Checks
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                {review.craftChecks?.materialHonest ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 text-rose-600" />
                )}
                <span>Natural Raw Material</span>
              </div>
              <div className="flex items-center gap-2">
                {review.craftChecks?.handmadeIrregularitiesPresent ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 text-rose-600" />
                )}
                <span>Handmade Irregularities</span>
              </div>
              <div className="flex items-center gap-2">
                {review.craftChecks?.finishQualityHigh ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 text-rose-600" />
                )}
                <span>Master Finish Quality</span>
              </div>
              <div className="flex items-center gap-2">
                {review.craftChecks?.packagingSustainable ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 text-rose-600" />
                )}
                <span>Sustainable Packaging</span>
              </div>
            </div>
          </div>

          {/* Gemini AI Counterfeit Analysis */}
          {review.geminiAnalysis && (
            <div
              className={`p-4 rounded-xl border ${
                isHighRisk
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Sparkles className="size-4 text-[#A88752]" />
                  <span>Gemini AI Counterfeit Risk Assessment</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    isHighRisk ? "bg-rose-200 text-rose-900" : "bg-emerald-200 text-emerald-900"
                  }`}
                >
                  Risk Score: {review.geminiAnalysis.riskScore}/100
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {review.geminiAnalysis.counterfeitRiskAssessment}
              </p>
            </div>
          )}
        </div>

        {/* Footer Moderation Actions */}
        <div className="px-6 py-4 bg-[#EBE3D5] border-t border-[#D8D0C4] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#68655F] hover:bg-white/50 rounded-xl transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await onUpdateStatus(review.id, "FLAGGED");
                onClose();
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Flag for Counterfeit Review
            </button>
            <button
              onClick={async () => {
                await onUpdateStatus(review.id, "APPROVED");
                onClose();
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Approve & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
