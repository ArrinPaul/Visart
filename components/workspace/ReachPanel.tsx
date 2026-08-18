"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Globe, Copy, Check } from "lucide-react";
import { AudioPlayerControl } from "@/components/ui/AudioPlayerControl";
import { TTSLanguage } from "@/lib/audio/tts";

interface ReachPanelProps {
  translations: VisartGeneration["translations"];
  product?: VisartGeneration["product"];
}

type LanguageOption = "en" | "hi" | "kn";

export default function ReachPanel({ translations, product }: ReachPanelProps) {
  const [lang, setLang] = useState<LanguageOption>("en");
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (lang) {
      case "hi":
        return {
          label: "Hindi (हिंदी)",
          ttsLang: "hi" as TTSLanguage,
          title: translations?.hindi?.title || product?.title || "",
          description: translations?.hindi?.description || product?.description || "",
        };
      case "kn":
        return {
          label: "Kannada (ಕನ್ನಡ)",
          ttsLang: "kn" as TTSLanguage,
          title: translations?.kannada?.title || product?.title || "",
          description: translations?.kannada?.description || product?.description || "",
        };
      case "en":
      default:
        return {
          label: "English",
          ttsLang: "en" as TTSLanguage,
          title: product?.title || "",
          description: product?.description || "",
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
          <div className="flex items-center gap-2">
            <AudioPlayerControl
              key={`reach-tts-${lang}`}
              text={`${active.title}। ${active.description}`}
              language={active.ttsLang}
              label={lang === "hi" ? "हिंदी में सुनें" : lang === "kn" ? "ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ" : "Listen in English"}
              variant="compact"
            />
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
        </div>

        <h3 className="font-serif-editorial text-2xl font-bold text-[#1E211F]">
          {active.title}
        </h3>

        <p className="text-base text-[#1E211F] leading-relaxed bg-[#F5F0E8] p-5 rounded-xl border border-[#D8D0C4]">
          {active.description}
        </p>

        {/* Multi-language Quick Audio Strip */}
        <div className="border-t border-[#D8D0C4] pt-4 mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-mono text-[#68655F] uppercase text-[11px] tracking-wider">
            🔊 Quick Native Audio Listen:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <AudioPlayerControl
              text={`${product?.title || ""}. ${product?.description || ""}`}
              language="en"
              label="English Voice"
              variant="compact"
            />
            {translations?.hindi?.title && (
              <AudioPlayerControl
                text={`${translations.hindi.title}। ${translations.hindi.description}`}
                language="hi"
                label="हिंदी वाणी (Hindi)"
                variant="compact"
              />
            )}
            {translations?.kannada?.title && (
              <AudioPlayerControl
                text={`${translations.kannada.title}. ${translations.kannada.description}`}
                language="kn"
                label="ಕನ್ನಡ ಧ್ವನಿ (Kannada)"
                variant="compact"
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
