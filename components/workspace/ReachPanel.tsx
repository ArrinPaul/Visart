"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Globe, Copy, Check } from "lucide-react";

interface ReachPanelProps {
  translations: VisartGeneration["translations"];
}

type LanguageOption = "en" | "hi" | "kn";

export default function ReachPanel({ translations }: ReachPanelProps) {
  const [lang, setLang] = useState<LanguageOption>("en");
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (lang) {
      case "hi":
        return {
          label: "Hindi (हिंदी)",
          title: translations.hindi.title,
          description: translations.hindi.description,
        };
      case "kn":
        return {
          label: "Kannada (ಕನ್ನಡ)",
          title: translations.kannada.title,
          description: translations.kannada.description,
        };
      case "en":
      default:
        return {
          label: "English",
          title: "Handcrafted Assamese Bamboo Basket",
          description: "A durable, handwoven storage basket made from sustainable golden bamboo in Assam, combining functional utility with authentic regional craftsmanship.",
        };
    }
  };

  const active = getActiveContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${active.title}\n\n${active.description}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8D0C4] pb-4">
        <div>
          <h3 className="font-serif-editorial text-xl font-semibold text-[#1E211F] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#27344A]" />
            Multilingual Reach
          </h3>
          <p className="text-xs text-[#68655F]">
            Expand your market across regional customer demographics in their native language.
          </p>
        </div>

        {/* Segmented language switcher */}
        <div className="bg-[#F5F0E8] p-1 rounded-xl border border-[#D8D0C4] flex items-center gap-1 self-stretch sm:self-auto">
          <button
            onClick={() => setLang("en")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              lang === "en" ? "bg-[#1E211F] text-[#FBF8F2] shadow-sm" : "text-[#68655F] hover:text-[#1E211F]"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              lang === "hi" ? "bg-[#1E211F] text-[#FBF8F2] shadow-sm" : "text-[#68655F] hover:text-[#1E211F]"
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => setLang("kn")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              lang === "kn" ? "bg-[#1E211F] text-[#FBF8F2] shadow-sm" : "text-[#68655F] hover:text-[#1E211F]"
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>
      </div>

      {/* Translated Content Display Card */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
          <span className="text-xs font-mono tracking-widest uppercase text-[#A88752] font-semibold">
            {active.label} Listing Translation
          </span>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#54745A]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Translation</span>
              </>
            )}
          </Button>
        </div>

        <h3 className="font-serif-editorial text-2xl font-bold text-[#1E211F]">
          {active.title}
        </h3>

        <p className="text-base text-[#1E211F] leading-relaxed bg-[#F5F0E8] p-5 rounded-xl border border-[#D8D0C4]">
          {active.description}
        </p>
      </Card>
    </div>
  );
}
