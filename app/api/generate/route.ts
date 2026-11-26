import { NextRequest, NextResponse } from "next/server";
import { VisartInputSchema } from "@/lib/validation/visart";
import { generateVisartListing } from "@/lib/ai/visart";

// No auth, no rate limiting — every call here invokes the paid Gemini API (see
// docs/TECHNICAL_DEBT.md TD-004). In demo mode the browser normally never reaches this route at
// all (lib/frontend/generationClient.ts short-circuits to a client-side mock); this handler is
// primarily exercised when NEXT_PUBLIC_VISART_DEMO_MODE === "false".
export async function POST(req: NextRequest) {
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

    const generation = await generateVisartListing(parseResult.data);

    return NextResponse.json(generation, { status: 200 });
  } catch (error: unknown) {
    console.error("[VISART] /api/generate error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}
