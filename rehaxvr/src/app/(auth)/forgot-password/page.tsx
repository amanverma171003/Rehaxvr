"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { forgotPassword } from "@/lib/auth/actions";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth-schemas";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordInput) => {
    // Always returns ok:true — prevents revealing which emails are registered.
    await forgotPassword(values);
    setSentTo(values.email);
  };

  if (sentTo) {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-primary">
          <MailCheck className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-body">
          If an account exists for{" "}
          <span className="font-medium text-ink">{sentTo}</span>, we&apos;ve
          sent a password reset link. It expires in 30 minutes.
        </p>
        <div className="mt-6 space-y-3">
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">
              <ArrowLeft data-icon="inline-start" aria-hidden />
              Back to sign in
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Didn&apos;t receive it? Check spam, or{" "}
          <button
            className="font-medium text-primary hover:underline"
            onClick={() => setSentTo(null)}
          >
            try a different address
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Reset your password
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter the email you use for RehaxVR and we&apos;ll send you a reset link.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="fp-email">Email</Label>
          <Input
            id="fp-email"
            type="email"
            autoComplete="email"
            placeholder="you@yourclinic.com"
            className="mt-1.5"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
          {isSubmitting ? "Sending link…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
