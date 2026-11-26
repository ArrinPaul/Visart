// Server-only. Strict Origin-header validation for the admin login/logout endpoints (and
// reusable for Batch 3's route guards, per the batch instructions).
//
// Deliberately does NOT consult Host, X-Forwarded-Host, or Referer — none of those are reliable
// proof of where a browser request actually originated (Host/X-Forwarded-Host describe where the
// request was *sent*, not where it came from, and are attacker-controllable in the general case;
// Referer can be stripped by the browser/extensions and is not designed for this purpose). Origin
// is the header browsers attach to cross-site requests specifically for this kind of check, and
// is not under the requester's control to spoof from a browser context.
//
// Requires the APP_ORIGIN environment variable (see docs/ADMIN_SESSIONS.md) — no default, no
// wildcard. If it is missing or malformed, every request is rejected (fail closed), never
// allowed through.

function getConfiguredAppOrigin(): string {
  const configured = process.env.APP_ORIGIN;
  if (!configured || configured.trim().length === 0) {
    throw new Error(
      "APP_ORIGIN is not configured. Admin login/logout cannot proceed until it is set " +
        "(fail-closed by design — see docs/ADMIN_SESSIONS.md)."
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(configured);
  } catch {
    throw new Error("APP_ORIGIN is not a valid absolute URL (e.g. https://your-app.example).");
  }

  // .origin normalizes to scheme://host[:port] with no trailing slash and no path — exactly the
  // form the browser's Origin header itself takes, so the comparison below is a straightforward
  // normalized string equality rather than an ad hoc "starts with" prefix check.
  return parsed.origin;
}

/**
 * Returns true only if `requestOriginHeader` is present, well-formed, and exactly matches the
 * configured APP_ORIGIN. Returns false (never throws) for every other case, including when
 * APP_ORIGIN itself is missing/malformed — the caller should treat `false` as "reject this
 * request," so a misconfigured environment fails closed rather than silently allowing requests
 * through.
 */
export function isTrustedOrigin(requestOriginHeader: string | null | undefined): boolean {
  if (!requestOriginHeader || requestOriginHeader.trim().length === 0) {
    return false;
  }

  let configuredOrigin: string;
  try {
    configuredOrigin = getConfiguredAppOrigin();
  } catch {
    return false;
  }

  let requestOrigin: string;
  try {
    requestOrigin = new URL(requestOriginHeader).origin;
  } catch {
    return false;
  }

  return requestOrigin === configuredOrigin;
}
