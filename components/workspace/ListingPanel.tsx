"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Copy, Check, Sparkles } from "lucide-react";
import TextToSpeechButton from "@/components/ui/TextToSpeechButton";

interface ListingPanelProps {
  product: VisartGeneration["product"];
  story: VisartGeneration["story"];
}

export default function ListingPanel({ product, story }: ListingPanelProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Editorial Title & Description */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
          <span className="text-xs font-mono tracking-widest uppercase text-[#68655F]">
            Product Title & Copy
          </span>
          <div className="flex items-center gap-2">
            <TextToSpeechButton text={`${product.title}. ${product.description}`} />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(`${product.title}\n\n${product.description}`, "title-desc")}
              className="border-[#D8D0C4] text-[#1E211F] hover:bg-[#F5F0E8]"
            >
              {copiedSection === "title-desc" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#54745A]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1E211F]">
          {product.title}
        </h2>

        <p className="text-base text-[#1E211F] leading-relaxed">
          {product.description}
        </p>

        <div className="bg-[#F5F0E8] p-4 rounded-xl border border-[#D8D0C4] mt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#68655F] block mb-1">
            Short Tagline / Meta Summary
          </span>
          <p className="text-sm italic text-[#1E211F]">{product.shortDescription}</p>
        </div>
      </Card>

      {/* Craft Story */}
      <Card className="flex flex-col gap-3 bg-[#27344A] text-[#FBF8F2] border-[#A88752]/40">
        <div className="flex items-center justify-between border-b border-[#A88752]/30 pb-3">
          <span className="text-xs font-mono tracking-widest uppercase text-[#A88752] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B85C43]" />
            Artisan Story
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-[#A88752]/40 text-[#FBF8F2] hover:bg-[#FBF8F2] hover:text-[#1E211F]"
            onClick={() => copyToClipboard(`${story.title}\n\n${story.body}`, "story")}
          >
            {copiedSection === "story" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#54745A]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Story</span>
              </>
            )}
          </Button>
        </div>

        <h3 className="font-serif-editorial text-xl font-semibold text-[#FBF8F2]">
          {story.title}
        </h3>
        <p className="text-sm text-[#F5F0E8]/90 leading-relaxed">
          {story.body}
        </p>
      </Card>

      {/* Keywords & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-3">
          <span className="text-xs font-mono tracking-widest uppercase text-[#68655F]">
            Search Keywords
          </span>
          <div className="flex flex-wrap gap-2">
            {product.keywords.map((kw, i) => (
              <Badge key={i} variant="default">
                {kw}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <span className="text-xs font-mono tracking-widest uppercase text-[#68655F]">
            Catalogue Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, i) => (
              <Badge key={i} variant="brass">
                #{tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
