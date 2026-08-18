"use client";

import React, { useState } from "react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const handleFormChange = (updated: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
    // Clear errors when user types
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
    setErrorMessage(null);

    try {
      // Step 1: AI Generation
      const generation = await generateListing(formData);

      // Step 2: Member C Storage upload if file is selected
      let finalImageUrl = formData.imagePreviewUrl || "";
      if (formData.imageFile) {
        const uploadedUrl = await uploadProductImage(formData.imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      // Step 3: Member C Persistence saveProduct
      const productId = await saveProduct(formData, generation, finalImageUrl);
      setCreatedProductId(productId);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : "Failed to create listing. Please try again.";
      setErrorMessage(msg);
    }
  };

  const handleProcessingComplete = () => {
    if (createdProductId) {
      router.push(`/workspace?id=${createdProductId}`);
    } else {
      router.push("/workspace");
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <ProcessingState onComplete={handleProcessingComplete} />
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
