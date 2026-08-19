import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/supabase/products";
import { getProductFeedback } from "@/lib/supabase/feedback";
import { generateAuthenticityAudit } from "@/lib/ai/authenticity";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const feedbacks = await getProductFeedback(productId);
    const audit = await generateAuthenticityAudit(product, feedbacks);

    return NextResponse.json({ audit }, { status: 200 });
  } catch (error: unknown) {
    console.error("[VISART Authenticity Verification API error]:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
