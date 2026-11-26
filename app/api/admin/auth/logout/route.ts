import { NextRequest, NextResponse } from "next/server";
import { deleteSessionByToken } from "@/lib/auth/session";
import { ADMIN_SESSION_COOKIE_NAME, buildClearedSessionCookieOptions } from "@/lib/auth/cookie";
import { isTrustedOrigin } from "@/lib/auth/origin";

export async function POST(req: NextRequest) {
  const originHeader = req.headers.get("origin");
  if (!isTrustedOrigin(originHeader)) {
    return NextResponse.json({ success: false, error: "Request rejected." }, { status: 403 });
  }

  const rawToken = req.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? null;

  // deleteSessionByToken never throws and is safe to call even if there is no cookie, no
  // matching row, or the database is unreachable (see lib/auth/session.ts) — its boolean result
  // is used only for server-side diagnostics below, never surfaced to the client.
  const result = await deleteSessionByToken(rawToken);

  if (!result.ok) {
    console.error(
      "[VISART ADMIN AUTH] logout: session row deletion did not succeed; cookie is cleared anyway."
    );
  }

  const response = NextResponse.json({ success: true });

  // The cookie is always cleared from the browser's perspective, regardless of whether the
  // database-side delete succeeded — a user clicking "log out" should never see a (locally)
  // still-logged-in state just because the database happened to be unreachable at that moment.
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", buildClearedSessionCookieOptions());

  return response;
}
