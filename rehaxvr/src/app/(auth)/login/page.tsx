"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth/password-input";
import { AlertTriangle, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/actions";
import { signInSchema, type SignInInput } from "@/lib/validation/auth-schemas";

function LoginForm() {
  const params = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const expired = params.get("reason") === "expired";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (values: SignInInput) => {
    setServerError(null);
    const result = await signIn(values);
    // signIn redirects on success; we only reach here on failure.
    if (!result.ok) setServerError(result.error);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in to your organization workspace.
      </p>

      {expired && (
        <div
          className="mt-5 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/8 px-3 py-2.5 text-sm text-warning"
          role="status"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          Your session expired. Please sign in again.
        </div>
      )}

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
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@yourclinic.com"
            className="mt-1.5"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-1.5">
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-danger" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            defaultChecked
            onCheckedChange={(v) => setValue("remember", v === true)}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-body">
            Remember me on this device
          </Label>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to RehaxVR?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an organization account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
