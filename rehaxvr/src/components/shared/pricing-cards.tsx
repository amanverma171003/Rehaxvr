"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlanBadge } from "@/components/shared/badges";
import { PRICING, formatPrice, priceFor, yearlySavings, type PlanConfig } from "@/lib/data/pricing";
import { GAMES, gamesForPlan } from "@/lib/data/games";
import type { BillingCycle, Plan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Crown } from "lucide-react";
import { motion } from "framer-motion";

/* ------------------------------- BillingToggle ------------------------------- */

export function BillingToggle({
  cycle,
  onChange,
  className,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
  className?: string;
}) {
  const savings = yearlySavings("MAX");
  return (
    <div
      role="radiogroup"
      aria-label="Billing cycle"
      className={cn(
        "relative inline-flex items-center rounded-full border border-border bg-white p-1",
        className
      )}
    >
      {(["MONTHLY", "YEARLY"] as const).map((c) => (
        <button
          key={c}
          role="radio"
          aria-checked={cycle === c}
          onClick={() => onChange(c)}
          className={cn(
            "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
            cycle === c ? "text-white" : "text-body hover:text-ink"
          )}
        >
          {cycle === c && (
            <motion.span
              layoutId="billing-pill"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
            />
          )}
          <span className="relative">
            {c === "MONTHLY" ? "Monthly" : "Yearly"}
            {c === "YEARLY" && savings != null && (
              <span
                className={cn(
                  "ml-1.5 text-[11px] font-semibold",
                  cycle === "YEARLY" ? "text-cyan" : "text-teal"
                )}
              >
                save up to {savings}%
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/* -------------------------------- PricingCard -------------------------------- */

export function PricingCard({
  config,
  cycle,
  ctaLabel = "Start with",
  onSelect,
  selected,
  className,
}: {
  config: PlanConfig;
  cycle: BillingCycle;
  ctaLabel?: string;
  onSelect?: () => void;
  selected?: boolean;
  className?: string;
}) {
  const price = priceFor(config.plan, cycle);
  const included = gamesForPlan(config.plan);
  const isMax = config.plan === "MAX";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 sm:p-7 transition-shadow",
        isMax
          ? "border-primary/40 shadow-[0_12px_48px_-16px_rgba(14,116,144,0.35)]"
          : "border-border shadow-sm",
        selected && "ring-2 ring-primary ring-offset-2",
        className
      )}
    >
      {isMax && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary-dark px-3 py-1 text-[11px] font-semibold text-white shadow">
          <Crown className="size-3" aria-hidden />
          Complete library
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">{config.title}</h3>
        <PlanBadge plan={config.plan} />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{config.positioning}</p>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="num text-4xl font-semibold tracking-tight text-ink">
          {formatPrice(price, config.currency)}
        </span>
        <span className="text-sm text-muted-foreground">/ clinic / month</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {cycle === "YEARLY"
          ? "Billed annually"
          : "Billed monthly · cancel anytime"}
      </p>

      <div className="mt-5 rounded-lg bg-surface-muted px-3 py-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">
            {config.gameCount} of {GAMES.length} rehabilitation games
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {GAMES.map((g) => {
            const inPlan = included.some((x) => x.id === g.id);
            return (
              <span
                key={g.id}
                title={g.name}
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10.5px] font-medium",
                  inPlan
                    ? "bg-teal/12 text-[#0d7a6c]"
                    : "bg-border/40 text-muted-foreground line-through decoration-border-strong"
                )}
              >
                {g.name}
              </span>
            );
          })}
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {config.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-body">
            <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <Button
          className={cn("w-full", !isMax && "bg-white")}
          size="lg"
          variant={isMax ? "default" : "outline"}
          onClick={onSelect}
        >
          {ctaLabel} {config.title}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------- PricingSection ------------------------------ */

export function PricingSection({
  onSelect,
  ctaLabel,
  defaultCycle = "MONTHLY",
}: {
  onSelect?: (plan: Plan, cycle: BillingCycle) => void;
  ctaLabel?: string;
  defaultCycle?: BillingCycle;
}) {
  const [cycle, setCycle] = useState<BillingCycle>(defaultCycle);
  return (
    <div>
      <div className="flex justify-center">
        <BillingToggle cycle={cycle} onChange={setCycle} />
      </div>
      <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
        <PricingCard
          config={PRICING.PRO}
          cycle={cycle}
          ctaLabel={ctaLabel}
          onSelect={() => onSelect?.("PRO", cycle)}
        />
        <PricingCard
          config={PRICING.MAX}
          cycle={cycle}
          ctaLabel={ctaLabel}
          onSelect={() => onSelect?.("MAX", cycle)}
        />
      </div>
    </div>
  );
}
