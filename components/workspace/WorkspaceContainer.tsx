'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductRecord, VisartGeneration } from '@/types/visart';
import { WorkspaceTabs } from './WorkspaceTabs';
import { updateProductData, getProductById } from '@/lib/supabase/products';
import { SEED_PRODUCTS } from '@/lib/data/seed';
import {
  Sparkles,
  ExternalLink,
  PlusCircle,
  Award,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

interface WorkspaceContainerProps {
  initialProduct: ProductRecord;
  recentProducts?: ProductRecord[];
}

export function WorkspaceContainer({
  initialProduct,
  recentProducts = SEED_PRODUCTS,
}: WorkspaceContainerProps) {
  const [product, setProduct] = useState<ProductRecord>(initialProduct);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync client-side cached product (from localStorage/sessionStorage) if SSR fell back to seed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedId = urlParams.get('id');
      if (requestedId && requestedId !== product.id) {
        getProductById(requestedId).then((found) => {
          if (found) {
            console.log(`[VISART DEBUG] WorkspaceContainer hydrated requested product: "${found.generated_data.product.title}"`);
            setProduct(found);
          }
        });
      }
    }
  }, [product.id]);

  const gen = product.generated_data;
  const input = product.input_data;
  const artisan = product.artisan;

  // Handle generation updates from tabs
  const handleUpdateGeneration = async (updatedGen: VisartGeneration) => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await updateProductData(product.id, updatedGen);
      if (updated) {
        setProduct(updated);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.warn('Failed to update product:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Switch between demo products
  const handleSelectProduct = (selected: ProductRecord) => {
    setProduct(selected);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1E211F]">
      {/* Top Workspace Header */}
      <header className="sticky top-0 z-30 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[#D8D0C4] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#1E211F]">
              VISART
            </Link>
            <span className="px-2 py-0.5 bg-[#B85C43]/10 text-[#B85C43] text-[11px] font-semibold tracking-wider uppercase rounded-md">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Demo Product Switcher */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#68655F]">
              <span>Sample Craft:</span>
              <select
                value={product.id}
                onChange={(e) => {
                  const target = recentProducts.find((p) => p.id === e.target.value);
                  if (target) handleSelectProduct(target);
                }}
                className="bg-[#FBF8F2] border border-[#D8D0C4] text-[#1E211F] text-xs font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#B85C43]"
              >
                {recentProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.generated_data.product.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/create"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF8F2] border border-[#D8D0C4] text-xs font-medium text-[#1E211F] rounded-lg hover:bg-[#F5F0E8] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#B85C43]" />
              <span className="hidden sm:inline">New Listing</span>
            </Link>

            <Link
              href={`/product/${product.id}`}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27344A] hover:bg-[#1E211F] text-[#FBF8F2] text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>View Product Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Banner Section: Ready Notice & Hero Summary */}
        <div className="p-6 sm:p-8 bg-[#FBF8F2] border border-[#D8D0C4] rounded-3xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Product Thumbnail & Title */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#F5F0E8] border border-[#D8D0C4] flex-shrink-0 shadow-inner">
                <Image
                  src={product.image_url || 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80'}
                  alt={gen.product.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#54745A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Listing Ready
                  </span>
                  {savedSuccess && (
                    <span className="text-xs font-medium text-[#54745A] bg-[#54745A]/10 px-2 py-0.5 rounded">
                      Changes Saved!
                    </span>
                  )}
                  {isSaving && (
                    <span className="text-xs font-medium text-[#68655F] flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Saving...
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E211F] leading-tight">
                  {gen.product.title}
                </h1>
                <p className="text-xs text-[#68655F] flex items-center gap-2">
                  <span>{input.location || artisan?.location || 'India'}</span>
                  <span>•</span>
                  <span>{input.material || gen.product.material}</span>
                  <span>•</span>
                  <span>₹{gen.pricing.recommended.toLocaleString('en-IN')}</span>
                </p>
              </div>
            </div>

            {/* Right: Digital Readiness Score Card */}
            <div className="lg:col-span-5 p-5 bg-[#F5F0E8] border border-[#D8D0C4] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#B85C43]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E211F]">
                    Digital Readiness Score
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl font-bold text-[#27344A]">
                    {gen.readiness.overall}
                  </span>
                  <span className="text-xs font-semibold text-[#68655F]">/ 100</span>
                </div>
              </div>

              {/* Score Sub-bars */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[
                  { label: 'Photo', score: gen.readiness.photography },
                  { label: 'Desc', score: gen.readiness.description },
                  { label: 'Search', score: gen.readiness.discoverability },
                  { label: 'Price', score: gen.readiness.pricingPresentation },
                  { label: 'Market', score: gen.readiness.marketing },
                ].map((item) => (
                  <div key={item.label} className="text-center space-y-1">
                    <div className="h-1.5 w-full bg-[#D8D0C4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#54745A] rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#68655F] block">
                      {item.label} ({item.score})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Workspace Tabs (Left) + Next Moves (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Tabs Component */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-[#FBF8F2] border border-[#D8D0C4] rounded-3xl shadow-sm">
            <WorkspaceTabs
              generation={gen}
              inputData={input}
              onUpdateGeneration={handleUpdateGeneration}
            />
          </div>

          {/* Actionable Next Moves & Story Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top Actions Card */}
            <div className="p-6 bg-[#FBF8F2] border border-[#D8D0C4] rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B85C43]" />
                <h3 className="font-serif text-base font-bold text-[#1E211F]">
                  Your Next 3 Moves
                </h3>
              </div>
              <p className="text-xs text-[#68655F]">
                Quick actions to maximize discoverability and digital sales conversion:
              </p>
              <div className="space-y-3 pt-1">
                {gen.readiness.topActions?.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-[#F5F0E8] rounded-xl border border-[#D8D0C4]/60 text-xs text-[#1E211F]"
                  >
                    <span className="font-serif font-bold text-[#B85C43] text-sm">
                      0{idx + 1}
                    </span>
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 bg-[#27344A] text-[#FBF8F2] rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold">
                Shareable Digital Catalogue
              </h3>
              <p className="text-xs text-[#D8D0C4] leading-relaxed">
                Your craft is now packaged into a shareable link that buyers can view across devices in English, Hindi, and Kannada.
              </p>
              <Link
                href={`/product/${product.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#B85C43] hover:bg-[#a34f37] text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <span>Open Live Product Page</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
