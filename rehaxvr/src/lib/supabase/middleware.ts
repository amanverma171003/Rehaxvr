// Cookie-refresh helper used exclusively by src/middleware.ts.
// Calls getUser() on every request so the session token is rotated before it expires.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write updated cookies onto both the request (so downstream code sees them)
          // and the response (so the browser receives them).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: do not call supabase.auth.getSession() here.
  // getUser() re-validates the token with the Auth server — getSession() only reads
  // the local cookie and can be spoofed by a modified cookie value.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the onboarding gate context in the same round-trip so middleware can
  // steer /app vs /onboarding without a second call from every request handler.
  // Null when the user isn't signed in.
  let onboardedAt: string | null = null;
  let organizationId: string | null = null;
  if (user) {
    const { data } = await supabase.rpc("get_session_context");
    const row = Array.isArray(data) ? data[0] : data;
    if (row) {
      onboardedAt = row.onboarded_at ?? null;
      organizationId = row.organization_id ?? null;
    }
  }

  return { supabaseResponse, user, onboardedAt, organizationId };
}
