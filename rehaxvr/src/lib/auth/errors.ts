// Maps Supabase AuthError codes to user-facing strings.
// Keeps error messaging consistent across all auth pages.

const ERROR_MAP: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect.",
  email_not_confirmed:
    "Please verify your email first. Check your inbox for the confirmation link.",
  over_email_send_rate_limit:
    "Too many attempts. Please wait a minute and try again.",
  weak_password: "Password does not meet the requirements.",
  email_exists: "An account with this email already exists.",
  user_not_found: "No account found with that email address.",
  session_not_found: "Your session has expired. Please log in again.",
  same_password: "New password must be different from your current password.",
  token_expired: "This link has expired. Please request a new one.",
  otp_expired: "This link has expired. Please request a new one.",
};

/** Returns a user-friendly message for any Supabase auth error. */
export function mapAuthError(error: { message?: string; code?: string } | null): string {
  if (!error) return "Something went wrong. Please try again.";
  const code = error.code ?? "";
  return ERROR_MAP[code] ?? error.message ?? "Something went wrong. Please try again.";
}
