"use client";

import { useState } from "react";
import { useAnalytics, usePatients } from "@/hooks/use-data";
import {
  PageHeader,
  SectionHeader,
  ErrorState,
  MetricCard,
} from "@/components/shared/page-primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Download,
  Gauge,
  Repeat,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #D9E2EC",
  fontSize: 12,
} as const;

function ChartCard({
  title,
  question,
  children,
  loading,
}: {
  title: string;
  question: string;
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card className="gap-0 p-0">
      <CardContent className="p-4 sm:p-5">
        <SectionHeader title={title} description={question} />
        <div className="mt-4 h-56">
          {loading ? <Skeleton className="h-full w-full" /> : children}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAnalytics();
  const patients = usePatients();
  const [range, setRange] = useState("90");
  const [patientFilter, setPatientFilter] = useState("ALL");

  if (isError) {
    return (
      <ErrorState
        description="We couldn't load your analytics. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const rom = data?.romTrend ?? [];
  const completion = data?.completionTrend ?? [];
  const util = data?.gameUtilization ?? [];
  const adherence = data?.adherenceTrend ?? [];

  const latestAdherence = adherence.at(-1)?.adherence ?? 0;
  const latestRom = rom.at(-1)?.rom ?? 0;
  const totalCompleted = completion.reduce((a, w) => a + w.completed, 0);
  const completionRate =
    completion.length > 0
      ? Math.round(
          (totalCompleted /
            completion.reduce(
              (a, w) => a + w.completed + w.cancelled + w.failed,
              0
            )) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Progress, utilization and adherence across your organization."
        actions={
          <>
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="w-44" aria-label="Filter by patient">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All patients</SelectItem>
                {(patients.data ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={range} onValueChange={setRange}>
              <TabsList>
                <TabsTrigger value="30">30d</TabsTrigger>
                <TabsTrigger value="90">90d</TabsTrigger>
                <TabsTrigger value="365">1y</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" disabled>
                    <Download data-icon="inline-start" aria-hidden />
                    Export
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Exports are coming soon</TooltipContent>
            </Tooltip>
          </>
        }
      />

      {/* headline metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Avg ROM vs target"
          value={isLoading ? "…" : `${latestRom}%`}
          hint="Org average, latest week"
          icon={Gauge}
          trend={{ value: "+27 pts since June" }}
        />
        <MetricCard
          label="Session completion"
          value={isLoading ? "…" : `${completionRate}%`}
          hint="Completed vs all ended sessions"
          icon={Activity}
        />
        <MetricCard
          label="Weekly repetitions"
          value={isLoading ? "…" : (rom.at(-1)?.reps ?? 0).toLocaleString()}
          hint="Validated reps, latest week"
          icon={Repeat}
        />
        <MetricCard
          label="Adherence"
          value={isLoading ? "…" : `${latestAdherence}%`}
          hint="Attended vs planned sessions"
          icon={TrendingUp}
          trend={{ value: "+12 pts since June" }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="ROM trend"
          question="Are patients moving closer to their range targets?"
          loading={isLoading}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rom} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="romOrg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0E7490" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0E7490" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <ChartTooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Avg ROM vs target"]} />
              <Area type="monotone" dataKey="rom" stroke="#0E7490" strokeWidth={2} fill="url(#romOrg)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Repetition trend"
          question="Is total therapy volume growing week over week?"
          loading={isLoading}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rom} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} />
              <ChartTooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Validated reps"]} />
              <Line type="monotone" dataKey="reps" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3, fill: "#14B8A6" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Session completion"
          question="How many sessions finish — and why do some not?"
          loading={isLoading}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completion} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} />
              <ChartTooltip contentStyle={tooltipStyle} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#0E7490" radius={[0, 0, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#D97706" />
              <Bar dataKey="failed" name="Failed" stackId="a" fill="#DC2626" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Therapy adherence"
          question="Are patients attending the sessions they planned?"
          loading={isLoading}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={adherence} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="adhFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#627D98" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <ChartTooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Adherence"]} />
              <Area type="monotone" dataKey="adherence" stroke="#14B8A6" strokeWidth={2} fill="url(#adhFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Game utilization */}
      <Card className="gap-0 p-0">
        <CardContent className="p-4 sm:p-5">
          <SectionHeader
            title="Game utilization"
            description="Which modules is your clinic actually using?"
          />
          <div className="mt-4 space-y-3.5">
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              util.map((g) => {
                const max = Math.max(...util.map((x) => x.sessions));
                return (
                  <div key={g.gameId} className="grid grid-cols-[140px_1fr_90px] items-center gap-3 sm:grid-cols-[180px_1fr_110px]">
                    <span className="truncate text-sm font-medium text-ink">{g.name}</span>
                    <Progress value={(g.sessions / max) * 100} className="h-2" aria-label={`${g.name}: ${g.sessions} sessions`} />
                    <span className="num text-right text-xs text-muted-foreground">
                      {g.sessions} sessions
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
