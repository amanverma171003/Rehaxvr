"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { resendVerification } from "@/lib/auth/actions";

function VerifyEmailContent() {
  const params = useSearchParams();
  // Email is passed as a query param from the signup page — no sessionStorage.
  const email = params.get("email") ?? "your work email";
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleResend = async () => {
    setResendState("sending");
    const result = await resendVerification(email);
    setResendState(result.ok ? "sent" : "error");
  };

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
          variant="ghost"
          className="w-full"
          onClick={handleResend}
          disabled={resendState === "sending" || resendState === "sent"}
        >
          {resendState === "sending"
            ? "Sending…"
            : resendState === "sent"
              ? "Email sent — check your inbox"
              : "Resend verification email"}
        </Button>
      </div>
      {resendState === "error" && (
        <p className="mt-3 text-xs text-danger">
          Could not resend. Please wait a moment and try again.
        </p>
      )}
      <p className="mt-6 text-xs text-muted-foreground">
        Wrong address?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Go back and edit it
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
