"use client";

import React, { useState, useEffect } from "react";
import type { VisartGeneration, ProductInputData } from "@/types/visart";
import { AudioPlayerControl } from "@/components/ui/AudioPlayerControl";
import {
  FileText,
  TrendingUp,
  Share2,
  Globe2,
  Copy,
  Check,
  Edit3,
  Save,
  MessageSquare,
  Info,
  Sparkles,
} from "lucide-react";

interface WorkspaceTabsProps {
  generation: VisartGeneration;
  inputData?: ProductInputData;
  onUpdateGeneration?: (updated: VisartGeneration) => void;
}

export type TabKey = "listing" | "pricing" | "marketing" | "reach";

export function WorkspaceTabs({
  generation,
  inputData,
  onUpdateGeneration,
}: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("listing");
  const [activeLanguage, setActiveLanguage] = useState<"en" | "hi" | "kn">("en");

  // Copy state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Edit states for listing
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(generation.product.title);
  const [shortDesc, setShortDesc] = useState(generation.product.shortDescription);
  const [fullDesc, setFullDesc] = useState(generation.product.description);

  // Keep local edit states synchronized whenever generation prop updates
  useEffect(() => {
    setTitle(generation.product.title);
    setShortDesc(generation.product.shortDescription);
    setFullDesc(generation.product.description);
    setIsEditing(false);
  }, [
    generation.product.title,
    generation.product.shortDescription,
    generation.product.description,
  ]);

  const handleCopy = (text: string, fieldId: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onUpdateGeneration) {
      onUpdateGeneration({
        ...generation,
        product: {
          ...generation.product,
          title,
          shortDescription: shortDesc,
          description: fullDesc,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Pill Bar */}
      <div className="flex border-b border-[#D8D0C4] overflow-x-auto gap-2 sm:gap-4 no-scrollbar">
        {[
          { key: "listing", label: "Listing", icon: FileText },
          { key: "pricing", label: "Pricing Guidance", icon: TrendingUp },
          { key: "marketing", label: "Marketing Copy", icon: Share2 },
          { key: "reach", label: "Multilingual Reach", icon: Globe2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[#B85C43] text-[#B85C43]"
                  : "border-transparent text-[#68655F] hover:text-[#1E211F]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="pt-2">
        {/* 1. LISTING TAB */}
        {activeTab === "listing" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
                  Structured Product Listing
                </h3>
                <p className="text-xs text-[#68655F]">
                  Search-optimized title, descriptions, and tags crafted for digital buyers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#54745A] text-white text-xs font-semibold rounded-lg hover:bg-[#435e48] transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Edits</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTitle(generation.product.title);
                      setShortDesc(generation.product.shortDescription);
                      setFullDesc(generation.product.description);
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF8F2] border border-[#D8D0C4] text-xs font-medium text-[#1E211F] rounded-lg hover:bg-[#F5F0E8] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Listing</span>
                  </button>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                <span>Product Title</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      isEditing ? title : generation.product.title,
                      "title"
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-[#B85C43] hover:underline cursor-pointer"
                >
                  {copiedField === "title" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#54745A]" />
                      <span className="text-[#54745A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-lg font-serif-editorial text-lg text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              ) : (
                <p className="font-serif-editorial text-xl font-medium text-[#1E211F]">
                  {generation.product.title}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                <span>Short Summary (For Cards & Feeds)</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      isEditing ? shortDesc : generation.product.shortDescription,
                      "short"
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-[#B85C43] hover:underline cursor-pointer"
                >
                  {copiedField === "short" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#54745A]" />
                      <span className="text-[#54745A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-lg text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              ) : (
                <p className="text-sm text-[#68655F] leading-relaxed">
                  {generation.product.shortDescription}
                </p>
              )}
            </div>

            {/* Full Description */}
            <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                <span>Full Product Narrative</span>
                <div className="flex items-center gap-2">
                  <AudioPlayerControl
                    text={isEditing ? fullDesc : generation.product.description}
                    language="en"
                    label="Listen"
                    variant="compact"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        isEditing ? fullDesc : generation.product.description,
                        "full"
                      )
                    }
                    className="flex items-center gap-1 text-[11px] text-[#B85C43] hover:underline cursor-pointer"
                  >
                    {copiedField === "full" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#54745A]" />
                        <span className="text-[#54745A]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8D0C4] rounded-lg text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              ) : (
                <p className="text-sm text-[#1E211F]/90 leading-relaxed">
                  {generation.product.description}
                </p>
              )}
            </div>

            {/* Artisan Story */}
            {generation.story?.body && (
              <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B85C43]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Artisan Story</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AudioPlayerControl
                      text={`${generation.story.title || "Story"}. ${generation.story.body}`}
                      language="en"
                      label="Listen"
                      variant="compact"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${generation.story.title}\n\n${generation.story.body}`,
                          "story"
                        )
                      }
                      className="flex items-center gap-1 text-[11px] text-[#B85C43] hover:underline cursor-pointer"
                    >
                      {copiedField === "story" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#54745A]" />
                          <span className="text-[#54745A]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Story</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {generation.story.title && (
                  <h4 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
                    {generation.story.title}
                  </h4>
                )}
                <p className="text-sm text-[#1E211F]/90 leading-relaxed font-sans">
                  {generation.story.body}
                </p>
              </div>
            )}

            {/* Keywords & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                  Search Keywords
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {generation.product.keywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#F5F0E8] text-xs text-[#1E211F] rounded-md font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                  Social / Catalog Tags
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {generation.product.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#27344A]/10 text-xs text-[#27344A] rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Craft Source Facts */}
            {inputData && (
              <div className="p-4 bg-[#F5F0E8] border border-[#D8D0C4] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-[#68655F]">
                <div>
                  <span className="font-semibold text-[#1E211F]">Material: </span>
                  <span>{inputData.material}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1E211F]">Time to make: </span>
                  <span>{inputData.timeRequired}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1E211F]">Origin: </span>
                  <span>{inputData.location}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1E211F]">Cost base: </span>
                  <span>₹{inputData.productionCost}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. PRICING TAB */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
                AI-Assisted Price Guidance
              </h3>
              <p className="text-xs text-[#68655F]">
                Transparent recommendation grounded in verified artisan labour and raw material costs.
              </p>
            </div>

            {/* Recommended Price Hero Box */}
            <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#54745A]">
                    Recommended Selling Price
                  </span>
                  <div className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#27344A] pt-1">
                    ₹{generation.pricing.recommended.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="p-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs space-y-1">
                  <span className="text-[#68655F] font-semibold">Recommended Market Range:</span>
                  <div className="font-serif-editorial text-lg font-bold text-[#1E211F]">
                    ₹{generation.pricing.min.toLocaleString("en-IN")} – ₹{generation.pricing.max.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Rationale Breakdown */}
              <div className="pt-4 border-t border-[#D8D0C4] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  <Info className="w-3.5 h-3.5 text-[#A88752]" />
                  <span>Cost & Skill Breakdown Rationale</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {generation.pricing.rationale?.map((rat, idx) => (
                    <div key={idx} className="p-3 bg-[#F5F0E8] rounded-xl text-xs text-[#1E211F]/90 leading-relaxed">
                      {rat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#68655F] italic pt-2">
                {generation.pricing.disclaimer}
              </p>
            </div>
          </div>
        )}

        {/* 3. MARKETING TAB */}
        {activeTab === "marketing" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
                Customer-Ready Marketing Copy
              </h3>
              <p className="text-xs text-[#68655F]">
                Tailored copy crafted specifically for social platforms and direct customer chats.
              </p>
            </div>

            {/* Instagram Copy */}
            <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B85C43]">
                    Instagram Caption
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(generation.marketing.instagram, "ig")}
                  className="flex items-center gap-1 text-xs font-semibold text-[#B85C43] hover:underline cursor-pointer"
                >
                  {copiedField === "ig" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#54745A]" />
                      <span className="text-[#54745A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-[#1E211F] leading-relaxed whitespace-pre-wrap bg-[#F5F0E8] p-4 rounded-xl">
                {generation.marketing.instagram}
              </p>
            </div>

            {/* WhatsApp Message */}
            <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#54745A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#54745A]">
                    WhatsApp Direct Message
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(generation.marketing.whatsapp, "wa")}
                  className="flex items-center gap-1 text-xs font-semibold text-[#54745A] hover:underline cursor-pointer"
                >
                  {copiedField === "wa" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#54745A]" />
                      <span className="text-[#54745A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-[#1E211F] leading-relaxed whitespace-pre-wrap bg-[#F5F0E8] p-4 rounded-xl">
                {generation.marketing.whatsapp}
              </p>
            </div>

            {/* Short Ad Copy */}
            <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#27344A]">
                  Short Ad / Headline Copy
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(generation.marketing.shortAd, "ad")}
                  className="flex items-center gap-1 text-xs font-semibold text-[#27344A] hover:underline cursor-pointer"
                >
                  {copiedField === "ad" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#54745A]" />
                      <span className="text-[#54745A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm font-medium text-[#1E211F] bg-[#F5F0E8] p-4 rounded-xl">
                {generation.marketing.shortAd}
              </p>
            </div>
          </div>
        )}

        {/* 4. MULTILINGUAL REACH TAB */}
        {activeTab === "reach" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
                  Multilingual Listing Content
                </h3>
                <p className="text-xs text-[#68655F]">
                  Accurate, natural translations & spoken audio in regional Indian languages.
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-[#FBF8F2] border border-[#D8D0C4] rounded-lg">
                {[
                  { code: "en", label: "English" },
                  { code: "hi", label: "हिन्दी (Hindi)" },
                  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setActiveLanguage(l.code as "en" | "hi" | "kn")}
                    className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all ${
                      activeLanguage === l.code
                        ? "bg-[#27344A] text-white shadow-xs"
                        : "text-[#68655F] hover:text-[#1E211F]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Translated Display Card */}
            <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
                <span className="text-xs font-mono tracking-widest uppercase text-[#A88752] font-semibold">
                  {activeLanguage === "hi"
                    ? "Hindi (हिंदी) Translation & Speech"
                    : activeLanguage === "kn"
                    ? "Kannada (ಕನ್ನಡ) Translation & Speech"
                    : "English Listing & Speech"}
                </span>

                <div className="flex items-center gap-2">
                  <AudioPlayerControl
                    key={`reach-tts-${activeLanguage}`}
                    text={
                      activeLanguage === "hi"
                        ? `${generation.translations?.hindi?.title || generation.product.title}। ${generation.translations?.hindi?.description || generation.product.description}`
                        : activeLanguage === "kn"
                        ? `${generation.translations?.kannada?.title || generation.product.title}. ${generation.translations?.kannada?.description || generation.product.description}`
                        : `${generation.product.title}. ${generation.product.description}`
                    }
                    language={activeLanguage}
                    label={
                      activeLanguage === "hi"
                        ? "हिंदी में सुनें"
                        : activeLanguage === "kn"
                        ? "ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ"
                        : "Listen in English"
                    }
                    variant="compact"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        activeLanguage === "hi"
                          ? `${generation.translations?.hindi?.title || ""}\n\n${generation.translations?.hindi?.description || ""}`
                          : activeLanguage === "kn"
                          ? `${generation.translations?.kannada?.title || ""}\n\n${generation.translations?.kannada?.description || ""}`
                          : `${generation.product.title}\n\n${generation.product.description}`,
                        "trans"
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F0E8] border border-[#D8D0C4] rounded-lg text-xs font-semibold text-[#1E211F] hover:bg-[#D8D0C4]/60 transition-colors"
                  >
                    {copiedField === "trans" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#54745A]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#68655F]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                  Translated Title
                </span>
                <p className="font-serif-editorial text-2xl font-medium text-[#1E211F]">
                  {activeLanguage === "hi"
                    ? generation.translations?.hindi?.title || generation.product.title
                    : activeLanguage === "kn"
                    ? generation.translations?.kannada?.title || generation.product.title
                    : generation.product.title}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#D8D0C4]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#68655F]">
                  Translated Full Description
                </span>
                <p className="text-sm text-[#1E211F] leading-relaxed pt-1 bg-[#F5F0E8] p-4 rounded-xl">
                  {activeLanguage === "hi"
                    ? generation.translations?.hindi?.description || generation.product.description
                    : activeLanguage === "kn"
                    ? generation.translations?.kannada?.description || generation.product.description
                    : generation.product.description}
                </p>
              </div>

              {/* Multi-language Quick Audio Strip */}
              <div className="border-t border-[#D8D0C4] pt-4 mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-mono text-[#68655F] uppercase text-[11px] tracking-wider">
                  🔊 Quick Native Audio Listen:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <AudioPlayerControl
                    text={`${generation.product.title}. ${generation.product.description}`}
                    language="en"
                    label="English Voice"
                    variant="compact"
                  />
                  {generation.translations?.hindi?.title && (
                    <AudioPlayerControl
                      text={`${generation.translations.hindi.title}। ${generation.translations.hindi.description}`}
                      language="hi"
                      label="हिंदी वाणी (Hindi)"
                      variant="compact"
                    />
                  )}
                  {generation.translations?.kannada?.title && (
                    <AudioPlayerControl
                      text={`${generation.translations.kannada.title}. ${generation.translations.kannada.description}`}
                      language="kn"
                      label="ಕನ್ನಡ ಧ್ವನಿ (Kannada)"
                      variant="compact"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspaceTabs;
