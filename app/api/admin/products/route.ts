import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  getAdminProductsCMS,
  toggleProductPublish,
  deleteProductCMS,
} from "@/lib/supabase/admin";
import { updateProductData } from "@/lib/supabase/products";

// Requires an admin session (requireAdmin). The /admin screen does not call this route; it reads
// lib/supabase/* from the browser, so this guard does not protect that path (docs/AUTHENTICATION.md).
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const products = await getAdminProductsCMS();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Admin products CMS API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { productId, isPublished, patch } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Missing productId" },
        { status: 400 }
      );
    }

    if (typeof isPublished === "boolean") {
      const updated = await toggleProductPublish(productId, isPublished);
      return NextResponse.json({ success: true, product: updated });
    }

    if (patch) {
      const updated = await updateProductData(productId, patch);
      return NextResponse.json({ success: true, product: updated });
    }

    return NextResponse.json(
      { success: false, error: "No action specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin product update API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Missing product id" },
        { status: 400 }
      );
    }

    const success = await deleteProductCMS(productId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Admin delete product API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
