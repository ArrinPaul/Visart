import { NextRequest, NextResponse } from "next/server";
import { VisartInputSchema } from "@/lib/validation/visart";
import { generateVisartListing } from "@/lib/ai/visart";

// No auth, no rate limiting — every call here invokes the paid Gemini API (see
// docs/TECHNICAL_DEBT.md TD-004). In demo mode the browser normally never reaches this route at
// all (lib/frontend/generationClient.ts short-circuits to a client-side mock); this handler is
// primarily exercised when NEXT_PUBLIC_VISART_DEMO_MODE === "false".
export async function POST(req: NextRequest) {
  const reqStart = performance.now();
  console.log("[VISART DEBUG] /api/generate entered");

  try {
    const body = await req.json();
    const parseResult = VisartInputSchema.safeParse(body);

    if (!parseResult.success) {
      console.warn("[VISART DEBUG] /api/generate invalid input payload:", parseResult.error.flatten());
      return NextResponse.json(
        { error: "Invalid input data", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    console.log("[VISART DEBUG] Gemini generation started with inputs:", {
      productName: parseResult.data.productName,
      material: parseResult.data.material,
      location: parseResult.data.location,
      productionCost: parseResult.data.productionCost,
      timeRequired: parseResult.data.timeRequired,
    });

    const generation = await generateVisartListing(parseResult.data);
    const reqEnd = performance.now();

    console.log(`[VISART DEBUG] Gemini generation completed in ${(reqEnd - reqStart).toFixed(2)}ms`);
    console.log(`[VISART DEBUG] generated title: "${generation.product.title}"`);
    console.log(`[VISART DEBUG] generated location: "${generation.product.location}"`);
    console.log(`[VISART DEBUG] generated material: "${generation.product.material}"`);
    console.log(`[VISART DEBUG] generated recommended price: ₹${generation.pricing.recommended}`);

    return NextResponse.json(generation, { status: 200 });
  } catch (error: unknown) {
    const reqEnd = performance.now();
    console.error(`[VISART DEBUG] /api/generate error after ${(reqEnd - reqStart).toFixed(2)}ms:`, error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}
