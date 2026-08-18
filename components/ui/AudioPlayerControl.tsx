"use client";

import React from "react";
import { useAudioPlayer, TTSLanguage } from "@/lib/audio/tts";
import { Volume2, Play, Pause, Square } from "lucide-react";

interface AudioPlayerControlProps {
  text: string;
  language?: TTSLanguage;
  label?: string;
  variant?: "pill" | "banner" | "compact";
  className?: string;
}

export function AudioPlayerControl({
  text,
  language = "en",
  label = "Listen to Story",
  variant = "pill",
  className = "",
}: AudioPlayerControlProps) {
  const [mounted, setMounted] = React.useState(false);
  const { isPlaying, isPaused, isSupported, play, pause, resume, stop } =
    useAudioPlayer();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isSupported) {
    return null;
  }

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      play(text, language);
    }
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? "Pause audio narration" : "Play audio narration"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85C43] ${
          isPlaying
            ? "bg-[#B85C43] text-[#FBF8F2] animate-pulse"
            : "bg-[#F5F0E8] text-[#1E211F] hover:bg-[#D8D0C4]/60 border border-[#D8D0C4]"
        } ${className}`}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : isPaused ? (
          <Play className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#B85C43]" />
        )}
        <span>{isPlaying ? "Pause" : isPaused ? "Resume" : label}</span>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`flex items-center justify-between p-3.5 rounded-xl border border-[#D8D0C4] bg-[#FBF8F2] shadow-xs ${className}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isPlaying
                ? "bg-[#B85C43] text-[#FBF8F2]"
                : "bg-[#B85C43]/10 text-[#B85C43]"
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1E211F]">{label}</div>
            <div className="text-[11px] text-[#68655F]">
              {isPlaying
                ? "Speaking artisan narration aloud..."
                : isPaused
                ? "Narration paused"
                : "Listen to the craft description and story"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause audio narration" : "Play audio narration"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E211F] text-[#FBF8F2] text-xs font-semibold hover:bg-[#27344A] transition-colors shadow-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play Voice</span>
              </>
            )}
          </button>

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop audio narration"
              className="p-1.5 rounded-lg text-[#68655F] hover:text-[#A34F4F] hover:bg-[#F5F0E8] transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default "pill" variant
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? "Pause audio narration" : "Play audio narration"}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85C43] ${
          isPlaying
            ? "bg-[#B85C43] text-[#FBF8F2] ring-2 ring-[#B85C43]/40"
            : isPaused
            ? "bg-[#A88752] text-[#FBF8F2]"
            : "bg-[#1E211F] text-[#FBF8F2] hover:bg-[#27344A]"
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5" />
            <span>Pause Voice</span>
          </>
        ) : isPaused ? (
          <>
            <Play className="w-3.5 h-3.5" />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#FBF8F2]" />
            <span>{label}</span>
          </>
        )}
      </button>

      {(isPlaying || isPaused) && (
        <button
          type="button"
          onClick={stop}
          aria-label="Stop audio playback"
          className="p-1.5 rounded-full bg-[#F5F0E8] border border-[#D8D0C4] text-[#68655F] hover:text-[#A34F4F] transition-colors"
        >
          <Square className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
