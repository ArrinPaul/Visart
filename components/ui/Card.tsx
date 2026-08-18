import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export default function Card({ children, className = "", bordered = true }: CardProps) {
  const hasBgClass = className.includes("bg-");
  return (
    <div className={`${hasBgClass ? "" : "bg-[#FBF8F2]"} rounded-2xl p-6 ${bordered ? "border border-[#D8D0C4]" : ""} ${className}`}>
      {children}
    </div>
  );
}
