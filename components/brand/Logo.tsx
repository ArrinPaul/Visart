import React from "react";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center rounded-lg bg-[#27344A] text-[#FBF8F2] p-1.5 shadow-sm border border-[#A88752]/40 ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.75" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-full h-full text-[#B85C43]"
      >
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <circle cx="12" cy="12" r="7" className="stroke-[#A88752]" />
        <path d="m16.5 7.5-9 9" className="stroke-[#F5F0E8]" />
      </svg>
    </div>
  );
}
