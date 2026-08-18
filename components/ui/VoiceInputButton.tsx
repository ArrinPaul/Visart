"use client";

import React, { useState } from "react";
import { useSpeechToText } from "@/lib/audio/stt";
import { Mic, MicOff, AlertCircle } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
  className?: string;
  fieldLabel?: string;
}

export function VoiceInputButton({
  onTranscript,
  language = "en-IN",
  className = "",
  fieldLabel = "field",
}: VoiceInputButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { isListening, isSupported, error, startListening, stopListening } =
    useSpeechToText();
  const [showError, setShowError] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isSupported) {
    return null;
  }

  const handleToggle = () => {
    setShowError(false);
    if (isListening) {
      stopListening();
    } else {
      startListening({
        language,
        onTranscript: (text) => {
          onTranscript(text);
        },
        onError: () => {
          setShowError(true);
          setTimeout(() => setShowError(false), 4000);
        },
      });
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={
          isListening
            ? `Stop voice dictation for ${fieldLabel}`
            : `Speak to fill ${fieldLabel}`
        }
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85C43] ${
          isListening
            ? "bg-[#B85C43] text-[#FBF8F2] animate-pulse ring-2 ring-[#B85C43]/40"
            : "bg-[#F5F0E8] hover:bg-[#D8D0C4]/70 text-[#68655F] hover:text-[#1E211F] border border-[#D8D0C4]"
        } ${className}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5" />
            <span>Listening... (Tap to stop)</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-[#B85C43]" />
            <span>Speak</span>
          </>
        )}
      </button>

      {/* Floating tooltip message on error */}
      {showError && error && (
        <div className="absolute right-0 top-full mt-1.5 z-30 w-64 p-2 bg-[#1E211F] text-[#FBF8F2] text-[11px] rounded-lg shadow-lg flex items-start gap-1.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-[#B85C43] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
