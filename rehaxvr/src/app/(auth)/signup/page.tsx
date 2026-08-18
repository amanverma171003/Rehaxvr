"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth/password-input";
import { Check, Loader2, X } from "lucide-react";

const schema = z
  .object({
    organization: z.string().min(2, "Please enter your organization name"),
    adminName: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Please enter a valid work email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v, {
      message: "Please accept the terms to continue",
    }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

type FormValues = z.infer<typeof schema>;

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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  });

  const pwd = watch("password") ?? "";

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    try {
      sessionStorage.setItem(
        "rehaxvr-onboarding",
        JSON.stringify({ organization: values.organization, adminName: values.adminName, email: values.email })
      );
    } catch { /* ignore */ }
    router.push("/verify-email");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Create your organization account
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Set up RehaxVR for your clinic or rehabilitation organization.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="su-org">Organization name</Label>
          <Input
            id="su-org"
            className="mt-1.5"
            placeholder="Riverside Rehabilitation Center"
            aria-invalid={!!errors.organization}
            {...register("organization")}
          />
          {errors.organization && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.organization.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="su-name">Your name</Label>
          <Input
            id="su-name"
            className="mt-1.5"
            placeholder="Dr. Jane Smith"
            autoComplete="name"
            aria-invalid={!!errors.adminName}
            {...register("adminName")}
          />
          {errors.adminName && (
            <p className="mt-1 text-xs text-danger" role="alert">{errors.adminName.message}</p>
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
              checked={watch("terms")}
              onCheckedChange={(v) => setValue("terms", v === true, { shouldValidate: true })}
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
