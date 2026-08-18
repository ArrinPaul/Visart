"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Score from "@/components/ui/Score";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Check, Bookmark, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkspaceHeader({ 
  generation,
  onSave 
}: { 
  generation: VisartGeneration;
  onSave?: () => void;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const { product, readiness } = generation;

  const handleSaveClick = () => {
    setSaved(true);
    if (onSave) onSave();
    setTimeout(() => {
      router.push("/product/demo-1");
    }, 600);
  };

  return (
    <div className="bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {product.imageUrl && (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-[#D8D0C4] shrink-0 bg-[#F5F0E8]">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="indigo">{product.category}</Badge>
            <Badge variant="brass">{product.material}</Badge>
            {product.location && <Badge variant="default">{product.location}</Badge>}
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1E211F]">
            {product.title}
          </h1>

          <p className="text-sm text-[#68655F] mt-1 max-w-xl line-clamp-2">
            {product.shortDescription}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 border-[#D8D0C4] pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
        <Score score={readiness.overall} label="Digital Readiness" size="md" />

        <Button 
          variant={saved ? "primary" : "secondary"} 
          onClick={handleSaveClick}
          className="shrink-0"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-[#54745A]" />
              <span>Saved! Opening...</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Save & View Product</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
