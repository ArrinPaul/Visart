import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-semibold uppercase tracking-wider text-[#1E211F]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-[#FBF8F2] border ${
          error ? "border-[#A34F4F]" : "border-[#D8D0C4]"
        } rounded-xl text-[#1E211F] placeholder:text-[#68655F]/60 text-sm focus:bg-[#FBF8F2] focus:border-[#1E211F] transition-colors outline-none ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[#A34F4F] font-medium">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-xs text-[#68655F]">{helperText}</span>
      )}
    </div>
  );
}
