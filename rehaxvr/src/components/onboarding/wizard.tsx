"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BillingToggle, PricingCard } from "@/components/shared/pricing-cards";
import { PlanBadge } from "@/components/shared/badges";
import { PRICING, formatPrice, priceFor, yearlySavings } from "@/lib/data/pricing";
import { gamesForPlan, GAMES } from "@/lib/data/games";
import type { BillingCycle, Plan, Role } from "@/lib/types";
import { cn } from "@/lib/utils";
// Server actions — every "Next" button funnels through one of these so the
// wizard state is authoritatively persisted before the user can move on.
import {
  saveOrganizationStep,
  saveProfileStep,
  savePlanStep,
  confirmDemoPayment,
  sendInvites,
  completeOnboarding,
  getOnboardingState,
  type InviteResult,
} from "@/lib/onboarding/actions";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  Plus,
  Rocket,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Organization", icon: Building2 },
  { id: 2, label: "Profile", icon: UserRound },
  { id: 3, label: "Plan", icon: Check },
  { id: 4, label: "Billing", icon: CreditCard },
  { id: 5, label: "Team", icon: Users },
  { id: 6, label: "Complete", icon: Rocket },
] as const;

interface Invite {
  email: string;
  role: Role;
}

export function OnboardingWizard() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [stations, setStations] = useState("");
  const [useCase, setUseCase] = useState("");
  const [adminName, setAdminName] = useState("");
  const [plan, setPlan] = useState<Plan>(
    params.get("plan") === "MAX" ? "MAX" : "PRO"
  );
  const [cycle, setCycle] = useState<BillingCycle>(
    params.get("cycle") === "YEARLY" ? "YEARLY" : "MONTHLY"
  );
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("THERAPIST");
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Server-action wiring: submitting shows a spinner + disables the button.
  // stepError is rendered under the footer nav so users see backend failures inline.
  // inviteResults surfaces per-invite success (email sent / failed) after step 5.
  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [inviteResults, setInviteResults] = useState<InviteResult[] | null>(null);

  // On mount: seed from sessionStorage (for signup handoff) THEN reconcile with
  // the server's canonical onboarding state so refreshes/re-opens jump to the
  // right step instead of restarting from step 1.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("rehaxvr-onboarding");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.organization) setOrgName(p.organization);
        if (p.adminName) setAdminName(p.adminName);
      }
    } catch { /* ignore */ }

    let cancelled = false;
    (async () => {
      const res = await getOnboardingState();
      if (cancelled || !res.ok) return;
      const s = res.data;
      // Hydrate any fields the server already knows about.
      if (s.organization) {
        setOrgName(s.organization.name);
        setOrgType(s.organization.org_type);
      }
      if (s.profile.fullName) setAdminName(s.profile.fullName);
      if (s.subscription) {
        setPlan(s.subscription.plan_code as Plan);
        setCycle(s.subscription.interval);
        if (s.subscription.status === "ACTIVE") setPaid(true);
      }
      // Jump to the first incomplete step. Order enforces strict dependency:
      // organization is the hard gate for Step 1 because handle_new_user pre-fills
      // profiles.full_name from signup metadata — so "fullName is truthy" alone
      // is NOT proof that Step 2 was completed. Organization existence is.
      if (s.onboardedAt) { setStep(6); return; }
      if (!s.organization) { setStep(1); return; }
      if (s.subscription?.status === "ACTIVE") { setStep(5); return; }
      if (s.subscription) { setStep(4); return; }
      if (s.profile.fullName) { setStep(3); return; }
      setStep(2);
    })();
    return () => { cancelled = true; };
  }, []);

  const price = priceFor(plan, cycle);
  const savings = yearlySavings(plan);
  const included = useMemo(() => gamesForPlan(plan), [plan]);

  const canContinue = useMemo(() => {
    if (step === 1) return orgName.trim().length >= 2 && orgType !== "";
    if (step === 2) return adminName.trim().length >= 2 && useCase !== "";
    if (step === 3) return true;
    if (step === 4) return paid;
    return true;
  }, [step, orgName, orgType, adminName, useCase, paid]);

  const addInvite = () => {
    setInviteError(null);
    const email = inviteEmail.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setInviteError("Please enter a valid email address");
      return;
    }
    if (invites.some((i) => i.email === email)) {
      setInviteError("That email is already on the list");
      return;
    }
    setInvites((prev) => [...prev, { email, role: inviteRole }]);
    setInviteEmail("");
  };

  // Demo checkout — no real payment is processed. The short delay keeps the
  // UX feel of a real payment; the server call flips the subscription to ACTIVE.
  const simulatePayment = async () => {
    setStepError(null);
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1000));
    const res = await confirmDemoPayment();
    setPaying(false);
    if (!res.ok) {
      setStepError(res.error);
      return;
    }
    setPaid(true);
  };

  // Central "Next" handler — calls the right server action per step, and only
  // advances the wizard on ok:true. Errors render inline; the DB is always
  // authoritative because we persist before advancing.
  const handleContinue = async () => {
    setStepError(null);
    setSubmitting(true);
    try {
      if (step === 1) {
        const res = await saveOrganizationStep({
          orgName,
          orgType: orgType as "rehab" | "clinic" | "hospital" | "multi",
          // stations is optional in the UI — pass the value if picked, else omit.
          stations: (stations || undefined) as "1-2" | "3-5" | "6-15" | "16+" | undefined,
        });
        if (!res.ok) return setStepError(res.error);
      } else if (step === 2) {
        const res = await saveProfileStep({
          adminName,
          useCase: useCase as "ortho" | "neuro" | "geriatric" | "mixed",
        });
        if (!res.ok) return setStepError(res.error);
      } else if (step === 3) {
        const res = await savePlanStep({ plan, cycle });
        if (!res.ok) return setStepError(res.error);
      } else if (step === 5) {
        // Sending invites is the "Finish setup" click — allow proceeding even
        // on partial send failure; the row is PENDING and retryable.
        if (invites.length > 0) {
          const res = await sendInvites({ invites });
          if (!res.ok) return setStepError(res.error);
          setInviteResults(res.data.results);
        }
      }
      setStep((s) => Math.min(6, s + 1));
    } finally {
      setSubmitting(false);
    }
  };

  // "Skip for now" on step 5 — no invites sent, still advances.
  const handleSkipInvites = () => {
    setInviteResults(null);
    setStep(6);
  };

  // "Enter your dashboard" on step 6 — server verifies all prerequisites and
  // only then flips profiles.onboarded_at. If it refuses, we surface the reason.
  const handleEnterApp = async () => {
    setStepError(null);
    setSubmitting(true);
    const res = await completeOnboarding();
    setSubmitting(false);
    if (!res.ok) {
      setStepError(res.error);
      return;
    }
    router.push("/app");
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <nav aria-label="Onboarding progress">
        <ol className="flex items-center gap-1 sm:gap-2">
          {STEPS.map((s, i) => {
            const state =
              s.id < step ? "done" : s.id === step ? "current" : "todo";
            return (
              <li key={s.id} className="flex flex-1 items-center gap-1 sm:gap-2 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                  <span
                    aria-current={state === "current" ? "step" : undefined}
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors",
                      state === "done" && "border-teal bg-teal text-white",
                      state === "current" && "border-primary bg-primary text-white",
                      state === "todo" && "border-border bg-white text-muted-foreground"
                    )}
                  >
                    {state === "done" ? <Check className="size-3.5" aria-hidden /> : `0${s.id}`}
                  </span>
                  <span
                    className={cn(
                      "hidden text-xs font-medium md:block",
                      state === "current" ? "text-ink" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1",
                      s.id < step ? "bg-teal" : "bg-border"
                    )}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === 1 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
                <h1 className="text-xl font-semibold text-ink">
                  Tell us about your organization
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  This becomes your workspace — you can change it later in Settings.
                </p>
                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="ob-org">Organization name</Label>
                    <Input
                      id="ob-org"
                      className="mt-1.5"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Riverside Rehabilitation Center"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="ob-type">Organization type</Label>
                      <Select value={orgType} onValueChange={setOrgType}>
                        <SelectTrigger id="ob-type" className="mt-1.5 w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rehab">Rehabilitation center</SelectItem>
                          <SelectItem value="clinic">Physical therapy clinic</SelectItem>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="multi">Multi-location organization</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ob-stations">Therapy stations (planned)</Label>
                      <Select value={stations} onValueChange={setStations}>
                        <SelectTrigger id="ob-stations" className="mt-1.5 w-full">
                          <SelectValue placeholder="Optional" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1 – 2</SelectItem>
                          <SelectItem value="3-5">3 – 5</SelectItem>
                          <SelectItem value="6-15">6 – 15</SelectItem>
                          <SelectItem value="16+">16+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
                <h1 className="text-xl font-semibold text-ink">Confirm your profile</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  You&apos;ll be the Organization Admin for {orgName || "your organization"}.
                </p>
                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="ob-name">Your name</Label>
                    <Input
                      id="ob-name"
                      className="mt-1.5"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                  <div>
                    <Label>Primary use case</Label>
                    <RadioGroup
                      value={useCase}
                      onValueChange={setUseCase}
                      className="mt-2 grid gap-2 sm:grid-cols-2"
                    >
                      {[
                        ["ortho", "Orthopedic rehabilitation"],
                        ["neuro", "Neurological rehabilitation"],
                        ["geriatric", "Geriatric therapy"],
                        ["mixed", "Mixed / general practice"],
                      ].map(([value, label]) => (
                        <Label
                          key={value}
                          htmlFor={`uc-${value}`}
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm font-normal transition-colors",
                            useCase === value
                              ? "border-primary bg-accent"
                              : "border-border hover:border-border-strong"
                          )}
                        >
                          <RadioGroupItem value={value} id={`uc-${value}`} />
                          {label}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <div className="text-center">
                  <h1 className="text-xl font-semibold text-ink">Choose your plan</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You can upgrade or change billing at any time.
                  </p>
                  <div className="mt-5 flex justify-center">
                    <BillingToggle cycle={cycle} onChange={setCycle} />
                  </div>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <PricingCard
                    config={PRICING.PRO}
                    cycle={cycle}
                    ctaLabel="Choose"
                    selected={plan === "PRO"}
                    onSelect={() => setPlan("PRO")}
                  />
                  <PricingCard
                    config={PRICING.MAX}
                    cycle={cycle}
                    ctaLabel="Choose"
                    selected={plan === "MAX"}
                    onSelect={() => setPlan("MAX")}
                  />
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
                  <h1 className="text-xl font-semibold text-ink">Review your subscription</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Confirm the details before activating your plan.
                  </p>
                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <dt className="text-muted-foreground">Organization</dt>
                      <dd className="font-medium text-ink">{orgName || "—"}</dd>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd><PlanBadge plan={plan} size="md" /></dd>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <dt className="text-muted-foreground">Billing cycle</dt>
                      <dd className="font-medium text-ink">
                        {cycle === "YEARLY" ? "Yearly" : "Monthly"}
                        {cycle === "YEARLY" && savings != null && (
                          <span className="ml-1.5 text-xs font-semibold text-teal">
                            saves {savings}%
                          </span>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <dt className="text-muted-foreground">Games included</dt>
                      <dd className="font-medium text-ink num">
                        {included.length} of {GAMES.length}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Price</dt>
                      <dd className="num text-lg font-semibold text-ink">
                        {formatPrice(price)}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          / clinic / month{cycle === "YEARLY" ? ", billed annually" : ""}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  {!paid ? (
                    <Button
                      size="lg"
                      className="mt-7 w-full"
                      onClick={simulatePayment}
                      disabled={paying}
                    >
                      {paying && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                      {paying ? "Processing payment…" : `Activate ${plan} subscription`}
                    </Button>
                  ) : (
                    <div
                      className="mt-7 flex items-center gap-2 rounded-lg border border-teal/30 bg-teal/6 px-4 py-3 text-sm font-medium text-[#0d7a6c]"
                      role="status"
                    >
                      <CheckCircle2 className="size-4.5" aria-hidden />
                      Subscription active. Welcome to RehaxVR {plan}.
                    </div>
                  )}
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Demo checkout — no real payment is processed.
                  </p>
                </div>

                <aside className="rounded-2xl border border-border bg-surface-muted/60 p-5">
                  <h2 className="text-sm font-semibold text-ink">
                    Included games ({included.length})
                  </h2>
                  <ul className="mt-3 space-y-1.5">
                    {GAMES.map((g) => {
                      const inPlan = included.some((x) => x.id === g.id);
                      return (
                        <li
                          key={g.id}
                          className={cn(
                            "flex items-center gap-2 text-[13px]",
                            inPlan ? "text-body" : "text-muted-foreground/60 line-through"
                          )}
                        >
                          <Check
                            className={cn("size-3.5", inPlan ? "text-teal" : "text-border-strong")}
                            aria-hidden
                          />
                          {g.name}
                        </li>
                      );
                    })}
                  </ul>
                  {plan === "PRO" && (
                    <p className="mt-4 rounded-lg border border-primary/20 bg-accent px-3 py-2 text-xs text-primary-dark">
                      The remaining {GAMES.length - included.length} games unlock
                      instantly with an upgrade to MAX — any time, from the app.
                    </p>
                  )}
                </aside>
              </section>
            )}

            {step === 5 && (
              <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
                <h1 className="text-xl font-semibold text-ink">Invite your team</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add therapists and staff now, or skip and invite them later
                  from the Team page.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1">
                    <Label htmlFor="ob-invite" className="sr-only">Email address</Label>
                    <Input
                      id="ob-invite"
                      type="email"
                      placeholder="colleague@yourclinic.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInvite())}
                      aria-invalid={!!inviteError}
                    />
                  </div>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                    <SelectTrigger className="w-full sm:w-44" aria-label="Role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="THERAPIST">Therapist</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="ADMIN">Organization Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addInvite}>
                    <Plus data-icon="inline-start" aria-hidden />
                    Add
                  </Button>
                </div>
                {inviteError && (
                  <p className="mt-1.5 text-xs text-danger" role="alert">{inviteError}</p>
                )}

                {invites.length > 0 ? (
                  <ul className="mt-5 divide-y divide-border rounded-lg border border-border">
                    {invites.map((inv) => (
                      <li key={inv.email} className="flex items-center justify-between px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Mail className="size-4 text-muted-foreground" aria-hidden />
                          <span className="text-sm text-ink">{inv.email}</span>
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-body">
                            {inv.role === "ADMIN" ? "Admin" : inv.role === "THERAPIST" ? "Therapist" : "Staff"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${inv.email}`}
                          onClick={() => setInvites((p) => p.filter((x) => x.email !== inv.email))}
                        >
                          <Trash2 className="text-muted-foreground" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-5 rounded-lg border border-dashed border-border-strong/60 px-4 py-6 text-center text-sm text-muted-foreground">
                    No invitations yet — you can always do this later.
                  </div>
                )}
              </section>
            )}

            {step === 6 && (
              <section className="rounded-2xl border border-border bg-white p-8 text-center sm:p-12">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
                  className="mx-auto grid size-16 place-items-center rounded-full bg-teal/12 text-teal"
                >
                  <CheckCircle2 className="size-8" aria-hidden />
                </motion.div>
                <h1 className="mt-6 text-2xl font-semibold text-ink">
                  {orgName || "Your organization"} is ready
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm text-body">
                  Your {plan} subscription is active with {included.length} games,
                  {invites.length > 0
                    ? ` ${invites.length} team invitation${invites.length > 1 ? "s" : ""} on the way,`
                    : ""}{" "}
                  and your patient workspace waiting.
                </p>
                <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3">
                  {[
                    [String(included.length), "games unlocked"],
                    [plan, "plan active"],
                    [cycle === "YEARLY" ? "Yearly" : "Monthly", "billing"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-lg bg-surface-muted px-3 py-2.5">
                      <div className="text-sm font-semibold text-ink">{v}</div>
                      <div className="text-[11px] text-muted-foreground">{l}</div>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="mt-8 px-6"
                  onClick={handleEnterApp}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                  Enter your dashboard
                  <ArrowRight data-icon="inline-end" aria-hidden />
                </Button>
                {stepError && (
                  <p className="mt-3 text-sm text-danger" role="alert">{stepError}</p>
                )}
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {step < 6 && (
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || submitting}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden />
              Back
            </Button>
            <div className="flex items-center gap-3">
              {step === 5 && (
                <Button variant="ghost" onClick={handleSkipInvites} disabled={submitting}>
                  Skip for now
                </Button>
              )}
              <Button
                onClick={handleContinue}
                disabled={!canContinue || submitting}
              >
                {submitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                {step === 5 ? "Finish setup" : "Continue"}
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Button>
            </div>
          </div>
          {stepError && (
            <p className="text-right text-sm text-danger" role="alert">{stepError}</p>
          )}
          {/* Per-invite result surface — only shown after a send returned mixed results. */}
          {step === 6 && inviteResults && inviteResults.some((r) => !r.emailSent) && (
            <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-900">
              Some invitation emails could not be delivered right now — the
              invitations are saved and can be resent from the Team page:
              <ul className="mt-1 list-disc pl-4">
                {inviteResults.filter((r) => !r.emailSent).map((r) => (
                  <li key={r.email}>{r.email}{r.error ? ` — ${r.error}` : ""}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
