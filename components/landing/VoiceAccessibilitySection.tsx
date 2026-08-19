"use client";

import React, { useState } from "react";
import { Mic, Volume2, Globe2, Sparkles, Check, Play, Pause } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";

export default function VoiceAccessibilitySection() {
  const [activeLang, setActiveLang] = useState<"hi" | "kn" | "en">("hi");
  const [playing, setPlaying] = useState(false);

  const samples = {
    hi: {
      label: "हिन्दी (Hindi)",
      spoken: "यह असम के बारपेटा का प्राकृतिक बांस का हस्तनिर्मित टोकरी है। 2 दिन की मेहनत।",
      generatedTitle: "असम हस्तशिल्प प्राकृतिक बांस भंडारण टोकरी",
      storyExcerpt: "पीढ़ी-दर-पीढ़ी चली आ रही परंपरा से तैयार, प्रत्येक बांस की पट्टी को ब्रह्मपुत्र नदी के किनारों से छांटकर बुना गया है।",
    },
    kn: {
      label: "ಕನ್ನಡ (Kannada)",
      spoken: "ಇದು ಬೀದರ್‌ನ ಸಾಂಪ್ರದಾಯಿಕ ಬಿದ್ರಿ ಮೆಟಲ್ ಹೂದಾನಿ. ಶುದ್ಧ ಬೆಳ್ಳಿ ತಂತಿಯ ಕೆತ್ತನೆ ಕೆಲಸ.",
      generatedTitle: "ಪ್ರಾಚೀನ ಬೀದ್ರಿ ಕರಕುಶಲ ಶುದ್ಧ ಬೆಳ್ಳಿ ಕೆತ್ತನೆಯ ಹೂದಾನಿ",
      storyExcerpt: "ಬೀದರ್ ಮಣ್ಣಿನ ವಿಶಿಷ್ಟ ಆಕ್ಸಿಡೀಕರಣ ಪ್ರಕ್ರಿಯೆಯಿಂದ ಕಡು ಕಪ್ಪು ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಹೊಳೆಯುವ ಶುದ್ಧ ಬೆಳ್ಳಿಯ ತಂತಿಗಳು.",
    },
    en: {
      label: "English",
      spoken: "Handwoven natural bamboo storage basket from Barpeta, Assam. 2 days of weaving.",
      generatedTitle: "Assam Handcrafted Split-Bamboo Storage Basket",
      storyExcerpt: "Harvested from mature floodplain bamboo, each strand is hand-split to preserve natural grain and river resilience.",
    },
  };

  const currentSample = samples[activeLang];

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentSample.storyExcerpt);
    utterance.lang = activeLang === "hi" ? "hi-IN" : activeLang === "kn" ? "kn-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  return (
    <section className="py-20 bg-[#FAF7F2] border-b border-[#D8D0C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85C43]/10 text-[#B85C43] border border-[#B85C43]/30 text-xs font-mono uppercase tracking-wider mb-4">
              <Globe2 className="size-3.5 text-[#B85C43]" />
              Inclusive Rural Accessibility
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E211F] tracking-tight">
              Speak in Your Mother Tongue. <br />
              VISART Does the Digital Heavy Lifting.
            </h2>
            <p className="text-sm sm:text-base text-[#68655F] mt-4 leading-relaxed">
              Designed specifically for artisans who prefer speaking over typing. Tap the microphone in your native language, and VISART crafts English, Hindi, and Kannada digital narratives instantly.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#D8D0C4] shadow-md p-6 sm:p-10 space-y-8">
          {/* Language Switcher Tabs */}
          <div className="flex justify-center gap-2">
            {(["hi", "kn", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  if (playing && typeof window !== "undefined") window.speechSynthesis.cancel();
                  setPlaying(false);
                  setActiveLang(lang);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeLang === lang
                    ? "bg-[#B85C43] text-white shadow-sm"
                    : "bg-[#F5F0E8] text-[#68655F] hover:text-[#1E211F]"
                }`}
              >
                {samples[lang].label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Input Spoken Voice Simulation */}
            <div className="p-6 rounded-2xl bg-[#F5F0E8] border border-[#D8D0C4] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#B85C43] font-semibold flex items-center gap-1.5">
                  <Mic className="size-4 animate-pulse text-[#B85C43]" />
                  Artisan Spoken Voice Input
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-[#68655F]">
                  Voice to Text
                </span>
              </div>

              <p className="font-serif-editorial text-base text-[#1E211F] italic bg-white p-4 rounded-xl border border-[#D8D0C4]">
                "{currentSample.spoken}"
              </p>

              <div className="flex items-center gap-2 text-xs text-[#68655F]">
                <Check className="size-4 text-emerald-600" />
                <span>Audio understood in native dialect</span>
              </div>
            </div>

            {/* Generated Output with Voice Playback */}
            <div className="p-6 rounded-2xl bg-[#1E211F] text-[#FBF8F2] border border-[#2E3330] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A88752] font-semibold">
                  Multilingual AI Narration
                </span>
                <button
                  onClick={toggleSpeech}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#A88752] hover:bg-[#8F7040] text-[#1E211F] text-xs font-bold rounded-lg transition-colors"
                >
                  {playing ? <Pause className="size-3.5" /> : <Volume2 className="size-3.5" />}
                  <span>{playing ? "Pause Audio" : "Listen to Story"}</span>
                </button>
              </div>

              <div>
                <h4 className="font-serif-editorial text-lg font-bold text-[#FBF8F2]">
                  {currentSample.generatedTitle}
                </h4>
                <p className="text-xs text-[#D8D0C4] mt-2 leading-relaxed">
                  {currentSample.storyExcerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A88752]">
                <span>✓ High-Fidelity Audio TTS Ready</span>
                <span>Zero Server Latency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
