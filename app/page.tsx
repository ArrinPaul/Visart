import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Globe, TrendingUp } from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/data/seed';

export default function LandingPage() {
  const featured = SEED_PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1E211F]">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[#D8D0C4] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#1E211F]">
            VISART
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#68655F] hover:text-[#1E211F] transition-colors"
            >
              Workspace
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 bg-[#27344A] hover:bg-[#1E211F] text-[#FBF8F2] text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              Create My Listing
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B85C43]/10 text-[#B85C43] rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>InHack · Problem Statement 2 — Empowering Artisans</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] text-[#1E211F]">
              YOUR CRAFT. <br />
              <span className="italic font-serif text-[#B85C43]">DIGITALLY UNDERSTOOD.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#68655F] leading-relaxed max-w-xl">
              Show VISART what you make. We’ll turn a single craft photograph and a few basic facts into a professional digital listing, fair price guidance, marketing copy, and multilingual reach.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/workspace"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B85C43] hover:bg-[#a34f37] text-white text-sm font-semibold rounded-xl transition-all shadow-md"
              >
                <span>Explore Live Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/product/${featured.id}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FBF8F2] border border-[#D8D0C4] text-[#1E211F] text-sm font-semibold rounded-xl hover:bg-[#F5F0E8] transition-colors"
              >
                <span>View Sample Catalogue</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#FBF8F2] border border-[#D8D0C4] shadow-xl">
              <Image
                src={featured.image_url}
                alt={featured.generated_data.product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E211F]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#A88752] font-semibold">
                  Featured Masterpiece
                </span>
                <h3 className="font-serif text-xl font-bold">
                  {featured.generated_data.product.title}
                </h3>
                <p className="text-xs text-[#D8D0C4]">
                  {featured.artisan?.name} · {featured.artisan?.location} · ₹{featured.generated_data.pricing.recommended}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Editorial Problem/Solution Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#D8D0C4]">
          <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
            <div className="p-2.5 bg-[#B85C43]/10 text-[#B85C43] rounded-xl w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E211F]">
              Professional Writing
            </h3>
            <p className="text-xs text-[#68655F] leading-relaxed">
              Turn simple product facts into search-optimized titles, rich descriptions, and authentic artisan stories.
            </p>
          </div>

          <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
            <div className="p-2.5 bg-[#54745A]/10 text-[#54745A] rounded-xl w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E211F]">
              Transparent Pricing
            </h3>
            <p className="text-xs text-[#68655F] leading-relaxed">
              Receive AI-assisted valuation grounded in actual material costs, hours of labour, and fair artisan wages.
            </p>
          </div>

          <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-2xl space-y-3">
            <div className="p-2.5 bg-[#27344A]/10 text-[#27344A] rounded-xl w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E211F]">
              Multilingual Reach
            </h3>
            <p className="text-xs text-[#68655F] leading-relaxed">
              Instantly produce customer-ready marketing copy and natural translations in Hindi, Kannada, and English.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
