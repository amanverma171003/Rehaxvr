import type { BillingCycle, Plan } from "@/lib/types";

/**
 * Pricing configuration — in production this comes from the billing backend.
 * Values here are demo configuration, clearly isolated from the UI.
 * The yearly saving label is computed from configured prices, never invented.
 */
export interface PlanConfig {
  plan: Plan;
  title: string;
  positioning: string;
  monthly: number; // per clinic / month, in USD (demo config)
  yearly: number; // per clinic / month billed annually (demo config)
  currency: string;
  gameCount: number;
  features: string[];
  highlight?: boolean;
}

export const PRICING: Record<Plan, PlanConfig> = {
  PRO: {
    plan: "PRO",
    title: "PRO",
    positioning: "Core rehabilitation game suite",
    monthly: 249,
    yearly: 199,
    currency: "USD",
    gameCount: 5,
    features: [
      "5 core rehabilitation games",
      "Elbow, knee, shoulder, hip & neck modules",
      "Real-time ROM & repetition telemetry",
      "Patient & session management",
      "Core progress analytics",
      "Unlimited team members",
      "Email support",
    ],
  },
  MAX: {
    plan: "MAX",
    title: "MAX",
    positioning: "Complete rehabilitation game library",
    monthly: 399,
    yearly: 319,
    currency: "USD",
    gameCount: 9,
    features: [
      "All 9 rehabilitation games",
      "Everything in PRO",
      "Cervical rotation & lateral flexion modules",
      "Coordination & bilateral reach modules",
      "Advanced analytics & adherence insights",
      "Priority onboarding & support",
      "Early access to new game modules",
    ],
    highlight: true,
  },
};

export function priceFor(plan: Plan, cycle: BillingCycle): number {
  const cfg = PRICING[plan];
  return cycle === "YEARLY" ? cfg.yearly : cfg.monthly;
}

/** Percentage saved when billing yearly — computed, never fabricated. */
export function yearlySavings(plan: Plan): number | null {
  const cfg = PRICING[plan];
  if (cfg.yearly >= cfg.monthly) return null;
  return Math.round((1 - cfg.yearly / cfg.monthly) * 100);
}

export function formatPrice(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
