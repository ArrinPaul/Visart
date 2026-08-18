import React from "react";
import Logo from "./Logo";

export default function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo className="w-8 h-8" />
      <div className="flex flex-col">
        <span className="font-serif-editorial text-2xl font-semibold tracking-wider text-[#1E211F] leading-none">
          VISART
        </span>
        <span className="text-[10px] tracking-widest uppercase text-[#68655F] font-mono mt-0.5">
          CRAFT STUDIO
        </span>
      </div>
    </div>
  );
}
