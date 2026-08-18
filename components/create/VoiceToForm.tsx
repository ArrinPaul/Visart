"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import { Mic, Loader2, StopCircle } from "lucide-react";
import { ProductFormData } from "@/types/frontend";

interface VoiceToFormProps {
  onExtracted: (data: Partial<ProductFormData>) => void;
}

export default function VoiceToForm({ onExtracted }: VoiceToFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = async (event: any) => {
      setIsRecording(false);
      setIsProcessing(true);
      
      const transcript = event.results[0][0].transcript;
      
      try {
        const response = await fetch("/api/voice/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });

        if (response.ok) {
          const data = await response.json();
          onExtracted({
            material: data.material || undefined,
            productionCost: data.productionCost || undefined,
            timeRequired: data.timeRequired || undefined,
            location: data.location || undefined,
            specialStory: data.story || undefined,
          });
        }
      } catch (error) {
        console.error("Failed to extract voice to form", error);
      } finally {
        setIsProcessing(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  if (isProcessing) {
    return (
      <Button type="button" variant="outline" className="flex items-center gap-2 border-[#D8D0C4]" disabled>
        <Loader2 className="w-4 h-4 animate-spin text-[#B85C43]" />
        <span className="text-sm">Extracting details...</span>
      </Button>
    );
  }

  return (
    <Button 
      type="button" 
      variant={isRecording ? "primary" : "outline"}
      className={`flex items-center gap-2 ${!isRecording ? 'border-[#D8D0C4] text-[#1E211F]' : 'bg-[#B85C43] hover:bg-[#A34F4F] text-white'}`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? (
        <>
          <StopCircle className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Stop Recording</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-[#B85C43]" />
          <span className="text-sm">Dictate Details</span>
        </>
      )}
    </Button>
  );
}
