import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/auth/email";
import { verifyPassword } from "@/lib/auth/password";
import { getAuthServiceClient } from "@/lib/auth/supabaseServiceClient";
import { createSessionForAdmin } from "@/lib/auth/session";
import { ADMIN_SESSION_COOKIE_NAME, buildSessionCookieOptions } from "@/lib/auth/cookie";
import { isTrustedOrigin } from "@/lib/auth/origin";
import { decideLoginOutcome } from "@/lib/auth/loginDecision";

// This route is intentionally the only place lib/auth/supabaseServiceClient.ts is reached for
// anything beyond lib/auth/session.ts itself — it performs exactly one admin_users lookup by
// normalized email, nothing else. See that module's header comment for the scope restriction.

const MAX_BODY_BYTES = 2048;
const MAX_FIELD_LENGTH = 256;

// A fixed, valid-format scrypt hash with no corresponding real password, used solely to keep the
// cost of verifyPassword() roughly constant whether or not an account was found for the supplied
// email. Without this, "account not found" would skip the (deliberately expensive) scrypt call
// entirely while "wrong password for a real account" would not — an observable timing
// difference that leaks account existence even though the response body/status are identical.
// This is not a credential: nothing is ever authenticated against it successfully.
const TIMING_EQUALIZATION_HASH =
  "scrypt$1$16384$8$1$64$crPNQHLxlBwR2QD1nRHqng==$ll4K7MuBLuiO+2IPVJbUCsM9mYSyNpEp/7ntzV2slH8JDQTalybSnTkUlH0JOtQegbLkZl74wDiSlHe38iGEcw==";

// Every rejection path returns this exact body/status, regardless of *why* the attempt failed
// (unknown email, inactive account, wrong password, or malformed input) — see
// lib/auth/loginDecision.ts for the extracted decision logic this depends on, and
// docs/ADMIN_SESSIONS.md for why this matters (no account enumeration).
function genericFailureResponse(): NextResponse {
  return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
}

function originRejectedResponse(): NextResponse {
  return NextResponse.json({ success: false, error: "Request rejected." }, { status: 403 });
}

export async function POST(req: NextRequest) {
  // Strict Origin validation first, before any body parsing or database access — a
  // cross-origin browser request is rejected outright. See lib/auth/origin.ts: this fails
  // closed (rejects) if APP_ORIGIN itself is missing/malformed, rather than allowing the
  // request through.
  const originHeader = req.headers.get("origin");
  if (!isTrustedOrigin(originHeader)) {
    return originRejectedResponse();
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (rawBody.length === 0 || rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (typeof parsedBody !== "object" || parsedBody === null) {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { email, password } = parsedBody as { email?: unknown; password?: unknown };

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length === 0 ||
    password.length === 0 ||
    email.length > MAX_FIELD_LENGTH ||
    password.length > MAX_FIELD_LENGTH
  ) {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  let normalizedEmail: string;
  try {
    normalizedEmail = normalizeEmail(email);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Everything below this point is a database/credential operation. Any unexpected failure
  // (service client misconfigured, Supabase unreachable, etc.) must fail closed to the same
  // generic response — it must never fall through to "authenticated," and it must never leak
  // internal error detail to the client.
  try {
    const client = getAuthServiceClient();

    const { data: adminRow, error: lookupError } = await client
      .from("admin_users")
      .select("id, email, password_hash, is_active")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error("[VISART ADMIN AUTH] login: admin_users lookup failed:", lookupError.message);
      return genericFailureResponse();
    }

    const admin = adminRow as
      | { id: string; email: string; password_hash: string; is_active: boolean }
      | null;

    // Always run verifyPassword — against the real hash if an account was found, or against the
    // fixed dummy hash otherwise — so a missing account and a wrong password cost the same.
    const passwordMatches = await verifyPassword(
      password,
      admin ? admin.password_hash : TIMING_EQUALIZATION_HASH
    );

    const outcome = decideLoginOutcome({
      adminFound: Boolean(admin),
      isActive: Boolean(admin?.is_active),
      passwordMatches,
    });

    if (outcome !== "authenticated" || !admin) {
      return genericFailureResponse();
    }

    const { rawToken } = await createSessionForAdmin(admin.id, client);

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, rawToken, buildSessionCookieOptions());
    return response;
  } catch (err) {
    console.error(
      "[VISART ADMIN AUTH] login: unexpected failure, failing closed:",
      err instanceof Error ? err.message : String(err)
    );
    return genericFailureResponse();
  }
}
