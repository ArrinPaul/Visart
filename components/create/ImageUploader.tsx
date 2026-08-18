"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { ImageUploadStatus } from "@/types/frontend";
import Button from "@/components/ui/Button";

interface ImageUploaderProps {
  onImageSelected: (file: File | null, previewUrl: string | null) => void;
  previewUrl?: string | null;
}

export default function ImageUploader({ onImageSelected, previewUrl: initialPreview }: ImageUploaderProps) {
  const [status, setStatus] = useState<ImageUploadStatus>(initialPreview ? "READY" : "EMPTY");
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreview || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoTip, setPhotoTip] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setStatus("VALIDATING");
    setErrorMessage(null);
    setPhotoTip(null);

    // Validate size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setStatus("ERROR");
      setErrorMessage("We couldn't use that image. File size exceeds 8 MB.");
      return;
    }

    // Validate type (JPG, PNG, WebP)
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setStatus("ERROR");
      setErrorMessage("We couldn't use that image. Try a JPG, PNG, or WebP photo.");
      return;
    }

    // Create preview and analyze dimensions for artisan guidance
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      if (img.width >= 800 && img.height >= 800) {
        setPhotoTip("High-clarity photo. Excellent for highlighting handwoven details & textures.");
      } else {
        setPhotoTip("Photo ready! Tip: Taking a photo near natural window light can boost buyer confidence.");
      }
    };
    img.src = url;

    setPreviewUrl(url);
    setStatus("READY");
    onImageSelected(file, url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (status !== "READY") {
      setStatus("DRAGGING");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === "DRAGGING") {
      setStatus("EMPTY");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setStatus("EMPTY");
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelected(null, null);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#1E211F]">
        Product Photo
      </label>

      {status === "READY" && previewUrl ? (
        <div className="flex flex-col gap-2">
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-[#D8D0C4] bg-[#FBF8F2] group shadow-sm">
            <img 
              src={previewUrl} 
              alt="Product preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1E211F]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <Button size="sm" variant="outline" className="bg-[#FBF8F2] border-none text-[#1E211F]" onClick={() => fileInputRef.current?.click()}>
                Change Photo
              </Button>
              <Button size="sm" variant="danger" onClick={handleClear}>
                Remove
              </Button>
            </div>
            <div className="absolute bottom-3 left-3 bg-[#1E211F]/80 text-[#FBF8F2] px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 backdrop-blur-md">
              <CheckCircle className="w-3.5 h-3.5 text-[#54745A]" />
              Photo ready
            </div>
          </div>

          {photoTip && (
            <div className="p-3 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl flex items-start gap-2 text-xs text-[#1E211F]">
              <CheckCircle className="w-3.5 h-3.5 text-[#54745A] shrink-0 mt-0.5" />
              <span>{photoTip}</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-72 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
            status === "DRAGGING"
              ? "border-[#B85C43] bg-[#B85C43]/5 scale-[0.99]"
              : status === "ERROR"
              ? "border-[#A34F4F] bg-[#A34F4F]/5"
              : "border-[#D8D0C4] hover:border-[#1E211F] bg-[#FBF8F2]/60 hover:bg-[#FBF8F2]"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#F5F0E8] border border-[#D8D0C4] flex items-center justify-center mb-4 text-[#A88752]">
            <Upload className="w-6 h-6" />
          </div>

          <h4 className="text-base font-medium text-[#1E211F] mb-1">
            Drop your product photo here
          </h4>
          <p className="text-sm text-[#68655F] mb-4">
            or <span className="text-[#B85C43] underline font-medium">choose a photo</span> from your device
          </p>

          <span className="text-xs font-mono text-[#68655F] bg-[#F5F0E8] px-3 py-1 rounded-full border border-[#D8D0C4]">
            JPG, PNG or WebP · up to 8 MB
          </span>

          {status === "ERROR" && errorMessage && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[#A34F4F] font-medium bg-[#A34F4F]/10 px-3 py-1.5 rounded-lg border border-[#A34F4F]/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
