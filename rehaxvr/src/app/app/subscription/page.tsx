"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useAppState } from "@/components/app-state";
import { useInvoices, useSubscription } from "@/hooks/use-data";
import {
  PageHeader,
  SectionHeader,
  TableSkeleton,
} from "@/components/shared/page-primitives";
import { PlanBadge, EntitlementBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { GAMES, gamesForPlan, getEntitlement } from "@/lib/data/games";
import { formatPrice, priceFor, yearlySavings } from "@/lib/data/pricing";
import {
  AlertTriangle,
  ArrowRightLeft,
  CalendarClock,
  Check,
  CreditCard,
  Crown,
  Download,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const { plan, cycle, setCycle, setPlan } = useAppState();
  const subscription = useSubscription();
  const invoices = useInvoices();

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [cycleOpen, setCycleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [downgradeOpen, setDowngradeOpen] = useState(false);
  const [paymentFailedOpen, setPaymentFailedOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const included = gamesForPlan(plan);
  const price = priceFor(plan, cycle);
  const otherCycle = cycle === "MONTHLY" ? "YEARLY" : "MONTHLY";
  const otherPrice = priceFor(plan, otherCycle);
  const savings = yearlySavings(plan);
  const renews = subscription.data
    ? format(parseISO(subscription.data.renewsAt), "d MMMM yyyy")
    : null;

  const confirmCycleChange = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setCycle(otherCycle);
    setBusy(false);
    setCycleOpen(false);
    toast.success("Billing cycle updated", {
      description: `Your subscription switches to ${otherCycle === "YEARLY" ? "yearly" : "monthly"} billing at the next renewal.`,
    });
  };

  const confirmCancel = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    setCancelOpen(false);
    toast("Cancellation scheduled", {
      description: `Your subscription remains active until ${renews}. You can resume any time before then.`,
    });
  };

  const confirmDowngrade = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setPlan("PRO");
    setBusy(false);
    setDowngradeOpen(false);
    toast("Downgrade scheduled", {
      description: `MAX games stay available until ${renews}, then your plan changes to PRO.`,
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subscription"
        description="Your plan, game entitlements and billing in one place."
      />

      {/* Current plan */}
      {subscription.isLoading ? (
        <Skeleton className="h-44 w-full rounded-2xl" />
      ) : (
        <Card className="gap-0 overflow-hidden p-0">
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg font-semibold text-ink">Current plan</h2>
                <PlanBadge plan={plan} size="md" />
                <span className="rounded-md bg-success/8 px-2 py-0.5 text-[11px] font-medium text-success">
                  Active
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan === "MAX"
                  ? "Complete rehabilitation game library"
                  : "Core rehabilitation game suite"}
              </p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Price
                  </dt>
                  <dd className="num mt-1 text-xl font-semibold text-ink">
                    {formatPrice(price)}
                    <span className="text-xs font-normal text-muted-foreground"> /mo</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Billing cycle
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ink">
                    {cycle === "YEARLY" ? "Yearly" : "Monthly"}
                    {cycle === "YEARLY" && savings != null && (
                      <span className="ml-1.5 text-xs font-semibold text-teal">
                        saving {savings}%
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Renews
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink">
                    <CalendarClock className="size-3.5 text-muted-foreground" aria-hidden />
                    {renews}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                {plan === "PRO" ? (
                  <Button onClick={() => setUpgradeOpen(true)}>
                    <Crown data-icon="inline-start" aria-hidden />
                    Upgrade to MAX
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setDowngradeOpen(true)}>
                    Downgrade to PRO
                  </Button>
                )}
                <Button variant="outline" onClick={() => setCycleOpen(true)}>
                  <ArrowRightLeft data-icon="inline-start" aria-hidden />
                  Switch to {otherCycle === "YEARLY" ? "yearly" : "monthly"}
                </Button>
                <Button
                  variant="ghost"
                  className="text-danger hover:bg-danger/8 hover:text-danger"
                  onClick={() => setCancelOpen(true)}
                >
                  Cancel subscription
                </Button>
              </div>
            </CardContent>

            <div className="border-t border-border bg-surface-muted/50 p-6 md:border-l md:border-t-0">
              <h3 className="text-sm font-semibold text-ink">
                Game entitlements ({included.length} of {GAMES.length})
              </h3>
              <ul className="mt-3 space-y-1.5">
                {GAMES.map((g) => {
                  const ent = getEntitlement(g, plan);
                  return (
                    <li key={g.id} className="flex items-center justify-between gap-2 text-[13px]">
                      <span
                        className={
                          ent === "INCLUDED" ? "text-body" : "text-muted-foreground"
                        }
                      >
                        {g.name}
                      </span>
                      {ent === "INCLUDED" ? (
                        <Check className="size-3.5 text-teal" aria-label="Included" />
                      ) : (
                        <button
                          onClick={() => setUpgradeOpen(true)}
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          MAX
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Payment method */}
      <section className="space-y-3">
        <SectionHeader title="Payment method" />
        <Card className="gap-0 p-0">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
                <CreditCard className="size-4.5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Visa ending in 4421</p>
                <p className="text-xs text-muted-foreground">Expires 09/2027</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Demo", { description: "Payment method management would open your billing portal." })
                }
              >
                Update card
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPaymentFailedOpen(true)}
              >
                Preview payment-failed state
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Invoices */}
      <section className="space-y-3">
        <SectionHeader title="Billing history" />
        {invoices.isLoading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow className="bg-surface-muted/60 hover:bg-surface-muted/60">
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12 text-right">
                    <span className="sr-only">Download</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invoices.data ?? []).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs text-body">{inv.number}</TableCell>
                    <TableCell className="text-sm text-body">
                      {format(parseISO(inv.date), "d MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <PlanBadge plan={inv.plan} />
                    </TableCell>
                    <TableCell className="num text-right text-sm font-medium text-ink">
                      {formatPrice(inv.amount, inv.currency)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 rounded-md border border-success/25 bg-success/8 px-1.5 py-0.5 text-[11px] font-medium text-success">
                        <Check className="size-3" aria-hidden />
                        Paid
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Download invoice ${inv.number}`}
                        onClick={() =>
                          toast.info("Demo", { description: "Invoice PDF download would start here." })
                        }
                      >
                        <Download />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* ---- Dialogs ---- */}
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />

      {/* Change billing cycle */}
      <Dialog open={cycleOpen} onOpenChange={setCycleOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Switch to {otherCycle === "YEARLY" ? "yearly" : "monthly"} billing?
            </DialogTitle>
            <DialogDescription>
              The change takes effect at your next renewal on {renews}. Your
              game entitlements are unaffected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-xl border border-border bg-surface-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current</span>
              <span className="num font-medium text-ink">
                {formatPrice(price)}/mo · {cycle === "YEARLY" ? "yearly" : "monthly"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">New</span>
              <span className="num font-medium text-ink">
                {formatPrice(otherPrice)}/mo · {otherCycle === "YEARLY" ? "yearly" : "monthly"}
                {otherCycle === "YEARLY" && savings != null && (
                  <span className="ml-1 text-xs font-semibold text-teal">−{savings}%</span>
                )}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCycleOpen(false)}>
              Keep {cycle === "YEARLY" ? "yearly" : "monthly"}
            </Button>
            <Button onClick={confirmCycleChange} disabled={busy}>
              {busy && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
              Confirm switch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downgrade */}
      <Dialog open={downgradeOpen} onOpenChange={setDowngradeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Downgrade to PRO?</DialogTitle>
            <DialogDescription>
              You&apos;ll keep MAX access until {renews}. After that, these games
              become &quot;Available with MAX&quot;:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-1.5 rounded-xl border border-border bg-surface-muted/50 p-4">
            {GAMES.filter((g) => !g.plans.includes("PRO")).map((g) => (
              <li key={g.id} className="flex items-center gap-2 text-sm text-body">
                <XCircle className="size-4 text-warning" aria-hidden />
                {g.name}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Patient history and telemetry from these games are always retained.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDowngradeOpen(false)}>
              Keep MAX
            </Button>
            <Button variant="destructive" onClick={confirmDowngrade} disabled={busy}>
              {busy && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
              Schedule downgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel your subscription?</DialogTitle>
            <DialogDescription>
              Here&apos;s exactly what happens if you cancel today:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2.5 text-sm text-body">
            <li className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
              Full access continues until <span className="font-medium text-ink">{renews}</span>.
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
              All patient records, sessions and telemetry are retained.
            </li>
            <li className="flex gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              After that date, game launches are disabled until you resubscribe.
            </li>
          </ul>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Keep my subscription
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={busy}>
              {busy && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
              Cancel at period end
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment failed */}
      <Dialog open={paymentFailedOpen} onOpenChange={setPaymentFailedOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="size-5" aria-hidden />
              Payment failed
            </DialogTitle>
            <DialogDescription>
              We couldn&apos;t charge your Visa ending in 4421 for this billing
              period. Your access is unaffected for now — we&apos;ll retry
              automatically in 3 days.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-danger/20 bg-danger/4 px-3.5 py-2.5 text-sm text-body">
            To avoid interruption, update your payment method or retry the
            charge now.
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPaymentFailedOpen(false)}>
              Remind me later
            </Button>
            <Button
              onClick={() => {
                setPaymentFailedOpen(false);
                toast.success("Payment successful", {
                  description: "Your card was charged and the invoice is settled.",
                });
              }}
            >
              Retry payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
