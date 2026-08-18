"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Copy, Check, Share2, MessageSquare, Megaphone } from "lucide-react";

interface MarketingPanelProps {
  marketing: VisartGeneration["marketing"];
}

export default function MarketingPanel({ marketing }: MarketingPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-[#D8D0C4] pb-3">
        <h3 className="font-serif-editorial text-xl font-semibold text-[#1E211F]">
          Customer-Ready Marketing Copy
        </h3>
        <p className="text-xs text-[#68655F]">
          Ready-to-use channels copy formatted for social engagement and direct artisan messaging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B85C43] flex items-center gap-1.5 font-semibold">
              <Share2 className="w-4 h-4" />
              Instagram Post Caption
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(marketing.instagram, "instagram")}
            >
              {copiedKey === "instagram" ? (
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
          <p className="text-sm text-[#1E211F] whitespace-pre-wrap leading-relaxed bg-[#F5F0E8] p-4 rounded-xl border border-[#D8D0C4] font-sans">
            {marketing.instagram}
          </p>
        </Card>

        {/* WhatsApp */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
            <span className="text-xs font-mono tracking-widest uppercase text-[#54745A] flex items-center gap-1.5 font-semibold">
              <MessageSquare className="w-4 h-4" />
              WhatsApp Direct Broadcast
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(marketing.whatsapp, "whatsapp")}
            >
              {copiedKey === "whatsapp" ? (
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
          <p className="text-sm text-[#1E211F] whitespace-pre-wrap leading-relaxed bg-[#F5F0E8] p-4 rounded-xl border border-[#D8D0C4] font-sans">
            {marketing.whatsapp}
          </p>
        </Card>
      </div>

      {/* Short Ad */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3">
          <span className="text-xs font-mono tracking-widest uppercase text-[#A88752] flex items-center gap-1.5 font-semibold">
            <Megaphone className="w-4 h-4" />
            Short Ad Snippet
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCopy(marketing.shortAd, "shortAd")}
          >
            {copiedKey === "shortAd" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#54745A]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Snippet</span>
              </>
            )}
          </Button>
        </div>
        <p className="text-base text-[#1E211F] font-medium italic bg-[#F5F0E8] p-4 rounded-xl border border-[#D8D0C4]">
          &quot;{marketing.shortAd}&quot;
        </p>
      </Card>
    </div>
  );
}
