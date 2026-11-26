import { NextRequest, NextResponse } from "next/server";
import { getAdminIdentityFromRequest } from "@/lib/auth/session";

// Tells the /admin screen whether the HttpOnly session cookie is currently valid.
export async function GET(req: NextRequest) {
  let identity = null;
  try {
    identity = await getAdminIdentityFromRequest(req);
  } catch (err) {
    console.error("[VISART ADMIN AUTH] session check failed:", err instanceof Error ? err.message : String(err));
  }

  if (!identity) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  return NextResponse.json({ success: true, email: identity.email });
}
