// Maps Postgres and RPC error messages to short user-facing strings for the wizard.
// Structured like lib/auth/errors.ts so both flows read the same way.

// Postgres SQLSTATE codes we care about — keeps the switch below readable.
const PG_UNIQUE_VIOLATION = "23505";

// Raised inside RPCs via `raise exception '<msg>'` — the strings are stable.
const RPC_MESSAGE_MAP: Record<string, string> = {
  "not authenticated": "Your session has expired. Sign in again.",
  "not authorized": "You don't have permission to do that.",
  "organization step incomplete": "Complete the organization step first.",
  "profile step incomplete": "Add your full name before finishing.",
  "admin membership missing": "You aren't an admin on this organization.",
  "active subscription missing": "Confirm your plan before finishing.",
  "no draft subscription found": "Pick a plan before confirming payment.",
};

interface PostgrestLike {
  message?: string;
  code?: string;
  details?: string;
}

// includes onboarding-specific error mapping so the wizard can surface actionable text
export function mapOnboardingError(error: PostgrestLike | Error | null | undefined): string {
  if (!error) return "Something went wrong. Try again.";

  const message = (error as PostgrestLike).message ?? (error as Error).message ?? "";
  const code = (error as PostgrestLike).code;

  // Direct match against RPC exception strings.
  for (const key of Object.keys(RPC_MESSAGE_MAP)) {
    if (message.toLowerCase().includes(key)) return RPC_MESSAGE_MAP[key];
  }

  if (code === PG_UNIQUE_VIOLATION) {
    if (message.includes("organizations_slug_key")) {
      return "That organization name is already taken. Try a different one.";
    }
    if (message.includes("invitations_one_pending_per_email")) {
      return "You've already invited that email. Wait for them to accept.";
    }
    return "That entry already exists.";
  }

  // Fall back to the raw message so we don't hide errors in dev.
  return message || "Something went wrong. Try again.";
}
