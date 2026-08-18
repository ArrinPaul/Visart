"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

const STAGES = [
  { id: "01", title: "Looking at your product", detail: "Analyzing photo composition and craft features..." },
  { id: "02", title: "Understanding the craft", detail: "Evaluating material, technique, and production effort..." },
  { id: "03", title: "Writing the listing", detail: "Structuring editorial title, tags, and story..." },
  { id: "04", title: "Preparing pricing guidance", detail: "Calculating fair artisan pricing models..." },
  { id: "05", title: "Preparing customer-ready content", detail: "Formatting Instagram, WhatsApp, and multilingual reach..." },
];

interface ProcessingStateProps {
  isComplete: boolean;
  error?: string | null;
  onComplete: () => void;
  onRetry?: () => void;
}

export default function ProcessingState({
  isComplete,
  error,
  onComplete,
  onRetry,
}: ProcessingStateProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Advance stages 01 -> 04 at steady editorial cadence (~500ms)
  useEffect(() => {
    if (error) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [error]);

  // When stage 05 is reached and backend is complete, trigger smooth completion
  useEffect(() => {
    if (currentStepIndex === STAGES.length - 1 && isComplete && !error) {
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isComplete, error, onComplete]);

  // If error occurred during generation
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#A34F4F]/10 text-[#A34F4F] flex items-center justify-center mb-6 border border-[#A34F4F]/30">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1E211F] mb-2">
          We couldn't finish this listing.
        </h2>
        <p className="text-xs text-[#68655F] mb-6 max-w-sm leading-relaxed">
          {error}
        </p>

        {onRetry && (
          <Button onClick={onRetry} size="md" variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Try again</span>
          </Button>
        )}
      </div>
    );
  }

  const isFinalizing = currentStepIndex === STAGES.length - 1 && !isComplete;

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-16 h-16 rounded-full bg-[#27344A] text-[#B85C43] flex items-center justify-center mb-6 shadow-md border border-[#A88752]"
      >
        <Sparkles className="w-8 h-8 animate-pulse text-[#A88752]" />
      </motion.div>

      <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1E211F] mb-2">
        Crafting Your Listing
      </h2>
      <p className="text-sm text-[#68655F] mb-8 max-w-md">
        VISART AI is analyzing your inputs and generating market-ready story assets.
      </p>

      {/* Vertical Steps */}
      <div className="w-full flex flex-col gap-4 text-left border-l-2 border-[#D8D0C4] pl-6 ml-4">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStepIndex || (idx === STAGES.length - 1 && isComplete);
          const isCurrent = idx === currentStepIndex && !isDone;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`relative flex items-start gap-4 transition-colors ${
                isCurrent 
                  ? "text-[#1E211F]" 
                  : isDone 
                  ? "text-[#54745A]" 
                  : "text-[#68655F]/40"
              }`}
            >
              {/* Step indicator circle */}
              <div 
                className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
                  isDone 
                    ? "bg-[#54745A] text-[#FBF8F2]" 
                    : isCurrent 
                    ? "bg-[#B85C43] text-[#FBF8F2] ring-4 ring-[#B85C43]/20" 
                    : "bg-[#F5F0E8] border border-[#D8D0C4] text-[#68655F]"
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : stage.id}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-base font-semibold ${isCurrent ? "text-[#1E211F]" : ""}`}>
                    {stage.title}
                  </h4>
                </div>

                {isCurrent && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-[#68655F] mt-0.5"
                  >
                    {stage.detail}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Honest active secondary status while backend completes */}
      {isFinalizing && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-2.5 px-4 py-2 bg-[#FBF8F2] border border-[#D8D0C4] rounded-full text-xs text-[#68655F] shadow-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-[#B85C43] animate-ping" />
          <span>Finalising your listing & saving workspace assets...</span>
        </motion.div>
      )}
    </div>
  );
}
