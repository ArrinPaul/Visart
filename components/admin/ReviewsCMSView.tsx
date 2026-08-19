"use client";

import React, { useState } from "react";
import {
  MessageSquareCheck,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Sparkles,
} from "lucide-react";
import type { ReviewModerationItem } from "@/types/admin";
import ReviewDetailModal from "./ReviewDetailModal";

interface ReviewsCMSViewProps {
  reviews: ReviewModerationItem[];
  onUpdateStatus: (reviewId: string, status: "APPROVED" | "FLAGGED" | "REJECTED") => Promise<void>;
}

export default function ReviewsCMSView({
  reviews,
  onUpdateStatus,
}: ReviewsCMSViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<ReviewModerationItem | null>(null);

  const filtered = reviews.filter((r) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      r.userName.toLowerCase().includes(query) ||
      (r.productTitle || "").toLowerCase().includes(query) ||
      r.comment.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D8D0C4] shadow-sm">
          <p className="text-xs font-semibold text-[#68655F] uppercase tracking-wider">
            Total Customer Reviews
          </p>
          <p className="font-serif-editorial text-3xl font-bold text-[#1E211F] mt-2">
            {reviews.length}
          </p>
          <p className="text-xs text-emerald-700 mt-1 font-semibold">
            {reviews.filter((r) => r.status === "APPROVED").length} Approved & Live
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8D0C4] shadow-sm">
          <p className="text-xs font-semibold text-[#68655F] uppercase tracking-wider">
            Authenticity Rate
          </p>
          <p className="font-serif-editorial text-3xl font-bold text-emerald-700 mt-2">
            96.4%
          </p>
          <p className="text-xs text-[#68655F] mt-1">Confirmed handmade natural fibers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8D0C4] shadow-sm">
          <p className="text-xs font-semibold text-[#68655F] uppercase tracking-wider">
            Flagged Replicas / Alerts
          </p>
          <p className="font-serif-editorial text-3xl font-bold text-[#B85C43] mt-2">
            {reviews.filter((r) => r.flaggedAsFake || r.status === "FLAGGED").length}
          </p>
          <p className="text-xs text-[#B85C43] mt-1">Requires manual curator verification</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8D0C4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
          <input
            type="text"
            placeholder="Search by buyer, review comment, or product title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs text-[#1E211F] placeholder:text-[#68655F] focus:outline-none focus:border-[#B85C43]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs text-[#1E211F] font-semibold focus:outline-none"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="APPROVED">Approved & Published</option>
            <option value="FLAGGED">Flagged Replicas</option>
            <option value="PENDING">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-[#D8D0C4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#D8D0C4] text-[#68655F] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product & Artisan</th>
                <th className="px-6 py-4">Buyer & Rating</th>
                <th className="px-6 py-4">Authenticity Feedback</th>
                <th className="px-6 py-4">Gemini AI Audit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Moderation Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EBE3D5]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#68655F]">
                    No customer reviews match your search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const isFake = r.authenticityRating === "CONFIRMED_FAKE_REPLICA";
                  const isHighRisk = r.geminiAnalysis?.riskScore ? r.geminiAnalysis.riskScore > 40 : false;

                  return (
                    <tr key={r.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                      {/* Product & Artisan */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#1E211F] text-sm line-clamp-1 max-w-xs">
                          {r.productTitle}
                        </p>
                        <p className="text-[11px] text-[#A88752] mt-0.5">By {r.artisanName}</p>
                      </td>

                      {/* Buyer & Rating */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1E211F]">{r.userName}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`size-3 ${
                                star <= r.rating ? "fill-[#A88752] text-[#A88752]" : "text-[#D8D0C4]"
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Feedback Comment */}
                      <td className="px-6 py-4 max-w-sm">
                        <p className="text-[#1E211F] line-clamp-2 italic">"{r.comment}"</p>
                        <span
                          className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            r.authenticityRating === "GENUINE_HANDCRAFTED"
                              ? "bg-emerald-100 text-emerald-800"
                              : isFake
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.authenticityRating.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Gemini AI Risk */}
                      <td className="px-6 py-4">
                        {r.geminiAnalysis ? (
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="size-3.5 text-[#A88752]" />
                            <span
                              className={`font-bold text-[11px] px-2 py-0.5 rounded-md ${
                                isHighRisk
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              Risk: {r.geminiAnalysis.riskScore}/100
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#68655F]">Standard</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                            r.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.status === "FLAGGED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReview(r)}
                            className="p-1.5 rounded-lg text-[#68655F] hover:text-[#1E211F] hover:bg-[#EBE3D5] transition-colors"
                            title="Inspect review & AI breakdown"
                          >
                            <Eye className="size-4" />
                          </button>

                          {r.status !== "APPROVED" && (
                            <button
                              onClick={() => onUpdateStatus(r.id, "APPROVED")}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors"
                            >
                              Approve
                            </button>
                          )}

                          {r.status !== "FLAGGED" && (
                            <button
                              onClick={() => onUpdateStatus(r.id, "FLAGGED")}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                            >
                              Flag
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Detail & AI Inspection Modal */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
}
