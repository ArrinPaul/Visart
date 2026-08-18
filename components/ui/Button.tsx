"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variantStyles = {
    primary: "bg-[#1E211F] text-[#FBF8F2] hover:bg-[#27344A] border border-transparent shadow-sm",
    secondary: "bg-[#B85C43] text-[#FBF8F2] hover:bg-[#A34F4F] border border-transparent shadow-sm",
    outline: "bg-transparent text-[#1E211F] border border-[#D8D0C4] hover:bg-[#FBF8F2] hover:border-[#1E211F]",
    ghost: "bg-transparent text-[#68655F] hover:text-[#1E211F] hover:bg-[#FBF8F2]",
    danger: "bg-[#A34F4F] text-[#FBF8F2] hover:bg-[#B85C43]",
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5 font-semibold",
  };

  const combinedClasses = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    if (href.startsWith("#") || href.startsWith("http")) {
      return (
        <a href={href} target={target} rel={rel} className={combinedClasses}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
