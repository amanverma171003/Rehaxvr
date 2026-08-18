"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { usePatient, usePatientSessions } from "@/hooks/use-data";
import {
  EmptyState,
  ErrorState,
  MetricCard,
  SectionHeader,
} from "@/components/shared/page-primitives";
import {
  PatientStatusBadge,
  SessionStatusBadge,
} from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { RomGauge } from "@/components/brand/rom-gauge";
import { PatientSheet } from "@/components/app/patient-sheet";
import { StartSessionDialog } from "@/components/app/start-session-dialog";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { SessionDetailsSheet } from "@/components/app/session-details-sheet";
import { getGame } from "@/lib/data/games";
import type { Session } from "@/lib/types";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  Pencil,
  Radio,
  Repeat,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const patient = usePatient(id);
  const sessions = usePatientSessions(id);
  const [editOpen, setEditOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [detail, setDetail] = useState<Session | null>(null);

  const p = patient.data;
  const game = p ? getGame(p.primaryGameId) : undefined;

  const romSeries = useMemo(() => {
    if (!p) return [];
    const done = (sessions.data ?? [])
      .filter((s) => s.status === "COMPLETED")
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    const base = [{ label: "Baseline", rom: p.romBaseline }];
    return base.concat(
      done.map((s) => ({
        label: format(parseISO(s.startedAt), "d MMM"),
        rom: s.peakRom,
      }))
    );
  }, [p, sessions.data]);

  if (patient.isLoading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (patient.isError || !p) {
    return (
      <ErrorState
        title="We couldn't find that patient"
        description="The profile may have been archived, or the link is out of date."
        onRetry={() => patient.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link href="/app/patients">
          <ArrowLeft data-icon="inline-start" aria-hidden />
          All patients
        </Link>
      </Button>

      {/* Overview header */}
      <Card className="gap-0 p-0">
        <CardContent className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary text-lg font-semibold text-white">
                {p.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-ink">{p.name}</h1>
                <PatientStatusBadge status={p.status} />
              </div>
              <p className="mt-0.5 text-sm text-body">
                {p.age} yrs · {p.condition}
              </p>
              <p className="text-xs text-muted-foreground">
                {p.program} · with {p.therapist} since{" "}
                {format(parseISO(p.startedAt), "d MMM yyyy")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil data-icon="inline-start" aria-hidden />
              Edit
            </Button>
            <Button onClick={() => setStartOpen(true)} disabled={p.status !== "ACTIVE"}>
              <Radio data-icon="inline-start" aria-hidden />
              Start Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Sessions"
          value={p.totalSessions}
          hint={
            p.nextSession
              ? `Next: ${format(parseISO(p.nextSession), "EEE d MMM, HH:mm")}`
              : "No session scheduled"
          }
          icon={CalendarClock}
        />
        <MetricCard
          label="Adherence"
          value={`${p.adherence}%`}
          hint="Attended vs planned sessions"
          icon={Repeat}
        />
        <MetricCard
          label="Current ROM"
          value={`${p.romCurrent}°`}
          hint={`from ${p.romBaseline}° baseline`}
          icon={Activity}
          trend={{ value: `+${p.romCurrent - p.romBaseline}°` }}
        />
        <MetricCard
          label="Primary game"
          value={<span className="text-lg">{game?.name ?? "—"}</span>}
          hint={game ? `${game.targetJoint} · ${game.movement}` : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ROM trend */}
        <section className="space-y-3">
          <SectionHeader
            title="ROM trend"
            description="Peak range of motion per completed session"
          />
          <Card className="gap-0 p-0">
            <CardContent className="p-4">
              {romSeries.length < 2 ? (
                <EmptyState
                  title="Complete a few sessions to start seeing progress."
                  description="The ROM trend appears after the first completed sessions."
                  className="border-0 bg-transparent py-10"
                />
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={romSeries} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <defs>
                        <linearGradient id="romFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0E7490" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#0E7490" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#627D98" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#627D98" }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, Math.max(p.romTarget + 10, p.romCurrent + 10)]}
                        unit="°"
                      />
                      <ChartTooltip
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid #D9E2EC",
                          fontSize: 12,
                        }}
                        formatter={(v) => [`${v}°`, "Peak ROM"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="rom"
                        stroke="#0E7490"
                        strokeWidth={2}
                        fill="url(#romFill)"
                        dot={{ r: 3, fill: "#0E7490" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Target: <span className="num font-medium text-ink">{p.romTarget}°</span>
              </p>
            </CardContent>
          </Card>

          {/* Session history */}
          <SectionHeader title="Session history" className="pt-3" />
          {sessions.isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (sessions.data ?? []).length === 0 ? (
            <EmptyState
              icon={Radio}
              title="No therapy sessions yet."
              description={`Start ${p.name.split(" ")[0]}'s first session to begin building their progress record.`}
              action={
                <Button onClick={() => setStartOpen(true)}>Start Session</Button>
              }
            />
          ) : (
            <Card className="gap-0 overflow-hidden p-0">
              <ul className="divide-y divide-border">
                {[...(sessions.data ?? [])]
                  .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
                  .map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => setDetail(s)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted/60 focus-visible:bg-surface-muted/60 focus-visible:outline-none"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink">{s.gameName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(s.startedAt), "EEE d MMM, HH:mm")}
                            {s.durationMin > 0 && ` · ${s.durationMin} min`}
                            {s.reps > 0 && ` · ${s.reps}/${s.targetReps} reps`}
                            {s.peakRom > 0 && ` · peak ${s.peakRom}°`}
                          </p>
                        </div>
                        <SessionStatusBadge status={s.status} />
                      </button>
                    </li>
                  ))}
              </ul>
            </Card>
          )}
        </section>

        {/* Right rail */}
        <div className="space-y-6">
          <section className="space-y-3">
            <SectionHeader title="Progress to target" />
            <Card className="gap-0 p-0">
              <CardContent className="p-4">
                <RomGauge
                  value={p.romCurrent}
                  target={p.romTarget}
                  max={Math.max(p.romTarget + 20, 60)}
                  label={game ? game.movement : "Range of motion"}
                  light
                />
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Baseline {p.romBaseline}°</span>
                    <span>Target {p.romTarget}°</span>
                  </div>
                  <Progress value={p.romProgress} className="mt-1.5" aria-label={`${p.romProgress}% toward ROM target`} />
                  <p className="mt-2 text-center text-sm text-body">
                    <span className="num font-semibold text-ink">{p.romProgress}%</span>{" "}
                    of the way to target
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <SectionHeader title="Clinical notes" />
            <Card className="gap-0 p-0">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed text-body">{p.notes}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Last updated by {p.therapist}
                </p>
              </CardContent>
            </Card>
          </section>

          {game && (
            <section className="space-y-3">
              <SectionHeader title="Primary module" />
              <Link
                href={`/app/games/${game.slug}`}
                className="block rounded-xl border border-border bg-white p-4 card-hover"
              >
                <p className="text-sm font-semibold text-ink">{game.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {game.targetJoint} · {game.movement} · {game.targetAngle}
                </p>
                <p className="mt-2 text-[13px] text-body">{game.objective}</p>
              </Link>
            </section>
          )}
        </div>
      </div>

      <PatientSheet open={editOpen} onOpenChange={setEditOpen} patient={p} />
      <StartSessionDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        defaultPatientId={p.id}
        defaultGameId={p.primaryGameId}
        onUpgrade={() => setUpgradeOpen(true)}
      />
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <SessionDetailsSheet
        session={detail}
        open={!!detail}
        onOpenChange={(o) => !o && setDetail(null)}
      />
    </div>
  );
}
