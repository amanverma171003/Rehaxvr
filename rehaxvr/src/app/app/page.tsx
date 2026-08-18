"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format, isToday, parseISO } from "date-fns";
import { useAppState } from "@/components/app-state";
import { usePatients, useSessions, useSubscription } from "@/hooks/use-data";
import {
  MetricCard,
  MetricRowSkeleton,
  SectionHeader,
  TableSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/shared/page-primitives";
import {
  PlanBadge,
  SessionStatusBadge,
} from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StartSessionDialog } from "@/components/app/start-session-dialog";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { SessionDetailsSheet } from "@/components/app/session-details-sheet";
import { PatientSheet } from "@/components/app/patient-sheet";
import { GAME_UTILIZATION } from "@/lib/data/mock";
import { gamesForPlan, GAMES } from "@/lib/data/games";
import type { Session } from "@/lib/types";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  Gamepad2,
  Plus,
  Radio,
  UserRound,
  UsersRound,
} from "lucide-react";

export default function DashboardPage() {
  const { plan, cycle, orgName, userName } = useAppState();
  const patients = usePatients();
  const sessions = useSessions();
  const subscription = useSubscription();

  const [startOpen, setStartOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [detail, setDetail] = useState<Session | null>(null);

  const firstName = userName.replace("Dr. ", "").split(" ")[0];
  const included = gamesForPlan(plan);

  const stats = useMemo(() => {
    const p = patients.data ?? [];
    const s = sessions.data ?? [];
    const today = s.filter((x) => isToday(parseISO(x.startedAt)));
    return {
      activePatients: p.filter((x) => x.status === "ACTIVE").length,
      sessionsToday: today.length,
      inProgress: s.filter((x) => x.status === "IN_PROGRESS").length,
      avgAdherence: p.length
        ? Math.round(p.reduce((a, x) => a + x.adherence, 0) / p.length)
        : 0,
    };
  }, [patients.data, sessions.data]);

  const recentSessions = useMemo(() => {
    return [...(sessions.data ?? [])]
      .filter((s) => s.status !== "SCHEDULED")
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, 5);
  }, [sessions.data]);

  const upcoming = useMemo(() => {
    return (sessions.data ?? [])
      .filter((s) => s.status === "SCHEDULED")
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
      .slice(0, 3);
  }, [sessions.data]);

  const maxUtil = Math.max(...GAME_UTILIZATION.map((g) => g.sessions));

  return (
    <div className="space-y-8">
      {/* Greeting + quick actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            Good morning, {firstName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-body">
            <span>{orgName}</span>
            <span aria-hidden>·</span>
            <PlanBadge plan={plan} />
            <span className="text-muted-foreground">
              {cycle === "YEARLY" ? "Yearly" : "Monthly"} billing
              {subscription.data &&
                ` · renews ${format(parseISO(subscription.data.renewsAt), "d MMM")}`}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setAddPatientOpen(true)}>
            <Plus data-icon="inline-start" aria-hidden />
            Add Patient
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/games">
              <Gamepad2 data-icon="inline-start" aria-hidden />
              View Games
            </Link>
          </Button>
          <Button onClick={() => setStartOpen(true)}>
            <Radio data-icon="inline-start" aria-hidden />
            Start Session
          </Button>
        </div>
      </div>

      {/* Metrics */}
      {patients.isLoading || sessions.isLoading ? (
        <MetricRowSkeleton />
      ) : patients.isError || sessions.isError ? (
        <ErrorState
          description="We couldn't load your organization overview. Please try again."
          onRetry={() => {
            patients.refetch();
            sessions.refetch();
          }}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Active patients"
            value={stats.activePatients}
            hint={`${patients.data?.length ?? 0} total in workspace`}
            icon={UserRound}
          />
          <MetricCard
            label="Sessions today"
            value={stats.sessionsToday}
            hint={
              stats.inProgress > 0
                ? `${stats.inProgress} in progress right now`
                : "None currently running"
            }
            icon={Radio}
          />
          <MetricCard
            label="Games in plan"
            value={`${included.length} / ${GAMES.length}`}
            hint={plan === "PRO" ? "4 more with MAX" : "Complete library"}
            icon={Gamepad2}
          />
          <MetricCard
            label="Avg. adherence"
            value={`${stats.avgAdherence}%`}
            trend={{ value: "+3% this month" }}
            icon={Activity}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent sessions */}
        <section className="space-y-3">
          <SectionHeader
            title="Recent sessions"
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/app/sessions">
                  View all
                  <ArrowRight data-icon="inline-end" aria-hidden />
                </Link>
              </Button>
            }
          />
          {sessions.isLoading ? (
            <TableSkeleton rows={5} />
          ) : recentSessions.length === 0 ? (
            <EmptyState
              icon={Radio}
              title="No therapy sessions yet."
              description="Start your first session and telemetry will appear here automatically."
              action={<Button onClick={() => setStartOpen(true)}>Start Session</Button>}
            />
          ) : (
            <Card className="gap-0 overflow-hidden p-0">
              <ul className="divide-y divide-border">
                {recentSessions.map((s) => (
                  <li key={s.id}>
                    <button
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted/60 focus-visible:bg-surface-muted/60 focus-visible:outline-none"
                      onClick={() => setDetail(s)}
                      aria-label={`View details of ${s.patientName}'s ${s.gameName} session`}
                    >
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-accent text-xs font-semibold text-primary-dark">
                          {s.patientName.split(" ").map((x) => x[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {s.patientName}
                          <span className="font-normal text-muted-foreground"> · {s.gameName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(s.startedAt), "d MMM, HH:mm")}
                          {s.status !== "SCHEDULED" && s.durationMin > 0 && ` · ${s.durationMin} min`}
                          {s.reps > 0 && ` · ${s.reps} reps`}
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

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <Card className="gap-0 p-0">
              <CardContent className="flex flex-col gap-2 p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <CalendarClock className="size-3.5" aria-hidden />
                  Coming up
                </p>
                {upcoming.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-body">
                      <span className="font-medium text-ink">{s.patientName}</span> · {s.gameName}
                    </span>
                    <span className="num text-muted-foreground">
                      {format(parseISO(s.startedAt), "EEE HH:mm")}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Game utilization */}
          <section className="space-y-3">
            <SectionHeader title="Game utilization" description="Sessions in the last 60 days" />
            <Card className="gap-0 p-0">
              <CardContent className="space-y-3.5 p-4">
                {GAME_UTILIZATION.map((g) => (
                  <div key={g.gameId}>
                    <div className="flex items-baseline justify-between text-[13px]">
                      <span className="font-medium text-ink">{g.name}</span>
                      <span className="num text-muted-foreground">{g.sessions}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-teal"
                        style={{ width: `${(g.sessions / maxUtil) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {plan === "PRO" && (
                  <button
                    onClick={() => setUpgradeOpen(true)}
                    className="mt-1 w-full rounded-lg border border-dashed border-primary/30 bg-accent/40 px-3 py-2.5 text-left text-xs text-primary-dark transition-colors hover:bg-accent"
                  >
                    <span className="font-medium">4 MAX games unused.</span>{" "}
                    Unlock cervical rotation & coordination modules →
                  </button>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Patient activity snapshot */}
          <section className="space-y-3">
            <SectionHeader
              title="Therapy progress"
              actions={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/app/patients">All patients</Link>
                </Button>
              }
            />
            {patients.isLoading ? (
              <TableSkeleton rows={3} />
            ) : (
              <Card className="gap-0 p-0">
                <ul className="divide-y divide-border">
                  {(patients.data ?? [])
                    .filter((p) => p.status === "ACTIVE")
                    .sort((a, b) => b.romProgress - a.romProgress)
                    .slice(0, 4)
                    .map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/app/patients/${p.id}`}
                          className="block px-4 py-3 transition-colors hover:bg-surface-muted/60"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-ink">{p.name}</span>
                            <span className="num text-xs text-muted-foreground">
                              {p.romCurrent}° / {p.romTarget}°
                            </span>
                          </div>
                          <Progress
                            value={p.romProgress}
                            className="mt-2 h-1.5"
                            aria-label={`${p.name} ROM progress ${p.romProgress}%`}
                          />
                        </Link>
                      </li>
                    ))}
                </ul>
              </Card>
            )}
          </section>

          {/* Team shortcut */}
          <Card className="gap-0 p-0">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-accent text-primary">
                  <UsersRound className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Grow your team</p>
                  <p className="text-xs text-muted-foreground">Invite therapists & staff</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/app/team">Invite</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <StartSessionDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        onUpgrade={() => setUpgradeOpen(true)}
      />
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <PatientSheet open={addPatientOpen} onOpenChange={setAddPatientOpen} />
      <SessionDetailsSheet
        session={detail}
        open={!!detail}
        onOpenChange={(o) => !o && setDetail(null)}
      />
    </div>
  );
}
