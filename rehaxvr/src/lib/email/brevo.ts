// Brevo REST API client for application-specific transactional emails.
// Server-only — do NOT import in client components or pages without "use server".
// Supabase Auth emails (confirm signup, password recovery) go through Brevo SMTP
// configured in the Supabase dashboard, NOT through this client.
if (typeof window !== "undefined") {
  throw new Error("src/lib/email/brevo.ts is server-only and cannot be imported in the browser.");
}

import { welcomeEmail } from "./templates/welcome";
import { passwordChangedEmail } from "./templates/password-changed";
import { inviteEmail } from "./templates/invite";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface SendEmailParams {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // In development without a key, log instead of throwing so the auth flow still works.
    console.warn("[brevo] BREVO_API_KEY not set — email skipped:", subject, "→", to.email);
    return;
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL ?? "no-reply@rehaxvr.com",
        name: process.env.BREVO_SENDER_NAME ?? "RehaxVR",
      },
      to: [to],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    // Log but don't throw — a failed welcome/security email must not break the auth flow.
    console.error("[brevo] send failed:", response.status, body);
  }
}

/** Sends the post-verification welcome email. */
export async function sendWelcome(params: {
  to: { email: string; name: string };
}): Promise<void> {
  const template = welcomeEmail({ fullName: params.to.name, email: params.to.email });
  await sendEmail({ to: params.to, ...template });
}

/** Sends a security notification after a successful password reset. */
export async function sendPasswordChanged(params: {
  to: { email: string };
}): Promise<void> {
  const template = passwordChangedEmail({ email: params.to.email });
  await sendEmail({ to: params.to, ...template });
}

// Same wire call as sendEmail() but REPORTS success/failure to the caller
// so team-invite failures aren't silently swallowed. The invitation row must
// stay PENDING and retryable if the provider rejects the request.
async function sendEmailReporting({ to, subject, html, text }: SendEmailParams): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[brevo] BREVO_API_KEY not set — email skipped:", subject, "→", to.email);
    return { ok: false, error: "Email provider not configured" };
  }
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL ?? "no-reply@rehaxvr.com",
          name: process.env.BREVO_SENDER_NAME ?? "RehaxVR",
        },
        to: [to],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error("[brevo] invite send failed:", response.status, body);
      return { ok: false, error: `Provider error (${response.status})` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[brevo] invite send threw:", err);
    return { ok: false, error: "Network error contacting email provider" };
  }
}

// Sends a team-invitation email and reports whether the provider accepted it.
// A false return leaves the DB row PENDING so a later resend can succeed.
export async function sendInvite(params: {
  to: { email: string };
  inviterName: string;
  organizationName: string;
  role: string;
  acceptUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  const template = inviteEmail({
    inviterName: params.inviterName,
    organizationName: params.organizationName,
    role: params.role,
    acceptUrl: params.acceptUrl,
  });
  return sendEmailReporting({ to: params.to, ...template });
}
