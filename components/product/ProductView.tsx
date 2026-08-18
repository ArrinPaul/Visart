'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductRecord } from '@/types/visart';
import { LanguageSwitcher, type LanguageCode } from './LanguageSwitcher';
import {
  Share2,
  MessageCircle,
  MapPin,
  Clock,
  Hammer,
  ShieldCheck,
  Check,
  ArrowLeft,
  Sparkles,
  Info,
  ExternalLink,
  Volume2,
} from 'lucide-react';

interface ProductViewProps {
  product: ProductRecord;
}

export function ProductView({ product }: ProductViewProps) {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const gen = product.generated_data;
  const input = product.input_data;
  const artisan = product.artisan;

  // Language translation selector
  let activeTitle = gen.product.title;
  let activeDescription = gen.product.description;

  if (language === 'hi' && gen.translations?.hindi) {
    activeTitle = gen.translations.hindi.title || gen.product.title;
    activeDescription = gen.translations.hindi.description || gen.product.description;
  } else if (language === 'kn' && gen.translations?.kannada) {
    activeTitle = gen.translations.kannada.title || gen.product.title;
    activeDescription = gen.translations.kannada.description || gen.product.description;
  }

  // Handle Share to clipboard
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Handle WhatsApp inquiry
  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello! I am interested in purchasing "${gen.product.title}" listed on VISART (Price: ₹${gen.pricing.recommended.toLocaleString('en-IN')}). Could you please share more details?`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Text-to-speech helper (V2 platform feature)
  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${activeTitle}. Price: ${gen.pricing.recommended} rupees. Made from ${gen.product.material}. ${activeDescription}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Choose voice language
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'kn') utterance.lang = 'kn-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1E211F]">
      {/* Top Editorial Header */}
      <header className="sticky top-0 z-30 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[#D8D0C4] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/workspace"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#68655F] hover:text-[#B85C43] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace</span>
            </Link>
            <span className="text-[#D8D0C4]">|</span>
            <Link href="/" className="font-serif text-lg font-bold tracking-tight text-[#1E211F]">
              VISART
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher
              currentLanguage={language}
              onSelectLanguage={setLanguage}
            />

            <button
              type="button"
              onClick={handleReadAloud}
              title="Read aloud"
              className={`p-2 rounded-lg border transition-colors ${
                isSpeaking
                  ? 'bg-[#B85C43] text-white border-[#B85C43]'
                  : 'bg-[#FBF8F2] text-[#1E211F] border-[#D8D0C4] hover:bg-[#F5F0E8]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-lg text-xs font-medium text-[#1E211F] hover:bg-[#F5F0E8] transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#54745A]" />
                  <span className="text-[#54745A]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#68655F]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Catalogue Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Dominant Product Image */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#FBF8F2] border border-[#D8D0C4] shadow-sm">
              <Image
                src={product.image_url || 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80'}
                alt={gen.product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#1E211F]/80 backdrop-blur-md text-[#FBF8F2] text-xs font-medium uppercase tracking-wider rounded-full">
                  Authentic Artisan Craft
                </span>
              </div>
            </div>

            {/* Micro Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {gen.product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#FBF8F2] border border-[#D8D0C4] text-xs font-medium text-[#68655F] rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Direct WhatsApp Contact Card */}
            <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1E211F]">
                    Inquire Directly with the Artisan
                  </h3>
                  <p className="text-xs text-[#68655F]">
                    Direct connection · Fair wages · Zero middleman commission
                  </p>
                </div>
                <div className="p-2 bg-[#54745A]/10 text-[#54745A] rounded-full">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#54745A] hover:bg-[#435e48] text-[#FBF8F2] rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Artisan on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Catalogue Details */}
          <div className="lg:col-span-6 space-y-8">
            {/* Header / Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85C43]">
                <span>{gen.product.category || 'Handcrafted Collection'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#68655F]">
                  <MapPin className="w-3.5 h-3.5" />
                  {artisan?.location || input.location || 'India'}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[#1E211F]">
                {activeTitle}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#27344A]">
                  ₹{gen.pricing.recommended.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#68655F]">
                  (Guidance Range: ₹{gen.pricing.min.toLocaleString('en-IN')} – ₹{gen.pricing.max.toLocaleString('en-IN')})
                </span>
              </div>
            </div>

            {/* Short Description */}
            <div className="p-4 bg-[#FBF8F2] border-l-4 border-[#B85C43] rounded-r-xl">
              <p className="text-sm italic text-[#68655F] leading-relaxed">
                {gen.product.shortDescription}
              </p>
            </div>

            {/* Full Product Description */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#68655F]">
                About This Handcrafted Piece
              </h2>
              <div className="prose prose-stone text-sm leading-relaxed text-[#1E211F]/90 space-y-3">
                <p>{activeDescription}</p>
              </div>
            </div>

            {/* Craft Facts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#68655F] uppercase">
                  <Hammer className="w-3.5 h-3.5 text-[#A88752]" />
                  <span>Material</span>
                </div>
                <p className="text-xs font-medium text-[#1E211F]">
                  {gen.product.material || input.material}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#68655F] uppercase">
                  <Clock className="w-3.5 h-3.5 text-[#A88752]" />
                  <span>Time to Create</span>
                </div>
                <p className="text-xs font-medium text-[#1E211F]">
                  {input.timeRequired || 'Handcrafted'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#68655F] uppercase">
                  <MapPin className="w-3.5 h-3.5 text-[#A88752]" />
                  <span>Origin</span>
                </div>
                <p className="text-xs font-medium text-[#1E211F]">
                  {input.location || 'India'}
                </p>
              </div>
            </div>

            {/* Artisan Story Card */}
            {gen.story?.body && (
              <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B85C43]" />
                  <h3 className="font-serif text-lg font-bold text-[#1E211F]">
                    {gen.story.title || "The Artisan's Story"}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#68655F] leading-relaxed font-sans">
                  {gen.story.body}
                </p>
                {artisan?.name && (
                  <p className="text-xs font-medium text-[#1E211F] pt-1">
                    — Handcrafted by <span className="font-semibold">{artisan.name}</span>
                  </p>
                )}
              </div>
            )}

            {/* Pricing Transparency Rationale */}
            {gen.pricing?.rationale && gen.pricing.rationale.length > 0 && (
              <div className="p-5 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  <Info className="w-3.5 h-3.5 text-[#A88752]" />
                  <span>Fair Pricing Rationale</span>
                </div>
                <ul className="space-y-2 text-xs text-[#68655F]">
                  {gen.pricing.rationale.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B85C43] mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-[#68655F]/80 italic pt-1 border-t border-[#D8D0C4]/60">
                  {gen.pricing.disclaimer}
                </p>
              </div>
            )}

            {/* Footer Workspace Link */}
            <div className="pt-4 flex items-center justify-between text-xs text-[#68655F] border-t border-[#D8D0C4]">
              <span>Catalogue ID: <code className="text-[#1E211F]">{product.id}</code></span>
              <Link
                href="/workspace"
                className="flex items-center gap-1 font-medium text-[#B85C43] hover:underline"
              >
                <span>Edit or refine in Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
