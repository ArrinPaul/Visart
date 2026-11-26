// Server-only. Pure decision logic extracted out of app/api/admin/auth/login/route.ts so the
// "no account enumeration" property — that a missing account, an inactive account, and a wrong
// password all produce the exact same outcome (and therefore the exact same HTTP response) — is
// directly testable (see loginDecision.test.mts) without constructing a NextRequest or talking to
// a database. The route handler calls this after looking up the account and verifying the
// password, then renders the one generic failure response for every "rejected" outcome.

export type LoginAttemptContext = {
  adminFound: boolean;
  isActive: boolean;
  passwordMatches: boolean;
};

export type LoginOutcome = "authenticated" | "rejected";

export function decideLoginOutcome(ctx: LoginAttemptContext): LoginOutcome {
  if (!ctx.adminFound) return "rejected";
  if (!ctx.isActive) return "rejected";
  if (!ctx.passwordMatches) return "rejected";
  return "authenticated";
}
