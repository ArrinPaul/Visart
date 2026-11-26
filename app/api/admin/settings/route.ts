import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminSettings, updateAdminSettings } from "@/lib/supabase/admin";

// Requires an admin session (requireAdmin). The /admin screen does not call this route; it reads
// lib/supabase/* from the browser, so this guard does not protect that path (docs/AUTHENTICATION.md).
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

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
  const denied = await requireAdmin(req);
  if (denied) return denied;

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
