"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { MessageSquare, Share2, Check, MapPin, Hammer } from "lucide-react";

interface ProductHeroProps {
  product: VisartGeneration["product"];
  pricing: VisartGeneration["pricing"];
}

export default function ProductHero({ product, pricing }: ProductHeroProps) {
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left: Large Editorial Product Image */}
      <div className="lg:col-span-7">
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-[#D8D0C4] bg-[#FBF8F2] shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F5F0E8] text-[#68655F]">
              Craft Image
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="indigo">{product.category}</Badge>
            <Badge variant="brass">{product.material}</Badge>
          </div>
        </div>
      </div>

      {/* Right: Editorial Product Specs & CTAs */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {product.location && (
            <span className="text-xs font-mono tracking-widest uppercase text-[#B85C43] font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {product.location}
            </span>
          )}

          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#1E211F] leading-tight">
            {product.title}
          </h1>

          <div className="font-serif-editorial text-3xl font-bold text-[#B85C43] mt-2">
            ₹{pricing.recommended.toLocaleString()}
          </div>
        </div>

        <p className="text-base text-[#68655F] leading-relaxed border-t border-[#D8D0C4] pt-4">
          {product.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 py-2">
          {product.tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-mono bg-[#F5F0E8] text-[#68655F] px-3 py-1 rounded-full border border-[#D8D0C4]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action CTAs (No generic Amazon checkout!) */}
        <div className="flex flex-col sm:flex-row gap-3 border-t border-[#D8D0C4] pt-6">
          <Button size="lg" variant="primary" className="flex-1" onClick={() => alert("Direct Artisan WhatsApp Chat initiated!")}>
            <MessageSquare className="w-4 h-4 text-[#54745A]" />
            <span>Contact Artisan</span>
          </Button>

          <Button size="lg" variant="outline" onClick={handleShare}>
            {shared ? (
              <>
                <Check className="w-4 h-4 text-[#54745A]" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Story</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
