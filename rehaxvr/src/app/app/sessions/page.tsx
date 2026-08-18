"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useSessions } from "@/hooks/use-data";
import {
  PageHeader,
  TableSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/shared/page-primitives";
import { SessionStatusBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetailsSheet } from "@/components/app/session-details-sheet";
import { StartSessionDialog } from "@/components/app/start-session-dialog";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import type { Session, SessionStatus } from "@/lib/types";
import { Radio, Search } from "lucide-react";

type StatusFilter = "ALL" | SessionStatus;

export default function SessionsPage() {
  const { data, isLoading, isError, refetch } = useSessions();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [detail, setDetail] = useState<Session | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...(data ?? [])].sort((a, b) =>
      b.startedAt.localeCompare(a.startedAt)
    );
    if (status !== "ALL") list = list.filter((s) => s.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.patientName.toLowerCase().includes(q) ||
          s.gameName.toLowerCase().includes(q) ||
          s.therapist.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, query, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description="Every therapy session, with its telemetry, in one place."
        actions={
          <Button onClick={() => setStartOpen(true)}>
            <Radio data-icon="inline-start" aria-hidden />
            Start Session
          </Button>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient, game, therapist…"
            className="pl-9"
            aria-label="Search sessions"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="IN_PROGRESS">In progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : isError ? (
        <ErrorState
          description="We couldn't load your sessions. Please try again."
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="No therapy sessions yet."
          description="Start a session and its telemetry will land here the moment it ends."
          action={<Button onClick={() => setStartOpen(true)}>Start Session</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow className="bg-surface-muted/60 hover:bg-surface-muted/60">
                <TableHead>Patient</TableHead>
                <TableHead>Game</TableHead>
                <TableHead>Start</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Reps</TableHead>
                <TableHead className="text-right">Peak ROM</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => setDetail(s)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setDetail(s)}
                  aria-label={`Open details for ${s.patientName}'s ${s.gameName} session`}
                >
                  <TableCell>
                    <span className="block text-sm font-medium text-ink">{s.patientName}</span>
                    <span className="block text-xs text-muted-foreground">{s.therapist}</span>
                  </TableCell>
                  <TableCell className="text-sm text-body">{s.gameName}</TableCell>
                  <TableCell className="text-sm text-body">
                    {format(parseISO(s.startedAt), "d MMM, HH:mm")}
                  </TableCell>
                  <TableCell className="num text-right text-sm text-body">
                    {s.durationMin > 0 ? `${s.durationMin} min` : "—"}
                  </TableCell>
                  <TableCell className="num text-right text-sm text-body">
                    {s.status === "SCHEDULED" ? `0 / ${s.targetReps}` : `${s.reps} / ${s.targetReps}`}
                  </TableCell>
                  <TableCell className="num text-right text-sm text-body">
                    {s.peakRom > 0 ? `${s.peakRom}°` : "—"}
                  </TableCell>
                  <TableCell>
                    <SessionStatusBadge status={s.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <SessionDetailsSheet
        session={detail}
        open={!!detail}
        onOpenChange={(o) => !o && setDetail(null)}
      />
      <StartSessionDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        onUpgrade={() => setUpgradeOpen(true)}
      />
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
