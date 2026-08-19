"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type { PerformanceMetrics } from "@/types/admin";

interface AnalyticsViewProps {
  performance: PerformanceMetrics | null;
}

export default function AnalyticsView({ performance }: AnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");

  const trendData = {
    "7": [120, 145, 190, 210, 280, 310, 390],
    "30": [40, 65, 80, 110, 140, 160, 190, 220, 260, 310, 340, 420],
    "90": [15, 30, 60, 95, 140, 180, 240, 310, 380, 460, 520, 680],
  };

  const currentTrends = trendData[timeRange];
  const maxVal = Math.max(...currentTrends);
  const width = 600;
  const height = 160;

  const points = currentTrends
    .map((val, idx) => {
      const x = (idx / (currentTrends.length - 1)) * width;
      const y = height - (val / maxVal) * (height - 30) - 15;
      return `${x},${y}`;
    })
    .join(" ");

  const geographicBreakdown = [
    { state: "Assam", crafts: "Bamboo & Cane, Eri Silk", artisanShare: "28%" },
    { state: "Karnataka", crafts: "Bidriware, Channapatna Toys", artisanShare: "24%" },
    { state: "Bihar", crafts: "Mithila / Madhubani Painting", artisanShare: "18%" },
    { state: "Telangana", crafts: "Pochampally Ikat Handlooms", artisanShare: "16%" },
    { state: "Uttar Pradesh", crafts: "Khurja Terracotta & Pottery", artisanShare: "14%" },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8D0C4] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-[#A88752]" />
          <span className="text-xs font-bold text-[#1E211F] uppercase tracking-wider">
            Analytics Time Horizon
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F5F0E8] p-1 rounded-xl border border-[#D8D0C4]">
          {(["7", "30", "90"] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === days
                  ? "bg-[#B85C43] text-white shadow-xs"
                  : "text-[#68655F] hover:text-[#1E211F]"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* SVG Trend Chart */}
      <div className="bg-white rounded-2xl border border-[#D8D0C4] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
              Catalogue Inquiries & Buyer Traffic Growth
            </h3>
            <p className="text-xs text-[#68655F]">
              Direct buyers reached across regional WhatsApp and shared catalogues.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="size-3.5" /> +{timeRange === "7" ? "18.4%" : timeRange === "30" ? "34.2%" : "68.9%"}
          </span>
        </div>

        {/* Responsive SVG Polyline */}
        <div className="w-full overflow-hidden pt-4">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-40 overflow-visible"
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B85C43" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#B85C43" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((p, i) => (
              <line
                key={i}
                x1="0"
                y1={height * p}
                x2={width}
                y2={height * p}
                stroke="#EBE3D5"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Filled Area */}
            <polygon
              points={`0,${height} ${points} ${width},${height}`}
              fill="url(#trendGradient)"
            />

            {/* Polyline */}
            <polyline
              fill="none"
              stroke="#B85C43"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Data Dots */}
            {currentTrends.map((val, idx) => {
              const x = (idx / (currentTrends.length - 1)) * width;
              const y = height - (val / maxVal) * (height - 30) - 15;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="4"
                  className="fill-[#1E211F] stroke-white stroke-2 hover:r-6 transition-all cursor-pointer"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Grid: Popular Craft Categories & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Craft Categories */}
        <div className="bg-white p-6 rounded-2xl border border-[#D8D0C4] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="size-5 text-[#B85C43]" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
              Craft Category Engagement
            </h3>
          </div>

          <div className="space-y-3">
            {performance?.popularCraftCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1E211F]">{cat.category}</span>
                  <span className="text-[#68655F]">
                    {cat.views} views • {cat.inquiries} inquiries
                  </span>
                </div>
                <div className="w-full bg-[#EBE3D5] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#B85C43] h-full rounded-full"
                    style={{ width: `${Math.min(100, (cat.views / 2500) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#D8D0C4] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-[#A88752]" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
              Geographical Hubs & GI Clusters
            </h3>
          </div>

          <div className="divide-y divide-[#EBE3D5]">
            {geographicBreakdown.map((geo, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#1E211F]">{geo.state}</p>
                  <p className="text-[11px] text-[#68655F]">{geo.crafts}</p>
                </div>
                <span className="font-serif-editorial font-bold text-sm text-[#A88752]">
                  {geo.artisanShare}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
