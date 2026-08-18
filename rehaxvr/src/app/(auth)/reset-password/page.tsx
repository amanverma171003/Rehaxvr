"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { AlertTriangle, Check, CheckCircle2, Loader2, TimerOff, X } from "lucide-react";
import { resetPassword } from "@/lib/auth/actions";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth-schemas";
import { useAuthContext } from "@/components/auth/auth-provider";

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] ${ok ? "text-success" : "text-muted-foreground"}`}>
      {ok ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
      {label}
    </span>
  );
}

function ResetForm() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const pwd = watch("password") ?? "";

  const onSubmit = async (values: ResetPasswordInput) => {
    setServerError(null);
    const result = await resetPassword(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setDone(true);
    // Redirect to login after a brief moment so the success state is readable.
    setTimeout(() => router.push("/login?reset=success"), 2500);
  };

  // Still resolving whether the user came through the recovery callback.
  if (loading) return null;

  // No session means the callback link was never clicked, or the session expired.
  if (!user) {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-warning/10 text-warning">
          <TimerOff className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          This reset link isn&apos;t valid
        </h1>
        <p className="mt-2 text-sm text-body">
          The link may have expired or been used already. Request a fresh link to continue.
        </p>
        <div className="mt-6 space-y-3">
          <Button className="w-full" asChild>
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-teal/12 text-teal">
          <CheckCircle2 className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          Password updated
        </h1>
        <p className="mt-2 text-sm text-body">
          Your password has been changed successfully. Sign in with your new
          password to continue.
        </p>
        <Button size="lg" className="mt-6 w-full" asChild>
          <Link href="/login">Return to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Choose a new password
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Almost there. Pick a strong password you haven&apos;t used before.
      </p>

      {serverError && (
        <div
          className="mt-5 flex items-start gap-2 rounded-lg border border-danger/25 bg-danger/6 px-3 py-2.5 text-sm text-danger"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="rp-password">New password</Label>
          <div className="mt-1.5">
            <PasswordInput
              id="rp-password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
            <Requirement ok={pwd.length >= 8} label="8+ characters" />
            <Requirement ok={/[A-Z]/.test(pwd)} label="Uppercase letter" />
            <Requirement ok={/[0-9]/.test(pwd)} label="Number" />
            <Requirement ok={/[^A-Za-z0-9]/.test(pwd)} label="Symbol" />
          </div>
        </div>
        <div>
          <Label htmlFor="rp-confirm">Confirm new password</Label>
          <div className="mt-1.5">
            <PasswordInput
              id="rp-confirm"
              autoComplete="new-password"
              aria-invalid={!!errors.confirm}
              {...register("confirm")}
            />
          </div>
          {errors.confirm && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.confirm.message}</p>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
