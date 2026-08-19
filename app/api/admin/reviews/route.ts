import { NextRequest, NextResponse } from "next/server";
import { getAllReviewsCMS, updateReviewStatus } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const reviews = await getAllReviewsCMS();
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Admin reviews API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, status } = body;

    if (!reviewId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing reviewId or status" },
        { status: 400 }
      );
    }

    const success = await updateReviewStatus(reviewId, status);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Admin review status update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review status" },
      { status: 500 }
    );
  }
}
