"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Speech-to-Text (STT) Module
 * Member B — AI Intelligence & Voice Interaction
 */

// Browser recognition types
type SpeechRecognitionType = any;

function getSpeechRecognitionConstructor(): any {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

export interface STTOptions {
  language?: string; // 'en-IN' | 'hi-IN' | 'kn-IN'
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const supported = isSpeechRecognitionSupported();

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Recognition stop error:", e);
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (options: STTOptions = {}) => {
      if (!supported) {
        setError("Speech recognition is not supported in this browser.");
        return;
      }

      setError(null);
      const SpeechRecognition = getSpeechRecognitionConstructor();
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = options.language || "en-IN";
      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = options.interimResults ?? true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          currentTranscript += res[0].transcript;
          if (res.isFinal) {
            isFinal = true;
          }
        }

        setTranscript(currentTranscript);
        if (options.onTranscript) {
          options.onTranscript(currentTranscript, isFinal);
        }
      };

      recognition.onerror = (event: any) => {
        const errorType = event.error;
        let userMessage = "Could not capture voice input. Please try typing.";
        if (errorType === "not-allowed" || errorType === "permission-denied") {
          userMessage = "Microphone access was denied. Please allow microphone access in browser settings.";
        } else if (errorType === "no-speech") {
          userMessage = "No speech was detected. Please try again.";
        }
        setError(userMessage);
        setIsListening(false);
        if (options.onError) {
          options.onError(userMessage);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (options.onEnd) {
          options.onEnd();
        }
      };

      try {
        recognition.start();
      } catch (err) {
        console.warn("Failed to start speech recognition:", err);
        setError("Failed to start microphone. Please try again.");
        setIsListening(false);
      }
    },
    [supported]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported: supported,
    startListening,
    stopListening,
  };
}
