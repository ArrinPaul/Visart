"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Button from "./Button";

export default function AccessibilityToggle() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Read from local storage
    const stored = localStorage.getItem("visart_accessibility");
    if (stored === "true") {
      setIsActive(true);
      document.body.classList.add("accessibility-mode");
    }
  }, []);

  const toggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    localStorage.setItem("visart_accessibility", String(newState));
    if (newState) {
      document.body.classList.add("accessibility-mode");
    } else {
      document.body.classList.remove("accessibility-mode");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggle}
      className={`fixed bottom-6 right-6 shadow-lg z-50 rounded-full h-12 px-6 flex items-center gap-2 ${
        isActive 
          ? 'bg-[#1E211F] text-[#FBF8F2] border-[#1E211F]' 
          : 'bg-[#FBF8F2] text-[#1E211F] border-[#D8D0C4]'
      }`}
    >
      <Eye className={`w-4 h-4 ${isActive ? 'text-[#A88752]' : 'text-[#B85C43]'}`} />
      <span className="font-semibold text-sm">
        {isActive ? "Standard Mode" : "Accessible Mode"}
      </span>
    </Button>
  );
}
