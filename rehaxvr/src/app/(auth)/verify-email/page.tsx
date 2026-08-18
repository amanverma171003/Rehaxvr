"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MailCheck, CheckCircle2, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>("your work email");
  const [state, setState] = useState<"waiting" | "verifying" | "verified">("waiting");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("rehaxvr-onboarding");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch { /* ignore */ }
  }, []);

  const simulateVerify = async () => {
    setState("verifying");
    await new Promise((r) => setTimeout(r, 1200));
    setState("verified");
  };

  if (state === "verified") {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-teal/12 text-teal">
          <CheckCircle2 className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          Email verified
        </h1>
        <p className="mt-2 text-sm text-body">
          Your account is confirmed. Next, let&apos;s set up your organization —
          it takes about five minutes.
        </p>
        <Button size="lg" className="mt-6 w-full" asChild>
          <Link href="/onboarding">Continue to organization setup</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-primary">
        <MailCheck className="size-7" aria-hidden />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
        Verify your email
      </h1>
      <p className="mt-2 text-sm text-body">
        We&apos;ve sent a verification link to{" "}
        <span className="font-medium text-ink">{email}</span>. Click it to
        activate your organization account.
      </p>
      <div className="mt-6 space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={simulateVerify}
          disabled={state === "verifying"}
        >
          {state === "verifying" && (
            <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
          )}
          {state === "verifying" ? "Verifying…" : "I clicked the link (demo)"}
        </Button>
        <Button variant="ghost" className="w-full">
          Resend verification email
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Wrong address?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Go back and edit it
        </Link>
      </p>
    </div>
  );
}
