"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AccessibilityPreferences,
  DEFAULT_PREFERENCES,
  getStoredPreferences,
  saveStoredPreferences,
} from "@/lib/storage/preferences";

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  resetPreferences: () => void;
  isAccessibleModeActive: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const stored = getStoredPreferences();
    setPreferences(stored);
    applyPreferences(stored);
  }, []);

  const applyPreferences = (prefs: AccessibilityPreferences) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Font size
    root.setAttribute("data-font-size", prefs.fontSize);

    // High contrast
    if (prefs.highContrast) {
      root.setAttribute("data-contrast", "high");
    } else {
      root.removeAttribute("data-contrast");
    }

    // Reduced motion
    if (prefs.reducedMotion) {
      root.setAttribute("data-reduced-motion", "true");
    } else {
      root.removeAttribute("data-reduced-motion");
    }
  };

  const updatePreferences = (updates: Partial<AccessibilityPreferences>) => {
    const updated = saveStoredPreferences(updates);
    setPreferences(updated);
    applyPreferences(updated);
  };

  const resetPreferences = () => {
    const reset = saveStoredPreferences(DEFAULT_PREFERENCES);
    setPreferences(reset);
    applyPreferences(reset);
  };

  const isAccessibleModeActive =
    preferences.fontSize !== "normal" ||
    preferences.highContrast ||
    preferences.reducedMotion ||
    preferences.simplifiedLanguage;

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        isAccessibleModeActive,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
