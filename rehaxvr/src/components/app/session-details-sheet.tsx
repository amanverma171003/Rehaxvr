"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SessionStatusBadge } from "@/components/shared/badges";
import { RomGauge } from "@/components/brand/rom-gauge";
import type { Session } from "@/lib/types";
import { format } from "date-fns";
import { AlertTriangle, ExternalLink } from "lucide-react";

export function SessionDetailsSheet({
  session,
  open,
  onOpenChange,
}: {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!session) return null;
  const s = session;
  const repPct = s.targetReps ? Math.min((s.reps / s.targetReps) * 100, 100) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2.5">
            {s.gameName}
            <SessionStatusBadge status={s.status} />
          </SheetTitle>
          <SheetDescription>
            {s.patientName} · {format(new Date(s.startedAt), "EEE d MMM yyyy, HH:mm")} ·{" "}
            {s.therapist}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          {s.status === "SCHEDULED" ? (
            <div className="rounded-xl border border-border bg-surface-muted/60 p-4 text-sm text-body">
              This session hasn&apos;t started yet. Target:{" "}
              <span className="num font-medium text-ink">{s.targetReps} reps</span>{" "}
              at up to <span className="num font-medium text-ink">{s.targetRom}°</span>.
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-white p-4">
                <RomGauge
                  value={s.peakRom}
                  target={s.targetRom}
                  max={Math.max(s.targetRom, 180)}
                  label="Peak range of motion"
                  light
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-ink">Repetitions</span>
                  <span className="num text-body">
                    {s.reps} / {s.targetReps}
                  </span>
                </div>
                <Progress value={repPct} className="mt-2" aria-label={`${s.reps} of ${s.targetReps} repetitions`} />
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {[
                  ["Duration", `${s.durationMin} min`],
                  ["Movement quality", `${s.quality}%`],
                  ["Smoothness", `${s.smoothness}%`],
                  ["Pain input", s.painLevel != null ? `${s.painLevel} / 10` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-surface-muted px-3 py-2.5">
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="num mt-0.5 text-base font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              {s.compensations.length > 0 ? (
                <div className="rounded-lg border border-warning/30 bg-warning/6 p-3.5">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-warning">
                    <AlertTriangle className="size-4" aria-hidden />
                    Compensation patterns detected
                  </p>
                  <ul className="mt-1.5 list-inside list-disc text-[13px] text-body">
                    {s.compensations.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                s.status === "COMPLETED" && (
                  <p className="rounded-lg border border-teal/25 bg-teal/6 px-3.5 py-2.5 text-sm text-[#0d7a6c]">
                    No compensation patterns detected this session.
                  </p>
                )
              )}
            </>
          )}
        </div>

        <SheetFooter>
          <Button asChild>
            <Link href={`/app/patients/${s.patientId}`}>
              View patient profile
              <ExternalLink data-icon="inline-end" aria-hidden />
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
