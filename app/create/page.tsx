"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/create/ImageUploader";
import ProductForm from "@/components/create/ProductForm";
import ProcessingState from "@/components/create/ProcessingState";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ProductFormData } from "@/types/frontend";
import { generateListing } from "@/lib/frontend/generationClient";
import { Sparkles, ArrowLeft, AlertCircle } from "lucide-react";

import { uploadProductImage } from "@/lib/supabase/storage";
import { saveProduct } from "@/lib/supabase/products";

export default function CreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    material: "",
    productionCost: "",
    timeRequired: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBackendComplete, setIsBackendComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  // Synchronize ref to guarantee fresh read in async callbacks
  const createdProductIdRef = useRef<string | null>(null);

  const handleFormChange = (updated: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(updated).forEach((key) => delete next[key]);
      return next;
    });
  };

  const handleImageSelected = (file: File | null, previewUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreviewUrl: previewUrl,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.material.trim()) newErrors.material = "Material is required";
    if (!formData.productionCost.trim()) newErrors.productionCost = "Production cost is required";
    if (!formData.timeRequired.trim()) newErrors.timeRequired = "Time required is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;


    setIsProcessing(true);
    setIsBackendComplete(false);
    setErrorMessage(null);
    createdProductIdRef.current = null;

    try {
      // Step 1 & 2: Concurrently execute AI generation (Member B) and Image Upload (Member C)
      // Independent pipelines with strict Promise.all error isolation

      // generateListing() decides internally whether to call POST /api/generate or return a
      // client-side mock (NEXT_PUBLIC_VISART_DEMO_MODE) — see lib/frontend/generationClient.ts.
      const generationPromise = generateListing(formData);

      const imageUploadPromise = formData.imageFile
        ? uploadProductImage(formData.imageFile)
        : Promise.resolve({
            success: true,
            url: formData.imagePreviewUrl || "",
          });

      const [generation, uploadRes] = await Promise.all([
        generationPromise,
        imageUploadPromise,
      ]);

      const finalImageUrl = uploadRes?.url || formData.imagePreviewUrl || "";

      // Step 3: Persist product & artisan data (Member C) Artisan name is hardcoded — this form
      // never collects who the artisan actually is, so every listing created here is attributed to
      // the same generic "Local Artisan" identity.
      const saved = await saveProduct({
        inputData: formData,
        generatedData: generation,
        imageUrl: finalImageUrl,
        artisan: {
          name: "Local Artisan",
          location: formData.location,
          craft: formData.material,
        },
      });

      if (!saved?.id) {
        throw new Error("Persistence failed to return a valid product ID.");
      }

      // Photo checks run in the background and never block publishing. Skipped in demo mode.
      if (process.env.NEXT_PUBLIC_VISART_DEMO_MODE === "false") {
        void fetch("/api/verify-listing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: saved.id }),
          keepalive: true,
        }).catch(() => undefined);
      }

      createdProductIdRef.current = saved.id;
      setCreatedProductId(saved.id);
      setIsBackendComplete(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "We encountered an issue creating your listing. Please verify your connection and try again.";
      console.error("[VISART] Create flow failed:", err);
      setErrorMessage(msg);
      setIsBackendComplete(false);
    }
  };

  const handleProcessingComplete = () => {
    const targetId = createdProductIdRef.current || createdProductId;

    // Strict invariant: NO PRODUCT ID = NO WORKSPACE REDIRECT
    if (!targetId) {
      console.error("[VISART] Navigation halted: no valid product ID available.");
      setErrorMessage("We couldn't finalize your listing workspace. Please try again.");
      setIsBackendComplete(false);
      return;
    }

    router.push(`/workspace?id=${targetId}`);
  };

  const handleRetry = () => {
    setIsProcessing(false);
    setIsBackendComplete(false);
    setErrorMessage(null);
  };

  if (isProcessing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <ProcessingState
          isComplete={isBackendComplete}
          error={errorMessage}
          onComplete={handleProcessingComplete}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#68655F] hover:text-[#1E211F] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </button>

      <div className="mb-8">
        <span className="text-xs font-mono tracking-widest uppercase text-[#B85C43] font-semibold">
          STEP 01 OF 02
        </span>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#1E211F] mt-1">
          Create your listing
        </h1>
        <p className="text-base text-[#68655F] mt-2">
          Give us the basics. VISART will handle the digital work.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#A34F4F]/10 border border-[#A34F4F]/30 text-[#A34F4F] text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Card className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/2">
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              previewUrl={formData.imagePreviewUrl}
            />
          </div>
          <div className="w-full md:w-1/2">
            <ProductForm 
              formData={formData} 
              onChange={handleFormChange} 
              errors={errors} 
            />
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#D8D0C4] pt-6">
          <p className="text-xs text-[#68655F]">
            Your facts will be enhanced into structured listing copy, pricing guidance, and multilingual reach.
          </p>
          <Button type="submit" size="lg" variant="secondary" className="w-full sm:w-auto shrink-0">
            <Sparkles className="w-4 h-4" />
            Create my listing
          </Button>
        </div>
      </form>
    </div>
  );
}
