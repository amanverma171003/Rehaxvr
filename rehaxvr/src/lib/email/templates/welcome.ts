// Welcome email — sent after the user confirms their email via the auth callback.
// This is an app-specific email; the confirmation link itself is sent by Supabase/Brevo SMTP.
import { emailLayout } from "./layout";

interface WelcomeParams {
  fullName: string;
  email: string;
}

export function welcomeEmail({ fullName, email: _email }: WelcomeParams): {
  subject: string;
  html: string;
  text: string;
} {
  const firstName = fullName.split(" ")[0] || fullName;

  const html = emailLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
      Welcome to RehaxVR, ${firstName}!
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">
      Your email is confirmed and your account is ready. Next, complete your
      organization setup to start managing patients and sessions.
    </p>
    <a
      href="${process.env.NEXT_PUBLIC_SITE_URL}/onboarding"
      style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;"
    >
      Set up your organization
    </a>
    <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.5;">
      If you didn&rsquo;t create this account, you can safely ignore this email.
    </p>
  `);

  const text = `Welcome to RehaxVR, ${firstName}!\n\nYour email is confirmed. Complete your organization setup at:\n${process.env.NEXT_PUBLIC_SITE_URL}/onboarding`;

  return { subject: `Welcome to RehaxVR, ${firstName}!`, html, text };
}
