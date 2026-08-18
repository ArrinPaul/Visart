import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "brass" | "terracotta" | "indigo" | "success";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#F5F0E8] text-[#1E211F] border border-[#D8D0C4]",
    brass: "bg-[#A88752]/10 text-[#A88752] border border-[#A88752]/30",
    terracotta: "bg-[#B85C43]/10 text-[#B85C43] border border-[#B85C43]/30",
    indigo: "bg-[#27344A]/10 text-[#27344A] border border-[#27344A]/30",
    success: "bg-[#54745A]/10 text-[#54745A] border border-[#54745A]/30",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
