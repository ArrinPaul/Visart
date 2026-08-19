"use client";

import React, { useState } from "react";
import { X, Save, Sparkles, IndianRupee, Globe2, Share2, Layers } from "lucide-react";
import type { AdminProductSummary } from "@/types/admin";
import type { VisartGeneration } from "@/types/visart";

interface ProductEditModalProps {
  product: AdminProductSummary;
  onClose: () => void;
  onSave: (productId: string, updatedGeneration: Partial<VisartGeneration>) => Promise<void>;
}

export default function ProductEditModal({
  product,
  onClose,
  onSave,
}: ProductEditModalProps) {
  const gen = product.generated_data;

  const [title, setTitle] = useState(gen?.product?.title || "");
  const [shortDesc, setShortDesc] = useState(gen?.product?.shortDescription || "");
  const [desc, setDesc] = useState(gen?.product?.description || "");
  const [category, setCategory] = useState(gen?.product?.category || "");
  const [craftTechnique, setCraftTechnique] = useState(gen?.product?.craftTechnique || "");
  const [storyBody, setStoryBody] = useState(gen?.story?.body || "");

  // Pricing
  const [minPrice, setMinPrice] = useState(gen?.pricing?.min || 500);
  const [recPrice, setRecPrice] = useState(gen?.pricing?.recommended || 1200);
  const [maxPrice, setMaxPrice] = useState(gen?.pricing?.max || 1800);

  // Marketing
  const [instagram, setInstagram] = useState(gen?.marketing?.instagram || "");
  const [whatsapp, setWhatsapp] = useState(gen?.marketing?.whatsapp || "");

  // Translations
  const [hindiTitle, setHindiTitle] = useState(gen?.translations?.hindi?.title || "");
  const [hindiDesc, setHindiDesc] = useState(gen?.translations?.hindi?.description || "");
  const [kannadaTitle, setKannadaTitle] = useState(gen?.translations?.kannada?.title || "");
  const [kannadaDesc, setKannadaDesc] = useState(gen?.translations?.kannada?.description || "");

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "story" | "translations" | "marketing">("general");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const patch: Partial<VisartGeneration> = {
        product: {
          ...gen.product,
          title,
          shortDescription: shortDesc,
          description: desc,
          category,
          craftTechnique,
        },
        pricing: {
          ...gen.pricing,
          min: Number(minPrice),
          recommended: Number(recPrice),
          max: Number(maxPrice),
        },
        story: {
          ...gen.story,
          body: storyBody,
        },
        marketing: {
          ...gen.marketing,
          instagram,
          whatsapp,
        },
        translations: {
          hindi: {
            title: hindiTitle,
            description: hindiDesc,
          },
          kannada: {
            title: kannadaTitle,
            description: kannadaDesc,
          },
        },
      };

      await onSave(product.id, patch);
      onClose();
    } catch (err) {
      console.error("Save product failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F5F0E8] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-[#D8D0C4] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1E211F] text-[#F5F0E8] flex items-center justify-between border-b border-[#2E3330]">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#B85C43] flex items-center justify-center text-white">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg font-bold text-[#FBF8F2]">
                Edit Craft Listing & Story
              </h2>
              <p className="text-xs text-[#A88752]">ID: {product.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-white/10 hover:bg-white/20 text-[#D8D0C4] flex items-center justify-center transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#D8D0C4] bg-white/60 px-6 gap-2 overflow-x-auto">
          {[
            { id: "general", label: "Product Info", icon: Layers },
            { id: "pricing", label: "Fair Pricing", icon: IndianRupee },
            { id: "story", label: "Artisan Story", icon: Sparkles },
            { id: "translations", label: "Translations", icon: Globe2 },
            { id: "marketing", label: "Marketing Copy", icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                  active
                    ? "border-[#B85C43] text-[#B85C43]"
                    : "border-transparent text-[#68655F] hover:text-[#1E211F]"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                  Short One-Line Editorial Hook
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                    Craft Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                    Craft Technique
                  </label>
                  <input
                    type="text"
                    value={craftTechnique}
                    onChange={(e) => setCraftTechnique(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                  Full Catalogue Description
                </label>
                <textarea
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800">
                Adjust calculated fair pricing bounds based on artisan raw material costs and master hours.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                    Floor Price (Min INR)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                    Recommended Fair Price (INR)
                  </label>
                  <input
                    type="number"
                    value={recPrice}
                    onChange={(e) => setRecPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm font-bold text-[#B85C43] focus:outline-none focus:border-[#B85C43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                    Premium Gallery Price (Max INR)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "story" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                  Artisan Provenance Story
                </label>
                <textarea
                  rows={6}
                  value={storyBody}
                  onChange={(e) => setStoryBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              </div>
            </div>
          )}

          {activeTab === "translations" && (
            <div className="space-y-6">
              {/* Hindi */}
              <div className="p-4 bg-white rounded-xl border border-[#D8D0C4] space-y-3">
                <span className="text-xs font-bold text-[#B85C43] uppercase tracking-wider">
                  Hindi (हिन्दी)
                </span>
                <div>
                  <label className="block text-xs text-[#68655F] mb-1">शीर्षक (Title)</label>
                  <input
                    type="text"
                    value={hindiTitle}
                    onChange={(e) => setHindiTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#68655F] mb-1">विवरण (Description)</label>
                  <textarea
                    rows={3}
                    value={hindiDesc}
                    onChange={(e) => setHindiDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Kannada */}
              <div className="p-4 bg-white rounded-xl border border-[#D8D0C4] space-y-3">
                <span className="text-xs font-bold text-[#A88752] uppercase tracking-wider">
                  Kannada (ಕನ್ನಡ)
                </span>
                <div>
                  <label className="block text-xs text-[#68655F] mb-1">ಶೀರ್ಷಿಕೆ (Title)</label>
                  <input
                    type="text"
                    value={kannadaTitle}
                    onChange={(e) => setKannadaTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#68655F] mb-1">ವಿವರಣೆ (Description)</label>
                  <textarea
                    rows={3}
                    value={kannadaDesc}
                    onChange={(e) => setKannadaDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "marketing" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                  Instagram Caption & Hashtags
                </label>
                <textarea
                  rows={4}
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E211F] mb-1">
                  WhatsApp Direct Buyer Broadcast
                </label>
                <textarea
                  rows={4}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#D8D0C4] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#68655F] hover:bg-[#EBE3D5] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-[#B85C43] hover:bg-[#9E4730] text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="size-4" />
              <span>{saving ? "Saving Changes..." : "Save Product Story"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
