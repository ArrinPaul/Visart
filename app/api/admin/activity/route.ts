import { NextRequest, NextResponse } from "next/server";
import { getAdminActivityLogs } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 100;
    const logs = await getAdminActivityLogs(limit);
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Admin activity logs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
