"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  PlusCircle,
  Download,
  IndianRupee,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import type { AdminProductSummary } from "@/types/admin";
import type { VisartGeneration } from "@/types/visart";
import ProductEditModal from "./ProductEditModal";

interface ProductsCMSViewProps {
  products: AdminProductSummary[];
  onTogglePublish: (productId: string, isPublished: boolean) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateProduct: (productId: string, patch: Partial<VisartGeneration>) => Promise<void>;
}

export default function ProductsCMSView({
  products,
  onTogglePublish,
  onDeleteProduct,
  onUpdateProduct,
}: ProductsCMSViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<AdminProductSummary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(
    new Set(
      products
        .map((p) => p.generated_data?.product?.category || p.input_data?.category || "Craft")
        .filter(Boolean)
    )
  );

  const filteredProducts = products.filter((p) => {
    const title = p.generated_data?.product?.title?.toLowerCase() || "";
    const artisanName = p.artisan?.name?.toLowerCase() || "";
    const cat = (p.generated_data?.product?.category || p.input_data?.category || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = title.includes(query) || artisanName.includes(query) || p.id.includes(query);
    const matchesCategory = categoryFilter === "all" || cat.includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const exportCSV = () => {
    const headers = "ID,Title,Artisan,Category,Price Recommended,Readiness,Status\n";
    const rows = filteredProducts
      .map(
        (p) =>
          `"${p.id}","${p.generated_data?.product?.title?.replace(/"/g, '""')}","${
            p.artisan?.name || ""
          }","${p.generated_data?.product?.category || ""}","₹${
            p.generated_data?.pricing?.recommended || 0
          }","${p.readinessScore}%","${p.is_published !== false ? "Published" : "Draft"}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visart-products-export-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8D0C4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#68655F]" />
          <input
            type="text"
            placeholder="Search by craft title, artisan, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs text-[#1E211F] placeholder:text-[#68655F] focus:outline-none focus:border-[#B85C43]"
          />
        </div>

        {/* Category filter & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F0E8] border border-[#D8D0C4] rounded-xl text-xs text-[#1E211F] font-semibold focus:outline-none"
          >
            <option value="all">All Craft Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#EBE3D5] text-[#1E211F] text-xs font-semibold rounded-xl border border-[#D8D0C4] transition-colors"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#D8D0C4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#D8D0C4] text-[#68655F] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Craft & Product</th>
                <th className="px-6 py-4">Artisan & Location</th>
                <th className="px-6 py-4">Fair Pricing</th>
                <th className="px-6 py-4">Readiness</th>
                <th className="px-6 py-4">Reviews & Inquiries</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EBE3D5]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#68655F]">
                    No handcrafted listings match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const title = p.generated_data?.product?.title || p.input_data?.productName || "Untitled Listing";
                  const recPrice = p.generated_data?.pricing?.recommended || 1200;
                  const isPublished = p.is_published !== false;

                  return (
                    <tr key={p.id} className="hover:bg-[#F5F0E8]/50 transition-colors group">
                      {/* Craft & Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-xl bg-[#EBE3D5] border border-[#D8D0C4] overflow-hidden shrink-0 flex items-center justify-center">
                            {p.image_url || p.generated_data?.product?.imageUrl ? (
                              <img
                                src={p.image_url || p.generated_data?.product?.imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Sparkles className="size-5 text-[#A88752]" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-[#1E211F] truncate text-sm">{title}</p>
                            <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-[#A88752]/15 text-[#A88752] font-semibold">
                              {p.generated_data?.product?.category || "Handmade Craft"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Artisan & Location */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1E211F]">
                          {p.artisan?.name || "Rural Artisan"}
                        </p>
                        <p className="text-[#68655F] text-[11px]">
                          {p.artisan?.location || p.input_data?.location || "India"}
                        </p>
                      </td>

                      {/* Fair Pricing */}
                      <td className="px-6 py-4">
                        <span className="font-serif-editorial font-bold text-sm text-[#B85C43]">
                          ₹{recPrice.toLocaleString("en-IN")}
                        </span>
                        <p className="text-[10px] text-[#68655F]">
                          Range: ₹{p.generated_data?.pricing?.min || 500} - ₹{p.generated_data?.pricing?.max || 2000}
                        </p>
                      </td>

                      {/* Readiness */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#EBE3D5] rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${p.readinessScore}%` }}
                            />
                          </div>
                          <span className="font-bold text-emerald-800">{p.readinessScore}%</span>
                        </div>
                      </td>

                      {/* Reviews & Inquiries */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#1E211F]">
                          ⭐ {p.averageRating} ({p.reviewCount} reviews)
                        </p>
                        <p className="text-[10px] text-[#68655F]">{p.totalInquiries} buyer inquiries</p>
                      </td>

                      {/* Status & Toggle */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onTogglePublish(p.id, !isPublished)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            isPublished
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle className="size-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <XCircle className="size-3" />
                              Draft
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live view */}
                          <Link
                            href={`/product/${p.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#68655F] hover:text-[#1E211F] hover:bg-[#EBE3D5] transition-colors"
                            title="View public product page"
                          >
                            <ExternalLink className="size-4" />
                          </Link>

                          {/* Edit modal trigger */}
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="p-1.5 rounded-lg text-[#B85C43] hover:bg-[#B85C43]/10 transition-colors"
                            title="Edit product story and pricing"
                          >
                            <Edit className="size-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to remove "${title}"?`)) {
                                setDeletingId(p.id);
                                await onDeleteProduct(p.id);
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                            title="Delete listing"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={onUpdateProduct}
        />
      )}
    </div>
  );
}
