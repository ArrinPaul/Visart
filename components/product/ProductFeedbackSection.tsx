"use client";

import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  UserCheck,
  Plus,
  X,
  MapPin,
  Check,
  Info,
} from "lucide-react";
import type {
  CustomerFeedback,
  FeedbackAuthenticityRating,
  SubmitFeedbackInput,
} from "@/types/feedback";

interface ProductFeedbackSectionProps {
  productId: string;
  initialFeedbacks: CustomerFeedback[];
  isOpenReportModal?: boolean;
  onCloseReportModal?: () => void;
}

export function ProductFeedbackSection({
  productId,
  initialFeedbacks,
  isOpenReportModal = false,
  onCloseReportModal,
}: ProductFeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(initialFeedbacks);
  const [isModalOpen, setIsModalOpen] = useState(isOpenReportModal);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [authenticityRating, setAuthenticityRating] =
    useState<FeedbackAuthenticityRating>("GENUINE_HANDCRAFTED");
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [comment, setComment] = useState("");
  const [materialHonest, setMaterialHonest] = useState(true);
  const [handmadeIrregularities, setHandmadeIrregularities] = useState(true);
  const [finishQualityHigh, setFinishQualityHigh] = useState(true);
  const [packagingSustainable, setPackagingSustainable] = useState(true);
  const [suspectedReason, setSuspectedReason] = useState("");

  const totalReviews = feedbacks.length;
  const avgRating =
    totalReviews > 0
      ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  const genuineCount = feedbacks.filter(
    (f) =>
      f.authenticityRating === "GENUINE_HANDCRAFTED" ||
      f.authenticityRating === "LIKELY_GENUINE"
  ).length;

  const genuinePercent =
    totalReviews > 0 ? Math.round((genuineCount / totalReviews) * 100) : 100;

  const handleOpenModal = (isReportMode = false) => {
    if (isReportMode) {
      setAuthenticityRating("CONFIRMED_FAKE_REPLICA");
      setRating(1);
    } else {
      setAuthenticityRating("GENUINE_HANDCRAFTED");
      setRating(5);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onCloseReportModal) onCloseReportModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    const payload: SubmitFeedbackInput = {
      productId,
      userName: userName.trim() || "Craft Collector",
      userLocation: userLocation.trim() || "India",
      rating,
      authenticityRating,
      comment: comment.trim(),
      craftChecks: {
        materialHonest,
        handmadeIrregularitiesPresent: handmadeIrregularities,
        finishQualityHigh,
        packagingSustainable,
      },
      suspectedCounterfeitReason:
        authenticityRating === "CONFIRMED_FAKE_REPLICA" ||
        authenticityRating === "SUSPICIOUS_QUALITY"
          ? suspectedReason.trim()
          : undefined,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.feedback) {
        setFeedbacks((prev) => [data.feedback, ...prev]);
        setToastMessage("Feedback & Authenticity Assessment recorded successfully!");
        setTimeout(() => setToastMessage(null), 4000);
        handleCloseModal();
        // Reset form
        setComment("");
        setSuspectedReason("");
      } else {
        alert(data.error || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getAuthenticityBadge = (authRating: FeedbackAuthenticityRating) => {
    switch (authRating) {
      case "GENUINE_HANDCRAFTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#54745A]/10 text-[#54745A] border border-[#54745A]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Genuine Handcraft
          </span>
        );
      case "LIKELY_GENUINE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#A88752]/10 text-[#A88752] border border-[#A88752]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Likely Genuine
          </span>
        );
      case "SUSPICIOUS_QUALITY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#B85C43]/15 text-[#B85C43] border border-[#B85C43]/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Discrepancy / Quality Concern
          </span>
        );
      case "CONFIRMED_FAKE_REPLICA":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-700 border border-red-300">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Reported Factory Replica
          </span>
        );
    }
  };

  return (
    <section aria-labelledby="feedback-section-title" className="p-6 sm:p-8 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl shadow-xs space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#54745A] text-[#FBF8F2] rounded-xl flex items-center gap-2 text-xs font-semibold shadow-md animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#D8D0C4] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#B85C43]" />
            <h2 id="feedback-section-title" className="font-serif text-2xl font-bold text-[#1E211F]">
              Buyer Reviews & Authenticity Feedback
            </h2>
          </div>
          <p className="text-xs text-[#68655F]">
            Transparent community reviews paired with real-time Gemini AI anti-counterfeit scanning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenModal(false)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#27344A] hover:bg-[#1E211F] text-[#FBF8F2] rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write Review & Authenticate</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rating Card */}
        <div className="p-4 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl flex items-center gap-4">
          <div className="text-3xl font-serif font-bold text-[#1E211F]">
            {avgRating}
          </div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(Number(avgRating))
                      ? "fill-amber-400 text-amber-500"
                      : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-[#68655F] mt-0.5">
              Based on {totalReviews} buyer reviews
            </p>
          </div>
        </div>

        {/* Authenticity Consensus */}
        <div className="p-4 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl flex items-center gap-4">
          <div className="text-3xl font-serif font-bold text-[#54745A]">
            {genuinePercent}%
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#54745A]">
              <ShieldCheck className="w-4 h-4" />
              <span>Genuine Handcraft</span>
            </div>
            <p className="text-[11px] text-[#68655F] mt-0.5">
              {genuineCount} of {totalReviews} verified handmade
            </p>
          </div>
        </div>

        {/* Gemini AI Pairing */}
        <div className="p-4 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl flex items-center gap-4">
          <div className="p-2.5 bg-[#27344A]/10 text-[#27344A] rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#27344A]">
              Gemini AI Anti-Fake Guard
            </div>
            <p className="text-[11px] text-[#68655F] mt-0.5">
              Continuous fraud monitoring active
            </p>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center bg-[#F5F0E8]/50 border border-dashed border-[#D8D0C4] rounded-2xl space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#A88752] mx-auto opacity-70" />
            <p className="text-sm font-semibold text-[#1E211F]">
              Be the first collector to review & authenticate this craft
            </p>
            <p className="text-xs text-[#68655F]">
              Your feedback protects buyers and empowers verified rural artisans.
            </p>
          </div>
        ) : (
          feedbacks.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3.5 hover:border-[#B85C43]/40 transition-all shadow-2xs"
            >
              {/* Reviewer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#27344A] text-[#FBF8F2] flex items-center justify-center font-bold text-xs">
                    {item.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1E211F]">
                        {item.userName}
                      </span>
                      {item.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#54745A] bg-[#54745A]/10 px-1.5 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    {item.userLocation && (
                      <span className="flex items-center gap-1 text-[11px] text-[#68655F]">
                        <MapPin className="w-3 h-3 text-[#A88752]" />
                        {item.userLocation}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? "fill-amber-400 text-amber-500"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#68655F]">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Authenticity Badge & Verification Criteria */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {getAuthenticityBadge(item.authenticityRating)}

                {item.craftChecks.materialHonest && (
                  <span className="text-[11px] text-[#68655F] bg-[#F5F0E8] px-2 py-0.5 rounded-md border border-[#D8D0C4]">
                    ✓ Authentic Material
                  </span>
                )}
                {item.craftChecks.handmadeIrregularitiesPresent && (
                  <span className="text-[11px] text-[#68655F] bg-[#F5F0E8] px-2 py-0.5 rounded-md border border-[#D8D0C4]">
                    ✓ Natural Handcraft Texture
                  </span>
                )}
                {item.craftChecks.finishQualityHigh && (
                  <span className="text-[11px] text-[#68655F] bg-[#F5F0E8] px-2 py-0.5 rounded-md border border-[#D8D0C4]">
                    ✓ High Quality Finish
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-[#1E211F]/90 leading-relaxed font-sans">
                {item.comment}
              </p>

              {/* Gemini AI Risk Analysis Tag if present */}
              {item.geminiAnalysis && (
                <div className="p-3 bg-[#F5F0E8]/70 border-l-2 border-[#27344A] rounded-r-lg flex items-start gap-2 text-[11px] text-[#27344A]">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Gemini AI Verification:</strong>{" "}
                    {item.geminiAnalysis.counterfeitRiskAssessment}
                  </span>
                </div>
              )}

              {/* Suspected fake reason callout if present */}
              {item.suspectedCounterfeitReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Counterfeit Concern: </span>
                    <span>{item.suspectedCounterfeitReason}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E211F]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#54745A]" />
                <h3 className="font-serif text-xl font-bold text-[#1E211F]">
                  Write Review & Authenticate Craft
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 text-[#68655F] hover:text-[#1E211F] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Authenticity Rating Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E211F]">
                  Craft Authenticity Verdict *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthenticityRating("GENUINE_HANDCRAFTED")}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      authenticityRating === "GENUINE_HANDCRAFTED"
                        ? "bg-[#54745A]/15 border-[#54745A] text-[#1E211F] font-semibold"
                        : "bg-[#F5F0E8] border-[#D8D0C4] text-[#68655F]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[#54745A]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Genuine Handcraft</span>
                    </div>
                    <p className="text-[11px] text-[#68655F] mt-1">
                      Material and craftsmanship match true artisan handmade standards.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthenticityRating("LIKELY_GENUINE")}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      authenticityRating === "LIKELY_GENUINE"
                        ? "bg-[#A88752]/15 border-[#A88752] text-[#1E211F] font-semibold"
                        : "bg-[#F5F0E8] border-[#D8D0C4] text-[#68655F]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[#A88752]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Likely Genuine</span>
                    </div>
                    <p className="text-[11px] text-[#68655F] mt-1">
                      Appears authentic with minor variations.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthenticityRating("SUSPICIOUS_QUALITY")}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      authenticityRating === "SUSPICIOUS_QUALITY"
                        ? "bg-[#B85C43]/20 border-[#B85C43] text-[#1E211F] font-semibold"
                        : "bg-[#F5F0E8] border-[#D8D0C4] text-[#68655F]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[#B85C43]">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Suspicious / Material Discrepancy</span>
                    </div>
                    <p className="text-[11px] text-[#68655F] mt-1">
                      Quality or materials differ from listing description.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthenticityRating("CONFIRMED_FAKE_REPLICA")}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      authenticityRating === "CONFIRMED_FAKE_REPLICA"
                        ? "bg-red-500/20 border-red-500 text-red-950 font-semibold"
                        : "bg-[#F5F0E8] border-[#D8D0C4] text-[#68655F]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Report Fake / Machine Replica</span>
                    </div>
                    <p className="text-[11px] text-[#68655F] mt-1">
                      Industrial mold, synthetic substitute, or factory fake.
                    </p>
                  </button>
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E211F]">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-500"
                            : "text-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1E211F]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Patel"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1E211F]">
                    Your City / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  />
                </div>
              </div>

              {/* Craft Checklist */}
              <div className="space-y-2 p-4 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E211F] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#54745A]" />
                  Tactile Craft Checks Verified by You
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1E211F] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={materialHonest}
                      onChange={(e) => setMaterialHonest(e.target.checked)}
                      className="rounded accent-[#54745A]"
                    />
                    <span>Genuine natural raw material</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={handmadeIrregularities}
                      onChange={(e) => setHandmadeIrregularities(e.target.checked)}
                      className="rounded accent-[#54745A]"
                    />
                    <span>Visible hand-tooling texture</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={finishQualityHigh}
                      onChange={(e) => setFinishQualityHigh(e.target.checked)}
                      className="rounded accent-[#54745A]"
                    />
                    <span>Solid craft joinery & finish</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={packagingSustainable}
                      onChange={(e) => setPackagingSustainable(e.target.checked)}
                      className="rounded accent-[#54745A]"
                    />
                    <span>Sustainable artisan packaging</span>
                  </label>
                </div>
              </div>

              {/* Comment Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E211F]">
                  Your Experience & Authenticity Observations *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the texture, material authenticity, smell, weight, and artisan joinery quality..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              </div>

              {/* If Suspicious or Fake: Counterfeit Details */}
              {(authenticityRating === "CONFIRMED_FAKE_REPLICA" ||
                authenticityRating === "SUSPICIOUS_QUALITY") && (
                <div className="space-y-1 p-3 bg-red-50 border border-red-200 rounded-xl animate-in fade-in">
                  <label className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Specific Counterfeit / Replica Evidence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Plastic mold seam lines on bottom, synthetic smell, lightweight hollow resin..."
                    value={suspectedReason}
                    onChange={(e) => setSuspectedReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-red-300 rounded-lg text-red-950 focus:outline-none"
                  />
                  <p className="text-[11px] text-red-700">
                    Gemini AI will automatically classify this report and trigger an authenticity review on the listing.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D8D0C4]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-[#68655F] hover:text-[#1E211F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#27344A] hover:bg-[#1E211F] disabled:opacity-50 text-[#FBF8F2] rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Submit Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
