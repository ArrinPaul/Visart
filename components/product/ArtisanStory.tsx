"use client";

import React from "react";
import { VisartGeneration } from "@/types/visart";
import Card from "@/components/ui/Card";
import { Sparkles } from "lucide-react";

interface ArtisanStoryProps {
  story: VisartGeneration["story"];
}

export default function ArtisanStory({ story }: ArtisanStoryProps) {
  return (
    <Card className="bg-[#27344A] text-[#FBF8F2] border-[#A88752]/40 p-8 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#A88752] font-semibold border-b border-[#A88752]/30 pb-3">
        <Sparkles className="w-4 h-4 text-[#B85C43]" />
        The Artisan's Story
      </div>

      <h3 className="font-serif-editorial text-2xl font-bold text-[#FBF8F2]">
        {story.title}
      </h3>

      <p className="text-base text-[#F5F0E8]/90 leading-relaxed font-sans max-w-3xl">
        {story.body}
      </p>
    </Card>
  );
}
