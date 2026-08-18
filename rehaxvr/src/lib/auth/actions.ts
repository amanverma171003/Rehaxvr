"use server";
// Server Actions for all auth flows.
// Password hashing is handled by Supabase GoTrue (bcrypt) — we never hash passwords here.
// These actions are called from client components via form onSubmit or useTransition.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/lib/auth/errors";
import { mapOnboardingError } from "@/lib/onboarding/errors";
import { sendPasswordChanged } from "@/lib/email/brevo";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth-schemas";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function signUp(
  formData: {
    organizationName: string;
    fullName: string;
    email: string;
    password: string;
    confirm: string;
    terms: true;
  },
  options?: { invite?: string }
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const { organizationName, fullName, email, password } = parsed.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  // Build the post-verification landing target. Invite branch routes back to the
  // accept-invite page with the raw token preserved. URL parts are encoded via
  // URLSearchParams (never string concatenation) so nested query strings survive.
  let nextPath = "/onboarding";
  if (options?.invite) {
    const inner = new URLSearchParams({ token: options.invite }).toString();
    nextPath = `/auth/accept-invite?${inner}`;
  }
  const outer = new URLSearchParams({ next: nextPath }).toString();
  const emailRedirectTo = `${siteUrl}/auth/callback?${outer}`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
        // organization_name is only meaningful for the standard signup branch;
        // handle_new_user() reads full_name into profiles regardless.
        organization_name: organizationName,
      },
    },
  });

  if (error) return { ok: false, error: mapAuthError(error) };
  return { ok: true };
}

// Accept a team invitation: exchanges the raw token for org membership.
// Called from the /auth/accept-invite page while the invitee is signed in.
// The raw token never leaves this function — errors log invitation-id/email only.
export async function acceptInvite(token: string): Promise<ActionResult> {
  if (!token) return { ok: false, error: "invitation not found" };
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_invitation", { p_token: token });
  if (error) return { ok: false, error: mapOnboardingError(error) };
  return { ok: true };
}

export async function signIn(formData: {
  email: string;
  password: string;
  remember?: boolean;
}): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { ok: false, error: mapAuthError(error) };
  redirect("/app");
}

export async function forgotPassword(formData: {
  email: string;
}): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  // Always return ok:true regardless of whether the email exists to prevent
  // user enumeration (an attacker cannot determine which emails are registered).
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  return { ok: true };
}

export async function resetPassword(formData: {
  password: string;
  confirm: string;
}): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) return { ok: false, error: mapAuthError(error) };

  // Security notification — fire-and-forget; a send failure must not block the reset.
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email) {
    await sendPasswordChanged({ to: { email: user.email } });
  }

  return { ok: true };
}

export async function resendVerification(email: string): Promise<ActionResult> {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
    },
  });

  if (error) return { ok: false, error: mapAuthError(error) };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
