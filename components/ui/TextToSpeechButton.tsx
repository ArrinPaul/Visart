"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Volume2, Square } from "lucide-react";

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function TextToSpeechButton({ text, className = "", size = "sm" }: TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Button
      variant="outline"
      size={size}
      className={`flex items-center gap-1.5 ${isPlaying ? 'bg-[#A34F4F] text-white border-[#A34F4F] hover:bg-[#8A4242]' : 'border-[#D8D0C4] text-[#1E211F] hover:bg-[#F5F0E8]'} ${className}`}
      onClick={toggleSpeech}
      title={isPlaying ? "Stop Reading" : "Read Aloud"}
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#B85C43]" />
          <span>Read Aloud</span>
        </>
      )}
    </Button>
  );
}
