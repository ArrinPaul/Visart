"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Text-to-Speech (TTS) Platform Module
 * Member C — Platform / Data Engineer (V2 Accessibility & Voice)
 */

export type TTSLanguage = "en" | "hi" | "kn";
export type TTSState = "IDLE" | "PLAYING" | "PAUSED" | "STOPPED" | "ERROR";

export interface TTSOptions {
  language?: TTSLanguage;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (err: unknown) => void;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("Error cancelling speech synthesis:", e);
    }
  }
}

export function pauseSpeaking(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.pause();
    } catch (e) {
      console.warn("Error pausing speech synthesis:", e);
    }
  }
}

export function resumeSpeaking(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.resume();
    } catch (e) {
      console.warn("Error resuming speech synthesis:", e);
    }
  }
}

// Cache available voices in memory
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Finds the most authentic voice available in the client browser for the requested language
 */
export function getBestVoiceForLanguage(language: TTSLanguage): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices || voices.length === 0) {
    return null;
  }

  const langKey = language.toLowerCase();

  if (langKey === "hi") {
    // 1. Exact hi-IN match
    const hiIn = voices.find((v) => v.lang === "hi-IN" || v.lang === "hi_IN");
    if (hiIn) return hiIn;

    // 2. Any voice starting with hi
    const hiAny = voices.find((v) => v.lang.toLowerCase().startsWith("hi"));
    if (hiAny) return hiAny;

    // 3. Voice with Hindi in name
    const hiNamed = voices.find(
      (v) =>
        v.name.toLowerCase().includes("hindi") ||
        v.name.includes("हिन्दी") ||
        v.name.toLowerCase().includes("swara") ||
        v.name.toLowerCase().includes("hemant") ||
        v.name.toLowerCase().includes("kalpana")
    );
    if (hiNamed) return hiNamed;

    // 4. Fallback to Indian English voice which handles Indian phonemes best
    const inEn = voices.find((v) => v.lang === "en-IN" || v.lang === "en_IN");
    if (inEn) return inEn;
  } else if (langKey === "kn") {
    // 1. Exact kn-IN match
    const knIn = voices.find((v) => v.lang === "kn-IN" || v.lang === "kn_IN");
    if (knIn) return knIn;

    // 2. Any voice starting with kn
    const knAny = voices.find((v) => v.lang.toLowerCase().startsWith("kn"));
    if (knAny) return knAny;

    // 3. Voice with Kannada in name
    const knNamed = voices.find(
      (v) =>
        v.name.toLowerCase().includes("kannada") ||
        v.name.includes("ಕನ್ನಡ") ||
        v.name.toLowerCase().includes("gagan") ||
        v.name.toLowerCase().includes("sapna")
    );
    if (knNamed) return knNamed;

    // 4. Fallback to Hindi or Indian English voice
    const hiFallback = voices.find((v) => v.lang.toLowerCase().startsWith("hi"));
    if (hiFallback) return hiFallback;
    const inEn = voices.find((v) => v.lang === "en-IN" || v.lang === "en_IN");
    if (inEn) return inEn;
  } else {
    // English: Prefer en-IN Indian English for regional authenticity, then standard en
    const enIn = voices.find((v) => v.lang === "en-IN" || v.lang === "en_IN");
    if (enIn) return enIn;

    const enAny = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    if (enAny) return enAny;
  }

  return voices[0] || null;
}

export function speakText(text: string, options: TTSOptions = {}): boolean {
  if (!isSpeechSupported()) {
    console.warn("Speech synthesis is not supported on this platform.");
    return false;
  }

  const {
    language = "en",
    rate = 0.92,
    pitch = 1.0,
    onStart,
    onEnd,
    onPause,
    onResume,
    onError,
  } = options;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Map language code to regional locale
    let targetLocale = "en-IN";
    if (language === "hi") {
      targetLocale = "hi-IN";
    } else if (language === "kn") {
      targetLocale = "kn-IN";
    } else {
      targetLocale = "en-IN";
    }

    utterance.lang = targetLocale;

    // Assign matched browser voice
    const matchedVoice = getBestVoiceForLanguage(language);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = language === "en" ? rate : 0.88; // Slightly more paced for non-English clarity
    utterance.pitch = pitch;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onPause) utterance.onpause = onPause;
    if (onResume) utterance.onresume = onResume;
    if (onError) utterance.onerror = onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn("TTS error:", err);
    if (onError) onError(err);
    return false;
  }
}

/**
 * React hook for managing interactive Audio Player state
 */
export function useAudioPlayer() {
  const [state, setState] = useState<TTSState>("IDLE");
  const [activeText, setActiveText] = useState<string>("");
  const supported = isSpeechSupported();
  const stateRef = useRef<TTSState>("IDLE");

  stateRef.current = state;

  const handleStop = useCallback(() => {
    stopSpeaking();
    setState("STOPPED");
    setTimeout(() => setState("IDLE"), 600);
  }, []);

  const handlePause = useCallback(() => {
    pauseSpeaking();
    setState("PAUSED");
  }, []);

  const handleResume = useCallback(() => {
    resumeSpeaking();
    setState("PLAYING");
  }, []);

  const play = useCallback(
    (text: string, language: TTSLanguage = "en") => {
      if (!supported || !text.trim()) {
        setState("ERROR");
        return;
      }

      setActiveText(text);
      setState("PLAYING");

      speakText(text, {
        language,
        onStart: () => setState("PLAYING"),
        onEnd: () => {
          setState("STOPPED");
          setTimeout(() => setState("IDLE"), 400);
        },
        onPause: () => setState("PAUSED"),
        onResume: () => setState("PLAYING"),
        onError: () => setState("ERROR"),
      });
    },
    [supported]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return {
    state,
    isPlaying: state === "PLAYING",
    isPaused: state === "PAUSED",
    isSupported: supported,
    activeText,
    play,
    pause: handlePause,
    resume: handleResume,
    stop: handleStop,
  };
}
