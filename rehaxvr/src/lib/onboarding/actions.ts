"use server";
// Server Actions for the onboarding wizard.
// Every write goes through a SECURITY DEFINER RPC in Postgres, so the
// user-scoped Supabase client here only needs to be authenticated — the RPC
// enforces "is this really the user's in-progress org" and "are they ADMIN".
// We never bypass RLS with a service-role client for onboarding writes.

import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { mapOnboardingError } from "@/lib/onboarding/errors";
import { sendInvite } from "@/lib/email/brevo";
import {
  organizationStepSchema,
  profileStepSchema,
  planStepSchema,
  invitesStepSchema,
  type OrganizationStepInput,
  type ProfileStepInput,
  type PlanStepInput,
  type InvitesStepInput,
} from "@/lib/validation/onboarding-schemas";

// Every action returns the same discriminated shape as lib/auth/actions.ts
// so the wizard can render errors identically to the login/signup forms.
type ActionResult<T = undefined> =
  | (T extends undefined ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

// -----------------------------------------------------------------------------
// Step 1 — Organization
// Idempotent: on retry the RPC updates the same org via profiles.onboarding_organization_id.
// -----------------------------------------------------------------------------
export async function saveOrganizationStep(
  input: OrganizationStepInput
): Promise<ActionResult<{ organizationId: string }>> {
  const parsed = organizationStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("bootstrap_onboarding_org", {
    p_name: parsed.data.orgName,
    p_org_type: parsed.data.orgType,
    // stations/useCase aren't columns on organizations yet — kept client-side for now.
    p_location: null,
  });

  if (error) return { ok: false, error: mapOnboardingError(error) };
  return { ok: true, data: { organizationId: data as string } };
}

// -----------------------------------------------------------------------------
// Step 2 — Admin profile
// Updates profiles.full_name via the existing profiles_self_update RLS policy.
// -----------------------------------------------------------------------------
export async function saveProfileStep(input: ProfileStepInput): Promise<ActionResult> {
  const parsed = profileStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session has expired. Sign in again." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.adminName, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { ok: false, error: mapOnboardingError(error) };
  return { ok: true };
}

// -----------------------------------------------------------------------------
// Step 3 — Plan
// Upserts a draft subscription (status=INCOMPLETE). Safe to retry.
// -----------------------------------------------------------------------------
export async function savePlanStep(input: PlanStepInput): Promise<ActionResult> {
  const parsed = planStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.rpc("save_plan_step", {
    p_plan_code: parsed.data.plan,
    p_interval: parsed.data.cycle,
  });

  if (error) return { ok: false, error: mapOnboardingError(error) };
  return { ok: true };
}

// -----------------------------------------------------------------------------
// Step 4 — Demo checkout (NO Stripe)
// Flips the draft subscription to ACTIVE. Comment clearly for future readers.
// -----------------------------------------------------------------------------
export async function confirmDemoPayment(): Promise<ActionResult> {
  // Demo checkout — no real payment is processed. Swap for a Stripe checkout
  // session + webhook when we move off demo billing.
  const supabase = await createClient();
  const { error } = await supabase.rpc("confirm_demo_payment");
  if (error) return { ok: false, error: mapOnboardingError(error) };
  return { ok: true };
}

// -----------------------------------------------------------------------------
// Step 5 — Team invitations
// Insert one PENDING invitation row per invite, then send the email. Email
// failures do NOT roll back the row; the caller sees per-invite results and
// can resend later without duplicating the invitation.
// -----------------------------------------------------------------------------
export interface InviteResult {
  email: string;
  ok: boolean;
  emailSent: boolean;
  error?: string;
}

export async function sendInvites(input: InvitesStepInput): Promise<ActionResult<{ results: InviteResult[] }>> {
  const parsed = invitesStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await createClient();

  // We need the org name + inviter name for the email body — one round-trip.
  const { data: ctx, error: ctxErr } = await supabase.rpc("get_onboarding_state");
  if (ctxErr) return { ok: false, error: mapOnboardingError(ctxErr) };
  // rpc returns a jsonb value; supabase-js hands us the parsed object.
  const state = ctx as { organization: { name: string } | null; profile: { fullName: string } };
  const orgName = state?.organization?.name ?? "your organization";
  const inviterName = state?.profile?.fullName ?? "Someone";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const results: InviteResult[] = [];

  for (const invite of parsed.data.invites) {
    // Cryptographically random bearer token — the raw value is emailed to the
    // invitee; only its sha256 hash is persisted. Not a JWT, not signed.
    const rawToken = randomUUID();
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const { error: insertErr } = await supabase.rpc("create_invitation_row", {
      p_email: invite.email,
      p_role: invite.role,
      p_token_hash: tokenHash,
    });

    if (insertErr) {
      results.push({ email: invite.email, ok: false, emailSent: false, error: mapOnboardingError(insertErr) });
      continue;
    }

    const acceptUrl = `${siteUrl}/auth/accept-invite?token=${encodeURIComponent(rawToken)}`;
    const send = await sendInvite({
      to: { email: invite.email },
      inviterName,
      organizationName: orgName,
      role: invite.role,
      acceptUrl,
    });

    // Row exists either way; emailSent tells the wizard whether the invitee will
    // actually see anything. The DB row stays PENDING and is safe to resend.
    results.push({
      email: invite.email,
      ok: true,
      emailSent: send.ok,
      error: send.ok ? undefined : send.error,
    });
  }

  return { ok: true, data: { results } };
}

// -----------------------------------------------------------------------------
// Step 6 — Complete
// The RPC re-verifies every prerequisite server-side — we never trust the UI.
// -----------------------------------------------------------------------------
export async function completeOnboarding(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("complete_onboarding");
  if (error) return { ok: false, error: mapOnboardingError(error) };
  return { ok: true };
}

// -----------------------------------------------------------------------------
// Resume support — the wizard calls this on mount to jump to the right step.
// -----------------------------------------------------------------------------
export interface OnboardingStateSnapshot {
  onboardedAt: string | null;
  organization: { id: string; name: string; org_type: string; location: string | null } | null;
  profile: { fullName: string | null };
  subscription: { plan_code: string; interval: "MONTHLY" | "YEARLY"; status: string } | null;
}

export async function getOnboardingState(): Promise<ActionResult<OnboardingStateSnapshot>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_onboarding_state");
  if (error) return { ok: false, error: mapOnboardingError(error) };
  return { ok: true, data: data as OnboardingStateSnapshot };
}
