"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { Check, CheckCircle2, Loader2, TimerOff, X } from "lucide-react";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });
type FormValues = z.infer<typeof schema>;

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] ${ok ? "text-success" : "text-muted-foreground"}`}>
      {ok ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
      {label}
    </span>
  );
}

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const pwd = watch("password") ?? "";

  // Invalid / expired token states
  if (!token || token === "expired" || token === "invalid") {
    const expired = token === "expired";
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-warning/10 text-warning">
          <TimerOff className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          {expired ? "This reset link has expired" : "This reset link isn't valid"}
        </h1>
        <p className="mt-2 text-sm text-body">
          {expired
            ? "Reset links expire after 30 minutes for security. Request a new one and you'll be back in shortly."
            : "The link may have been used already or copied incompletely. Request a fresh link to continue."}
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

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Choose a new password
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Almost there. Pick a strong password you haven&apos;t used before.
      </p>
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
