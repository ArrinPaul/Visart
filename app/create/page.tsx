'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { uploadProductImage } from '@/lib/supabase/storage';
import { saveProduct } from '@/lib/supabase/products';
import type { ProductInputData, VisartGeneration } from '@/types/visart';
import {
  UploadCloud,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();

  // Form State
  const [productName, setProductName] = useState('');
  const [material, setMaterial] = useState('Native Assam Bamboo');
  const [productionCost, setProductionCost] = useState('450');
  const [timeRequired, setTimeRequired] = useState('2 days');
  const [location, setLocation] = useState('Nalbari, Assam');
  const [craftStory, setCraftStory] = useState(
    'Woven by hand using split mature bamboo stalks cured in natural river water.'
  );
  const [artisanName, setArtisanName] = useState('Pabitra Das');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);

  const stages = [
    '01 Looking at your product',
    '02 Understanding the craft',
    '03 Writing the listing',
    '04 Preparing pricing guidance',
    '05 Preparing customer-ready content',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Staged animation progress
    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      let finalImageUrl = imagePreview;

      // Upload image via Member C storage helper
      if (selectedFile) {
        const uploadRes = await uploadProductImage(selectedFile);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      }

      const inputData: ProductInputData = {
        productName: productName || 'Handcrafted Craft Item',
        material,
        productionCost: Number(productionCost) || 450,
        timeRequired,
        location,
        craftStory,
      };

      // Mock AI generation matching canonical shape
      const generatedData: VisartGeneration = {
        product: {
          title: productName ? `Handcrafted ${productName}` : 'Handcrafted Assamese Bamboo Utility Basket',
          shortDescription: `Artisan piece shaped from ${material} in ${location} over ${timeRequired} of dedicated handcraft.`,
          description: `Masterfully created in ${location}, this handcrafted item utilizes fine ${material}. ${craftStory || 'Made with precision and traditional techniques.'}`,
          category: 'Handcrafted Heritage Goods',
          material,
          craftTechnique: 'Traditional handcrafting and precision finishing',
          keywords: [
            `${material.toLowerCase()} craft`,
            `handmade ${location.toLowerCase()}`,
            'artisan decor',
            'eco friendly product',
          ],
          tags: ['ArtisanCraft', 'HandmadeInIndia', 'SustainableLiving'],
        },
        pricing: {
          currency: 'INR',
          min: Math.round(Number(productionCost) * 1.8) || 899,
          recommended: Math.round(Number(productionCost) * 2.2) || 999,
          max: Math.round(Number(productionCost) * 2.7) || 1199,
          rationale: [
            `Raw Material Base: ₹${productionCost} for verified material sourcing.`,
            `Artisan Labour: Fair hourly compensation for ${timeRequired} of handwork.`,
            'Market Valuation: Sustainable direct-to-consumer margin.',
          ],
          disclaimer: 'AI-assisted estimate based on supplied material and duration facts.',
        },
        marketing: {
          instagram: `🌿 Handcrafted authenticity from ${location}. Made from ${material} over ${timeRequired}. Direct artisan orders open.`,
          whatsapp: `Namaste! I have freshly crafted this piece using ${material}. Made over ${timeRequired}. Price: ₹${Math.round(Number(productionCost) * 2.2) || 999}. Message to order.`,
          shortAd: `Handcrafted in ${location} using ${material} — ₹${Math.round(Number(productionCost) * 2.2) || 999}.`,
        },
        translations: {
          hindi: {
            title: `हस्तनिर्मित ${productName || 'कला कृति'}`,
            description: `${location} में ${material} से ${timeRequired} में तैयार किया गया पारंपरिक और प्रामाणिक उत्पाद।`,
          },
          kannada: {
            title: `ಕೈಯಿಂದ ತಯಾರಿಸಿದ ${productName || 'ಕಲಾ ವಸ್ತು'}`,
            description: `${location}ನಲ್ಲಿ ${material}ನಿಂದ ${timeRequired} ಕಾಲಾವಧಿಯಲ್ಲಿ ತಯಾರಿಸಿದ ನೈಸರ್ಗಿಕ ಮತ್ತು ಸುಂದರ ಕಲಾ ವಸ್ತು.`,
          },
        },
        story: {
          title: `Crafted with Purpose in ${location}`,
          body: craftStory || `Every piece is shaped by hand using traditional methods in ${location}.`,
        },
        readiness: {
          overall: 84,
          photography: 80,
          description: 92,
          discoverability: 82,
          pricingPresentation: 86,
          marketing: 80,
          topActions: [
            'Add dimensional measurements (height, width, depth in cm).',
            'Include high-contrast close-up of material texture.',
            'Add storage or care instructions.',
          ],
        },
      };

      // Persist via Member C repository
      const saved = await saveProduct({
        inputData,
        generatedData,
        imageUrl: finalImageUrl,
        artisan: {
          name: artisanName || 'Local Artisan',
          location,
          craft: material,
        },
      });

      // Navigate directly to Workspace
      router.push(`/workspace?id=${saved.id}`);
    } catch (err) {
      console.warn('Submission error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1E211F]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[#D8D0C4] px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#68655F] hover:text-[#B85C43] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span className="font-serif text-lg font-bold">Create Listing</span>
          <Link
            href="/workspace"
            className="text-xs font-semibold text-[#B85C43] hover:underline"
          >
            Workspace
          </Link>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Processing State Modal */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 bg-[#1E211F]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FBF8F2] border border-[#D8D0C4] p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 text-center">
              <div className="flex items-center justify-center">
                <div className="p-4 bg-[#B85C43]/10 text-[#B85C43] rounded-full animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#1E211F]">
                  Understanding Your Craft
                </h3>
                <p className="text-xs text-[#68655F]">
                  VISART AI is transforming your product facts into a market-ready listing...
                </p>
              </div>

              {/* Staged checklist */}
              <div className="space-y-2.5 text-left pt-2">
                {stages.map((stage, idx) => {
                  const isDone = idx < processingStage;
                  const isCurrent = idx === processingStage;
                  return (
                    <div
                      key={stage}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                        isDone
                          ? 'bg-[#54745A]/10 text-[#54745A]'
                          : isCurrent
                          ? 'bg-[#B85C43]/10 text-[#B85C43] font-semibold'
                          : 'text-[#68655F]/60'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#54745A]" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#B85C43]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-current opacity-40" />
                      )}
                      <span>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 bg-[#FBF8F2] border border-[#D8D0C4] rounded-3xl space-y-8 shadow-sm">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E211F]">
              Create your listing
            </h1>
            <p className="text-sm text-[#68655F]">
              Give us the basics. VISART will handle the digital work.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Drop Area */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                Product Photograph
              </label>
              <div className="border-2 border-dashed border-[#D8D0C4] hover:border-[#B85C43] rounded-2xl p-6 transition-colors bg-[#F5F0E8] text-center space-y-4">
                {imagePreview ? (
                  <div className="relative aspect-video max-w-sm mx-auto rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-[#FBF8F2] rounded-full w-fit mx-auto text-[#B85C43]">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                )}
                <div className="space-y-1">
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-4 py-2 bg-[#27344A] hover:bg-[#1E211F] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Choose Photo
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-[11px] text-[#68655F]">
                    JPG, PNG or WebP · up to 8 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  Artisan Name
                </label>
                <input
                  type="text"
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                  placeholder="e.g. Pabitra Das"
                  className="w-full px-4 py-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  Product Name (Optional)
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Handwoven Bamboo Basket"
                  className="w-full px-4 py-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Bamboo, Silk, Terracotta Clay"
                  className="w-full px-4 py-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  Production Cost (₹)
                </label>
                <input
                  type="number"
                  value={productionCost}
                  onChange={(e) => setProductionCost(e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full px-4 py-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  Time Required
                </label>
                <input
                  type="text"
                  value={timeRequired}
                  onChange={(e) => setTimeRequired(e.target.value)}
                  placeholder="e.g. 2 days"
                  className="w-full px-4 py-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  Location / Village
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nalbari, Assam"
                  className="w-full px-4 py-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
                  required
                />
              </div>
            </div>

            {/* Special Notes / Craft Story */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#68655F]">
                What makes this product special? (Optional)
              </label>
              <textarea
                rows={3}
                value={craftStory}
                onChange={(e) => setCraftStory(e.target.value)}
                placeholder="e.g. A weaving technique taught within the artisan's family."
                className="w-full px-4 py-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-sm text-[#1E211F] focus:outline-none focus:border-[#B85C43]"
              />
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-[#B85C43] hover:bg-[#a34f37] text-white rounded-2xl font-serif text-lg font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create my listing</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
