"use client";

import React from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { ProductFormData } from "@/types/frontend";

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (updated: Partial<ProductFormData>) => void;
  errors: Record<string, string>;
}

export default function ProductForm({ formData, onChange, errors }: ProductFormProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-b border-[#D8D0C4] pb-3">
        <h3 className="font-serif-editorial text-lg font-semibold text-[#1E211F]">
          Product Essentials
        </h3>
        <p className="text-xs text-[#68655F]">
          Provide basic facts. VISART will compose the professional story.
        </p>
      </div>

      <Input
        label="Product Name (Optional)"
        placeholder="e.g. Bamboo Storage Basket"
        value={formData.productName || ""}
        onChange={(e) => onChange({ productName: e.target.value })}
        helperText="Leave blank if you'd like VISART to suggest an editorial title."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Material *"
          placeholder="e.g. Bamboo / Terracotta / Cotton"
          value={formData.material}
          onChange={(e) => onChange({ material: e.target.value })}
          error={errors.material}
        />

        <Input
          label="Production Cost *"
          placeholder="e.g. ₹450"
          value={formData.productionCost}
          onChange={(e) => onChange({ productionCost: e.target.value })}
          error={errors.productionCost}
          helperText="Raw materials + direct production expense"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Time Required *"
          placeholder="e.g. 2 days / 16 hours"
          value={formData.timeRequired}
          onChange={(e) => onChange({ timeRequired: e.target.value })}
          error={errors.timeRequired}
        />

        <Input
          label="Location *"
          placeholder="e.g. Majuli, Assam"
          value={formData.location}
          onChange={(e) => onChange({ location: e.target.value })}
          error={errors.location}
        />
      </div>

      <Textarea
        label="What makes this product special? (Optional)"
        placeholder="e.g. Handwoven technique learned from my family; organic vegetable dyes used."
        value={formData.specialStory || ""}
        onChange={(e) => onChange({ specialStory: e.target.value })}
        rows={3}
      />
    </div>
  );
}
