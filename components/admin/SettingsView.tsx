"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  Sparkles,
  Shield,
  Volume2,
  Sliders,
  CheckCircle,
} from "lucide-react";
import type { AdminSystemSettings } from "@/types/admin";

interface SettingsViewProps {
  settings: AdminSystemSettings | null;
  onUpdateSettings: (patch: Partial<AdminSystemSettings>) => Promise<void>;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
}: SettingsViewProps) {
  const [siteTitle, setSiteTitle] = useState(
    settings?.siteTitle || "VISART — Artisan Studio & Craft CMS"
  );
  const [maintenanceMode, setMaintenanceMode] = useState(
    settings?.maintenanceMode || false
  );
  const [geminiModel, setGeminiModel] = useState(
    settings?.geminiModel || "gemini-3.5-flash"
  );
  const [autoModerateReviews, setAutoModerateReviews] = useState(
    settings?.autoModerateReviews !== false
  );
  const [counterfeitThreshold, setCounterfeitThreshold] = useState(
    settings?.counterfeitThresholdRisk || 40
  );
  const [enableAudioTTS, setEnableAudioTTS] = useState(
    settings?.enableAudioTTS !== false
  );
  const [pricingMultiplier, setPricingMultiplier] = useState(
    settings?.defaultPricingMultiplier || 2.2
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await onUpdateSettings({
        siteTitle,
        maintenanceMode,
        geminiModel,
        autoModerateReviews,
        counterfeitThresholdRisk: Number(counterfeitThreshold),
        enableAudioTTS,
        defaultPricingMultiplier: Number(pricingMultiplier),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Save banner on success */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle className="size-4 text-emerald-600" />
          <span>Platform configuration updated successfully.</span>
        </div>
      )}

      {/* AI & Generation Engine Settings */}
      <div className="bg-white p-6 rounded-2xl border border-[#D8D0C4] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-[#B85C43]" />
          <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
            AI Generation Engine
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1E211F] mb-1">
              Active Gemini AI Model
            </label>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] font-semibold focus:outline-none focus:border-[#B85C43]"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Production Default — Ultra Fast)</option>
              <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (Lowest Latency)</option>
              <option value="gemini-3.6-flash">Gemini 3.6 Flash (High Precision)</option>
              <option value="gemini-3.7-flash">Gemini 3.7 Flash (High Performance)</option>
            </select>
            <p className="text-[#68655F] mt-1 text-[11px]">
              Powers multi-language translations (Hindi, Kannada), fair price calculation, and artisan story writing.
            </p>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1E211F] mb-1">
              Default Fair Price Multiplier (Artisan Cost × N)
            </label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="5.0"
              value={pricingMultiplier}
              onChange={(e) => setPricingMultiplier(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
            />
            <p className="text-[#68655F] mt-1 text-[11px]">
              Calculates standard fair retail price from master material & craft time expenses.
            </p>
          </div>
        </div>
      </div>

      {/* Review Moderation & Authenticity Guard */}
      <div className="bg-white p-6 rounded-2xl border border-[#D8D0C4] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-[#A88752]" />
          <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
            Authenticity & Review Moderation Guard
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-[#EBE3D5]">
            <div>
              <p className="font-bold text-[#1E211F]">Automated AI Review Verification</p>
              <p className="text-[11px] text-[#68655F]">
                Automatically audit customer comments with Gemini for counterfeit replica signs.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoModerateReviews}
              onChange={(e) => setAutoModerateReviews(e.target.checked)}
              className="size-5 accent-[#B85C43] rounded"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold uppercase tracking-wider text-[#1E211F]">
                Counterfeit Risk Threshold Alert: {counterfeitThreshold}%
              </label>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={counterfeitThreshold}
              onChange={(e) => setCounterfeitThreshold(Number(e.target.value))}
              className="w-full accent-[#B85C43]"
            />
            <p className="text-[#68655F] mt-1 text-[11px]">
              Reviews scoring above this counterfeit risk percentage will be flagged for administrative review.
            </p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white p-6 rounded-2xl border border-[#D8D0C4] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="size-5 text-[#1E211F]" />
          <h3 className="font-serif-editorial text-lg font-bold text-[#1E211F]">
            Platform Governance
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1E211F] mb-1">
              Platform Brand Name
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#EBE3D5]">
            <div>
              <p className="font-bold text-[#1E211F]">Multilingual Audio Narration (TTS)</p>
              <p className="text-[11px] text-[#68655F]">
                Enable voice readout for inclusive artisan accessibility.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enableAudioTTS}
              onChange={(e) => setEnableAudioTTS(e.target.checked)}
              className="size-5 accent-[#B85C43] rounded"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-bold text-[#1E211F]">Maintenance Mode</p>
              <p className="text-[11px] text-[#68655F]">
                Temporarily pause new customer submissions while updating databases.
              </p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="size-5 accent-[#B85C43] rounded"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#B85C43] hover:bg-[#9E4730] text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
        >
          <Save className="size-4" />
          <span>{saving ? "Saving Configuration..." : "Save Settings"}</span>
        </button>
      </div>
    </form>
  );
}
