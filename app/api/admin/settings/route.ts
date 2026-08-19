import { NextRequest, NextResponse } from "next/server";
import { getAdminSettings, updateAdminSettings } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const settings = await getAdminSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin settings get error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateAdminSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
