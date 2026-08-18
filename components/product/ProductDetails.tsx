"use client";

import React, { useState } from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import { Globe } from "lucide-react";

interface ProductDetailsProps {
  product: VisartGeneration["product"];
  translations: VisartGeneration["translations"];
}

export default function ProductDetails({ product, translations }: ProductDetailsProps) {
  const [lang, setLang] = useState<"en" | "hi" | "kn">("en");

  const getDisplayContent = () => {
    if (lang === "hi") return { title: translations.hindi.title, desc: translations.hindi.description };
    if (lang === "kn") return { title: translations.kannada.title, desc: translations.kannada.description };
    return { title: product.title, desc: product.description };
  };

  const current = getDisplayContent();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8D0C4] pb-4">
        <h2 className="font-serif-editorial text-2xl font-bold text-[#1E211F]">
          About the Product
        </h2>

        {/* Language selector toggle */}
        <div className="flex items-center gap-2 bg-[#F5F0E8] p-1 rounded-xl border border-[#D8D0C4]">
          <Globe className="w-4 h-4 text-[#A88752] ml-2" />
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              lang === "en" ? "bg-[#1E211F] text-[#FBF8F2]" : "text-[#68655F]"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              lang === "hi" ? "bg-[#1E211F] text-[#FBF8F2]" : "text-[#68655F]"
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang("kn")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              lang === "kn" ? "bg-[#1E211F] text-[#FBF8F2]" : "text-[#68655F]"
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <h3 className="font-serif-editorial text-xl font-semibold text-[#1E211F]">
          {current.title}
        </h3>
        <p className="text-base text-[#1E211F] leading-relaxed">
          {current.desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#D8D0C4] pt-4 mt-2">
          <div>
            <span className="text-xs font-mono uppercase text-[#68655F]">Material</span>
            <p className="text-sm font-semibold text-[#1E211F] mt-0.5">{product.material}</p>
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-[#68655F]">Craft Technique</span>
            <p className="text-sm font-semibold text-[#1E211F] mt-0.5">{product.craftTechnique}</p>
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-[#68655F]">Origin</span>
            <p className="text-sm font-semibold text-[#1E211F] mt-0.5">{product.location || "India"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
