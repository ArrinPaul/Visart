"use client";

import React from "react";
import { WorkspaceTab } from "@/types/frontend";
import { FileText, Tag, Share2, Globe, Award } from "lucide-react";

interface WorkspaceTabsProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}

export default function WorkspaceTabs({ activeTab, onTabChange }: WorkspaceTabsProps) {
  const tabs: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "LISTING", label: "Listing", icon: FileText },
    { id: "PRICING", label: "Pricing", icon: Tag },
    { id: "MARKETING", label: "Marketing", icon: Share2 },
    { id: "REACH", label: "Reach", icon: Globe },
    { id: "READINESS", label: "Readiness", icon: Award },
  ];

  return (
    <div className="flex border-b border-[#D8D0C4] overflow-x-auto no-scrollbar gap-2 sm:gap-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? "border-[#B85C43] text-[#1E211F] font-semibold"
                : "border-transparent text-[#68655F] hover:text-[#1E211F] hover:border-[#D8D0C4]"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-[#B85C43]" : "text-[#68655F]"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
