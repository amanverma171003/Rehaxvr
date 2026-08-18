// Auth callback — single trusted entry point for all Supabase email links.
// PKCE flow: the email link redirects here with ?code=xxx&next=/path.
// We exchange the code for a session, then redirect to `next`.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcome } from "@/lib/email/brevo";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // `next` is set by signUp / forgotPassword actions in emailRedirectTo.
  // Validated to be an internal path to prevent open redirects.
  const nextRaw = searchParams.get("next") ?? "/app";
  const next = nextRaw.startsWith("/") ? nextRaw : "/app";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Send the welcome email only for the standard org-signup verification path.
      // Recovery callbacks skip this (next=/reset-password), and invitees skip it
      // too — they already received the invite email; a welcome email would be noise.
      if (next === "/onboarding") {
        const name =
          data.user.user_metadata?.full_name ??
          data.user.email?.split("@")[0] ??
          "";
        await sendWelcome({ to: { email: data.user.email!, name } });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Missing or invalid code — the link was expired, already used, or malformed.
  return NextResponse.redirect(`${origin}/login?reason=invalid-link`);
}
