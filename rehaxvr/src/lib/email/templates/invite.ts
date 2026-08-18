// Placeholder — used by the team invitation flow (future migration).
// Exported here so the module graph is established; not called in V1 auth.
import { emailLayout } from "./layout";

interface InviteParams {
  inviterName: string;
  organizationName: string;
  role: string;
  acceptUrl: string;
}

export function inviteEmail({
  inviterName,
  organizationName,
  role,
  acceptUrl,
}: InviteParams): { subject: string; html: string; text: string } {
  const html = emailLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
      You&rsquo;ve been invited to ${organizationName}
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">
      ${inviterName} has invited you to join <strong>${organizationName}</strong>
      on RehaxVR as a <strong>${role}</strong>.
    </p>
    <a
      href="${acceptUrl}"
      style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;"
    >
      Accept invitation
    </a>
    <p style="margin:24px 0 0;font-size:13px;color:#71717a;">
      This invitation expires in 7 days. If you weren&rsquo;t expecting this, ignore it.
    </p>
  `);

  const text = `${inviterName} invited you to ${organizationName} on RehaxVR.\n\nAccept: ${acceptUrl}`;

  return {
    subject: `You're invited to ${organizationName} on RehaxVR`,
    html,
    text,
  };
}
