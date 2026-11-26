// Server-only. Guard for admin route handlers: returns a rejection Response, or null when allowed.
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME } from "./cookie.ts";
import { isTrustedOrigin } from "./origin.ts";
import { validateSessionToken, type AdminIdentity } from "./session.ts";

type Validator = (token: string | null | undefined) => Promise<AdminIdentity | null>;

export async function requireAdmin(
  req: NextRequest,
  validate: Validator = (token) => validateSessionToken(token)
): Promise<Response | null> {
  let identity: AdminIdentity | null = null;
  try {
    identity = await validate(req.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? null);
  } catch (err) {
    console.error("[VISART ADMIN AUTH] session check failed:", err instanceof Error ? err.message : String(err));
  }

  if (!identity) {
    return Response.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  // Browsers send Origin on state-changing requests; reads may legitimately omit it.
  if (req.method !== "GET" && req.method !== "HEAD" && !isTrustedOrigin(req.headers.get("origin"))) {
    return Response.json({ success: false, error: "Request rejected." }, { status: 403 });
  }

  return null;
}
