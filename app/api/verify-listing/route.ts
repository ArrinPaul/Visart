import { NextRequest, NextResponse } from "next/server";
import { isTrustedOrigin } from "@/lib/auth/origin";
import { createVerifyDeps } from "@/lib/ml/serviceStore";
import { verifyListing } from "@/lib/ml/verifyListing";

const MAX_PER_MINUTE = 20;
let recent: number[] = [];

// One shared limit per server process. Per-IP limits would trust a spoofable header.
function overLimit(now = Date.now()): boolean {
  recent = recent.filter((t) => now - t < 60_000);
  if (recent.length >= MAX_PER_MINUTE) return true;
  recent.push(now);
  return false;
}

const reply = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

// Public, because artisans have no accounts. Returns only the status, never scores.
export async function POST(req: NextRequest) {
  if (!isTrustedOrigin(req.headers.get("origin"))) {
    return reply(403, { success: false, error: "Request rejected." });
  }

  let productId: unknown;
  try {
    const raw = await req.text();
    if (raw.length <= 1024) productId = JSON.parse(raw)?.productId;
  } catch {
    productId = undefined;
  }
  if (typeof productId !== "string" || productId.length === 0 || productId.length > 128) {
    return reply(400, { success: false, error: "Invalid request body." });
  }

  const deps = createVerifyDeps();
  if (!deps) return reply(503, { success: false, error: "Verification is not configured." });
  if (overLimit()) return reply(429, { success: false, error: "Too many requests." });

  try {
    const { status } = await verifyListing(productId, deps);
    if (status === "not_found") return reply(404, { success: false, error: "Product not found." });
    return reply(200, { success: true, status });
  } catch (err) {
    console.error("[VISART ML] verify-listing:", err instanceof Error ? err.message : String(err));
    return reply(500, { success: false, error: "Verification failed." });
  }
}
