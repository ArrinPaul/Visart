"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Globe2,
  Phone,
  Package,
  Award,
  ShieldCheck,
  Filter,
} from "lucide-react";
import type { ArtisanProfile } from "@/types/admin";

interface ArtisansUsersViewProps {
  artisans: ArtisanProfile[];
  onUpdateStatus: (artisanId: string, status: "ACTIVE" | "VERIFIED" | "PENDING") => Promise<void>;
}

export default function ArtisansUsersView({
  artisans,
  onUpdateStatus,
}: ArtisansUsersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredArtisans = artisans.filter((a) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(query) ||
      a.craft.toLowerCase().includes(query) ||
      a.location.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "all" || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D8D0C4] shadow-sm">
          <p className="text-xs font-semibold text-[#68655F] uppercase tracking-wider">
            Total Artisans
          </p>
          <p className="font-serif-editorial text-3xl font-bold text-[#1E211F] mt-2">
            {artisans.length}
          </p>
          <p className="text-xs text-[#68655F] mt-1">Across 5 Indian States</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8D0C4] shadow-sm">
          <p className="text-xs font-semibold text-[#68655F] uppercase tracking-wider">
            Master Verified
          </p>
          <p className="font-serif-editorial text-3xl font-bold text-emerald-700 mt-2">
            {artisans.filter((a) => a.status === "VERIFIED").length}
          </p>
          <p className="text-xs text-emerald-800 mt-1">Geographical Indication (GI) / Guild verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D8D0C4] shadow-sm">
          <p className="text-xs font-semibold text-[#68655F] uppercase tracking-wider">
            Avg Readiness Score
          </p>
          <p className="font-serif-editorial text-3xl font-bold text-[#A88752] mt-2">
            93%
          </p>
          <p className="text-xs text-[#68655F] mt-1">Digital onboarding competence</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8D0C4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
          <input
            type="text"
            placeholder="Search by artisan name, craft specialization, or state..."
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
            <option value="all">All Verification Statuses</option>
            <option value="VERIFIED">Verified Guild Masters</option>
            <option value="ACTIVE">Active Artisans</option>
            <option value="PENDING">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Artisans Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtisans.map((artisan) => {
          const isVerified = artisan.status === "VERIFIED";

          return (
            <div
              key={artisan.id}
              className="bg-white rounded-2xl border border-[#D8D0C4] shadow-sm p-6 flex flex-col justify-between hover:border-[#B85C43]/50 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="size-12 rounded-2xl bg-gradient-to-br from-[#B85C43]/20 to-[#A88752]/20 border border-[#D8D0C4] flex items-center justify-center font-serif-editorial text-lg font-bold text-[#B85C43]">
                    {artisan.name.charAt(0)}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-bold ${
                      isVerified
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <ShieldCheck className="size-3" />
                    {artisan.status}
                  </span>
                </div>

                <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F] mt-3">
                  {artisan.name}
                </h3>
                <p className="text-xs font-semibold text-[#A88752] mt-0.5">{artisan.craft}</p>
                <p className="text-xs text-[#68655F] mt-1">{artisan.location}</p>

                <div className="mt-4 pt-4 border-t border-[#EBE3D5] space-y-2 text-xs text-[#68655F]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe2 className="size-3.5 text-[#A88752]" />
                      Language:
                    </span>
                    <span className="font-semibold text-[#1E211F]">{artisan.preferredLanguage}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Package className="size-3.5 text-[#B85C43]" />
                      Catalogue Works:
                    </span>
                    <span className="font-semibold text-[#1E211F]">
                      {artisan.productCount} craft listings
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Award className="size-3.5 text-emerald-600" />
                      Readiness Index:
                    </span>
                    <span className="font-bold text-emerald-700">{artisan.readinessAverage}%</span>
                  </div>

                  {artisan.phone && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3.5 text-[#68655F]" />
                        Direct Contact:
                      </span>
                      <span className="font-mono text-[11px] text-[#1E211F]">{artisan.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggle Action */}
              <div className="mt-6 pt-4 border-t border-[#EBE3D5] flex items-center justify-between">
                <span className="text-[11px] text-[#68655F]">Credentials Action:</span>
                <button
                  onClick={() =>
                    onUpdateStatus(artisan.id, isVerified ? "ACTIVE" : "VERIFIED")
                  }
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                    isVerified
                      ? "bg-[#F5F0E8] text-[#68655F] hover:bg-[#EBE3D5]"
                      : "bg-[#B85C43] text-white hover:bg-[#9E4730]"
                  }`}
                >
                  {isVerified ? "Revoke Verification" : "Grant Verified Badge"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
