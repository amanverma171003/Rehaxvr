// Accept a team invitation.
// URL: /auth/accept-invite?token=<raw>
// - Anonymous: preview the invitation, bounce to /signup with the token + email.
// - Signed in as the invited email: accept, land on /app.
// - Signed in as a different email: explain and offer sign-out.
// The raw token stays in-request; it is never logged, persisted, or echoed in
// error strings returned to the client.

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { mapOnboardingError } from "@/lib/onboarding/errors";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { AlertTriangle, MailCheck, ShieldAlert } from "lucide-react";

type PreviewResult = {
  valid: boolean;
  reason?: string;
  email?: string;
  role?: string;
  organization_name?: string;
  status?: string;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-6">
          <Logo />
        </div>
      </header>
      <main className="mx-auto max-w-md px-6 py-16">{children}</main>
    </div>
  );
}

function ErrorCard({ title, body }: { title: string; body: string }) {
  return (
    <Shell>
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/8 text-danger">
          <AlertTriangle className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm text-body">{body}</p>
        <div className="mt-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Go to sign in</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <ErrorCard
        title="Invitation link is incomplete"
        body="The link you followed is missing its token. Ask the person who invited you to resend it."
      />
    );
  }

  const supabase = await createClient();

  // 1) Read-only preview — safe pre-auth because the RPC returns only display fields.
  const { data: previewRaw, error: previewErr } = await supabase.rpc(
    "preview_invitation",
    { p_token: token }
  );
  if (previewErr) {
    return (
      <ErrorCard
        title="Couldn't check your invitation"
        body={mapOnboardingError(previewErr)}
      />
    );
  }
  const preview = (previewRaw ?? {}) as PreviewResult;

  if (!preview.valid) {
    const map: Record<string, { title: string; body: string }> = {
      "invitation not found": {
        title: "Invitation not found",
        body: "This invitation link is unknown or has been revoked.",
      },
      "invitation expired": {
        title: "Invitation expired",
        body: "This invitation is more than 7 days old. Ask an admin to send a new one.",
      },
      "invitation revoked": {
        title: "Invitation revoked",
        body: "An admin cancelled this invitation. Ask them to send a new one if this is a mistake.",
      },
      "invitation already used": {
        title: "Invitation already used",
        body: "This invitation has already been accepted. Sign in to your account instead.",
      },
    };
    const copy = map[preview.reason ?? ""] ?? {
      title: "Invitation unavailable",
      body: preview.reason ?? "This invitation can't be used.",
    };
    return <ErrorCard {...copy} />;
  }

  const inviteEmail = (preview.email ?? "").toLowerCase();

  // 2) Anonymous → signup with token + prefilled email.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const params = new URLSearchParams({ invite: token, email: inviteEmail });
    redirect(`/signup?${params.toString()}`);
  }

  const currentEmail = (user.email ?? "").toLowerCase();

  // 3) Wrong-account guard.
  if (currentEmail !== inviteEmail) {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-warning/10 text-warning">
            <ShieldAlert className="size-7" aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
            Signed in as the wrong account
          </h1>
          <p className="mt-2 text-sm text-body">
            This invitation is for{" "}
            <span className="font-medium text-ink">{inviteEmail}</span>, but
            you&apos;re signed in as{" "}
            <span className="font-medium text-ink">{currentEmail}</span>.
          </p>
          <form action={signOut} className="mt-6">
            <Button type="submit" size="lg" className="w-full">
              Sign out and continue
            </Button>
          </form>
        </div>
      </Shell>
    );
  }

  // 4) Accept. Idempotent server-side; safe on refresh.
  const { error: acceptErr } = await supabase.rpc("accept_invitation", {
    p_token: token,
  });
  if (acceptErr) {
    return (
      <ErrorCard
        title="Couldn't accept your invitation"
        body={mapOnboardingError(acceptErr)}
      />
    );
  }

  // 5) Show a brief confirmation, then let middleware route them to /app.
  redirect("/app");

  // Unreached — kept so the type checker sees a return.
  return (
    <Shell>
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success">
          <MailCheck className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          Welcome to {preview.organization_name}
        </h1>
      </div>
    </Shell>
  );
}
