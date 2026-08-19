import { NextRequest, NextResponse } from "next/server";
import { getProductFeedback, submitProductFeedback } from "@/lib/supabase/feedback";
import type { SubmitFeedbackInput } from "@/types/feedback";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId query parameter" }, { status: 400 });
    }

    const feedbacks = await getProductFeedback(productId);
    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error: unknown) {
    console.error("[VISART Feedback API GET error]:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitFeedbackInput;

    if (!body.productId || !body.comment || !body.rating || !body.authenticityRating) {
      return NextResponse.json(
        { error: "Invalid feedback payload: productId, comment, rating, and authenticityRating are required." },
        { status: 400 }
      );
    }

    const newFeedback = await submitProductFeedback(body);
    return NextResponse.json({ success: true, feedback: newFeedback }, { status: 201 });
  } catch (error: unknown) {
    console.error("[VISART Feedback API POST error]:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
