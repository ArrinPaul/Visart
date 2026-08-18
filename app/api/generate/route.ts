import { NextRequest, NextResponse } from "next/server";
import { VisartInputSchema } from "@/lib/validation/visart";
import { generateVisartListing } from "@/lib/ai/visart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = VisartInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const generation = await generateVisartListing(parseResult.data);
    return NextResponse.json(generation, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/generate Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
