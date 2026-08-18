"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAccessibility } from "./AccessibilityProvider";
import {
  Eye,
  Type,
  Sun,
  Activity,
  RotateCcw,
  X,
} from "lucide-react";

export function AccessibilityToolbar() {
  const { preferences, updatePreferences, resetPreferences, isAccessibleModeActive } =
    useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Floating / Header Accessible Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Inclusive Accessibility Preferences"
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          isAccessibleModeActive
            ? "bg-[#B85C43] text-[#FBF8F2] hover:bg-[#A34F38] shadow-[#B85C43]/20 ring-2 ring-[#B85C43]"
            : "bg-[#1E211F] text-[#F5F0E8] hover:bg-[#27344A] border border-[#D8D0C4]/30"
        }`}
      >
        <Eye className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isAccessibleModeActive ? "Inclusive Mode On" : "Inclusive Mode"}
        </span>
      </button>

      {/* Preferences Dialog / Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Inclusive Mode Settings"
          ref={modalRef}
          className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl shadow-xl p-5 text-[#1E211F] animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#D8D0C4] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#B85C43]/10 flex items-center justify-center text-[#B85C43]">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-editorial text-sm font-bold text-[#1E211F]">
                  Inclusive Mode
                </h3>
                <p className="text-[11px] text-[#68655F]">
                  Visual & reading comfort controls
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close preferences"
              className="p-1 text-[#68655F] hover:text-[#1E211F] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size Control */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="flex items-center gap-1.5 text-[#1E211F]">
                  <Type className="w-3.5 h-3.5 text-[#A88752]" />
                  Text Size
                </span>
                <span className="text-[11px] text-[#68655F] capitalize">
                  {preferences.fontSize.replace("-", " ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F0E8] rounded-xl border border-[#D8D0C4]/60">
                {(
                  [
                    { id: "normal", label: "Normal", scale: "A" },
                    { id: "large", label: "Large", scale: "A+" },
                    { id: "extra-large", label: "XL", scale: "A++" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updatePreferences({ fontSize: opt.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      preferences.fontSize === opt.id
                        ? "bg-[#1E211F] text-[#FBF8F2] shadow-xs"
                        : "text-[#68655F] hover:text-[#1E211F] hover:bg-[#FBF8F2]"
                    }`}
                  >
                    <span className="font-bold mr-1">{opt.scale}</span>
                    <span className="text-[10px] hidden xs:inline">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F0E8] border border-[#D8D0C4]/60">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-[#B85C43]" />
                <div>
                  <div className="text-xs font-semibold text-[#1E211F]">
                    High Contrast
                  </div>
                  <div className="text-[10px] text-[#68655F]">
                    Max clarity black & white surfaces
                  </div>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.highContrast}
                onClick={() =>
                  updatePreferences({ highContrast: !preferences.highContrast })
                }
                className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85C43] ${
                  preferences.highContrast ? "bg-[#1E211F]" : "bg-[#D8D0C4]"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-[#FBF8F2] shadow-xs transform transition-transform absolute top-1 ${
                    preferences.highContrast ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F0E8] border border-[#D8D0C4]/60">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#54745A]" />
                <div>
                  <div className="text-xs font-semibold text-[#1E211F]">
                    Reduced Motion
                  </div>
                  <div className="text-[10px] text-[#68655F]">
                    Minimizes animations & transitions
                  </div>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.reducedMotion}
                onClick={() =>
                  updatePreferences({ reducedMotion: !preferences.reducedMotion })
                }
                className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85C43] ${
                  preferences.reducedMotion ? "bg-[#1E211F]" : "bg-[#D8D0C4]"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-[#FBF8F2] shadow-xs transform transition-transform absolute top-1 ${
                    preferences.reducedMotion ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Reset */}
          <div className="mt-4 pt-3 border-t border-[#D8D0C4] flex items-center justify-between">
            <button
              type="button"
              onClick={resetPreferences}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#68655F] hover:text-[#B85C43] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 bg-[#1E211F] text-[#FBF8F2] rounded-lg text-xs font-semibold hover:bg-[#27344A] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
