// Security notification sent after a successful password reset.
// Supabase does not send this automatically — we fire it from the resetPassword action.
import { emailLayout } from "./layout";

interface PasswordChangedParams {
  email: string;
}

export function passwordChangedEmail({ email }: PasswordChangedParams): {
  subject: string;
  html: string;
  text: string;
} {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const html = emailLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
      Your password was changed
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">
      The password for <strong>${email}</strong> was successfully updated.
      If you made this change, no action is needed.
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">
      If you <strong>did not</strong> change your password, your account may be
      compromised. Reset it immediately:
    </p>
    <a
      href="${siteUrl}/forgot-password"
      style="display:inline-block;background:#dc2626;color:#ffffff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;"
    >
      Reset my password now
    </a>
    <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.5;">
      For help, contact
      <a href="mailto:support@rehaxvr.com" style="color:#2563eb;text-decoration:none;">support@rehaxvr.com</a>.
    </p>
  `);

  const text = `Your RehaxVR password was changed.\n\nIf you did not make this change, reset your password immediately:\n${siteUrl}/forgot-password`;

  return {
    subject: "Your RehaxVR password was changed",
    html,
    text,
  };
}
