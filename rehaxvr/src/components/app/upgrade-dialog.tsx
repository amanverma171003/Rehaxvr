"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlanBadge } from "@/components/shared/badges";
import { BillingToggle } from "@/components/shared/pricing-cards";
import { useAppState } from "@/components/app-state";
import { GAMES } from "@/lib/data/games";
import { formatPrice, priceFor } from "@/lib/data/pricing";
import type { BillingCycle } from "@/lib/types";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function UpgradeDialog({
  open,
  onOpenChange,
  highlightGameId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightGameId?: string;
}) {
  const { plan, cycle, setPlan } = useAppState();
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(cycle);
  const [busy, setBusy] = useState(false);

  const maxOnly = GAMES.filter((g) => !g.plans.includes("PRO"));
  const price = priceFor("MAX", selectedCycle);
  const proPrice = priceFor("PRO", selectedCycle);

  const confirm = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1100));
    setPlan("MAX");
    setBusy(false);
    onOpenChange(false);
    toast.success("Welcome to MAX", {
      description: "All 9 rehabilitation games are now unlocked for your organization.",
    });
  };

  if (plan === "MAX") return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="size-5 text-primary" aria-hidden />
            Upgrade to MAX
          </DialogTitle>
          <DialogDescription>
            Unlock the complete rehabilitation game library for your
            organization — effective immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Games you&apos;ll unlock
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {maxOnly.map((g) => (
              <li
                key={g.id}
                className={`flex items-center gap-2 text-sm ${
                  g.id === highlightGameId ? "font-semibold text-primary-dark" : "text-body"
                }`}
              >
                <Check className="size-4 text-teal" aria-hidden />
                {g.name}
                <span className="text-xs text-muted-foreground">
                  · {g.targetJoint}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <BillingToggle cycle={selectedCycle} onChange={setSelectedCycle} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-accent/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <PlanBadge plan="MAX" />
            <span className="text-sm text-body">
              {selectedCycle === "YEARLY" ? "Yearly billing" : "Monthly billing"}
            </span>
          </div>
          <div className="text-right">
            <span className="num text-lg font-semibold text-ink">{formatPrice(price)}</span>
            <span className="text-xs text-muted-foreground"> /mo</span>
            <p className="text-[11px] text-muted-foreground">
              currently {formatPrice(proPrice)}/mo on PRO
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button onClick={confirm} disabled={busy}>
            {busy && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
            {busy ? "Upgrading…" : "Confirm upgrade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
