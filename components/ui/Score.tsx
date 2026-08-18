import React from "react";

interface ScoreProps {
  score: number;
  maxScore?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function Score({ score, maxScore = 100, label = "Digital Readiness", size = "md" }: ScoreProps) {
  const isHigh = score >= 80;
  const isMedium = score >= 60 && score < 80;

  const colorClass = isHigh 
    ? "text-[#54745A] border-[#54745A]" 
    : isMedium 
      ? "text-[#A88752] border-[#A88752]" 
      : "text-[#B85C43] border-[#B85C43]";

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center font-serif-editorial font-bold rounded-full border-2 bg-[#FBF8F2] ${colorClass} ${
        size === "sm" ? "w-10 h-10 text-sm" : size === "md" ? "w-14 h-14 text-xl" : "w-20 h-20 text-3xl"
      }`}>
        {score}
      </div>
      {label && (
        <div className="flex flex-col">
          <span className="text-xs tracking-wider uppercase font-mono text-[#68655F]">{label}</span>
          <span className="text-sm font-semibold text-[#1E211F]">{score} / {maxScore}</span>
        </div>
      )}
    </div>
  );
}
