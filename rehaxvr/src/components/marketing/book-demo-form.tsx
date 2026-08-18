"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid work email"),
  organization: z.string().min(2, "Please enter your organization name"),
  orgType: z.string().min(1, "Please select an organization type"),
  size: z.string().min(1, "Please select a size"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function BookDemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { orgType: "", size: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    void values;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-teal/30 bg-teal/5 p-8 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-teal/15 text-teal">
          <CheckCircle2 className="size-7" aria-hidden />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-ink">Demo request received</h2>
        <p className="mt-2 max-w-sm text-sm text-body">
          Thank you — our clinical team will reach out within one business day
          to schedule your live session.
        </p>
      </div>
    );
  }

  const err = (k: keyof FormValues) =>
    errors[k] ? (
      <p className="mt-1 text-xs text-danger" role="alert">
        {errors[k]?.message}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <CalendarCheck className="size-5 text-primary" aria-hidden />
        Request your demo
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="demo-name">Full name</Label>
          <Input
            id="demo-name"
            className="mt-1.5"
            placeholder="Dr. Jane Smith"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {err("name")}
        </div>
        <div>
          <Label htmlFor="demo-email">Work email</Label>
          <Input
            id="demo-email"
            type="email"
            className="mt-1.5"
            placeholder="jane@yourclinic.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {err("email")}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="demo-org">Organization name</Label>
        <Input
          id="demo-org"
          className="mt-1.5"
          placeholder="Riverside Rehabilitation Center"
          aria-invalid={!!errors.organization}
          {...register("organization")}
        />
        {err("organization")}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="demo-type">Organization type</Label>
          <Select
            value={watch("orgType")}
            onValueChange={(v) => setValue("orgType", v, { shouldValidate: true })}
          >
            <SelectTrigger id="demo-type" className="mt-1.5 w-full" aria-invalid={!!errors.orgType}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rehab-center">Rehabilitation center</SelectItem>
              <SelectItem value="pt-clinic">Physical therapy clinic</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="multi-location">Multi-location organization</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {err("orgType")}
        </div>
        <div>
          <Label htmlFor="demo-size">Therapy stations planned</Label>
          <Select
            value={watch("size")}
            onValueChange={(v) => setValue("size", v, { shouldValidate: true })}
          >
            <SelectTrigger id="demo-size" className="mt-1.5 w-full" aria-invalid={!!errors.size}>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1 – 2</SelectItem>
              <SelectItem value="3-5">3 – 5</SelectItem>
              <SelectItem value="6-15">6 – 15</SelectItem>
              <SelectItem value="16+">16+</SelectItem>
            </SelectContent>
          </Select>
          {err("size")}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="demo-message">
          What would you like to see?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="demo-message"
          className="mt-1.5 min-h-24"
          placeholder="e.g. shoulder rehabilitation programs, post-stroke upper limb work…"
          {...register("message")}
        />
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
        {isSubmitting ? "Sending request…" : "Request Demo"}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        No commitment. We respond within one business day.
      </p>
    </form>
  );
}
