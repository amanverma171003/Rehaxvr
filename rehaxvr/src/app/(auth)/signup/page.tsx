"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth/password-input";
import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth/actions";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth-schemas";

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] ${ok ? "text-success" : "text-muted-foreground"}`}
    >
      {ok ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
      {label}
    </span>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invite = searchParams.get("invite") ?? undefined;
  const invitedEmail = searchParams.get("email") ?? undefined;
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      terms: undefined,
      email: invitedEmail,
      // Placeholder org name so the shared schema still validates on the invite
      // branch — the value is unused (invitee joins the inviting org via the
      // accept RPC, not bootstrap_onboarding_org).
      organizationName: invite ? "Invited" : undefined,
    },
  });

  useEffect(() => {
    if (invitedEmail) setValue("email", invitedEmail);
    if (invite) setValue("organizationName", "Invited");
  }, [invite, invitedEmail, setValue]);

  const pwd = watch("password") ?? "";

  const onSubmit = async (values: SignUpInput) => {
    setServerError(null);
    const result = await signUp(values, invite ? { invite } : undefined);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        {invite ? "Accept your invitation" : "Create your organization account"}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {invite
          ? "Create your account to join the team you were invited to."
          : "Set up RehaxVR for your clinic or rehabilitation organization."}
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
        {!invite && (
          <div>
            <Label htmlFor="su-org">Organization name</Label>
            <Input
              id="su-org"
              className="mt-1.5"
              placeholder="Riverside Rehabilitation Center"
              aria-invalid={!!errors.organizationName}
              {...register("organizationName")}
            />
            {errors.organizationName && (
              <p className="mt-1 text-xs text-danger" role="alert">{errors.organizationName.message}</p>
            )}
          </div>
        )}
        <div>
          <Label htmlFor="su-name">Your name</Label>
          <Input
            id="su-name"
            className="mt-1.5"
            placeholder="Dr. Jane Smith"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="su-email">Work email</Label>
          <Input
            id="su-email"
            type="email"
            className="mt-1.5"
            placeholder="jane@yourclinic.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            readOnly={!!invite}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="su-password">Password</Label>
          <div className="mt-1.5">
            <PasswordInput
              id="su-password"
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
          <Label htmlFor="su-confirm">Confirm password</Label>
          <div className="mt-1.5">
            <PasswordInput
              id="su-confirm"
              autoComplete="new-password"
              aria-invalid={!!errors.confirm}
              {...register("confirm")}
            />
          </div>
          {errors.confirm && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.confirm.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="su-terms"
              checked={watch("terms") === true}
              onCheckedChange={(v) =>
                setValue("terms", v === true ? true : (undefined as unknown as true), {
                  shouldValidate: true,
                })
              }
              aria-invalid={!!errors.terms}
            />
            <Label htmlFor="su-terms" className="text-sm font-normal leading-snug text-body">
              I agree to the RehaxVR Terms of Service and Data Processing
              Agreement on behalf of my organization.
            </Label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.terms.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
