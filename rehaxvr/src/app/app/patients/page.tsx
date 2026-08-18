"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { usePatients } from "@/hooks/use-data";
import {
  PageHeader,
  TableSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/shared/page-primitives";
import { PatientStatusBadge } from "@/components/shared/badges";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PatientSheet } from "@/components/app/patient-sheet";
import { StartSessionDialog } from "@/components/app/start-session-dialog";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import type { Patient, PatientStatus } from "@/lib/types";
import {
  Archive,
  MoreHorizontal,
  Pencil,
  Plus,
  Radio,
  Search,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

type StatusFilter = "ALL" | PatientStatus;

export default function PatientsPage() {
  const { data, isLoading, isError, refetch } = usePatients();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [archiving, setArchiving] = useState<Patient | null>(null);
  const [sessionFor, setSessionFor] = useState<Patient | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (status !== "ALL") list = list.filter((p) => p.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.program.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, query, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Profiles, therapy programs and progress for everyone in your care."
        actions={
          <Button onClick={() => { setEditing(null); setSheetOpen(true); }}>
            <Plus data-icon="inline-start" aria-hidden />
            Add Patient
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, condition, program…"
            className="pl-9"
            aria-label="Search patients"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ON_HOLD">On hold</SelectItem>
            <SelectItem value="DISCHARGED">Discharged</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        {(query || status !== "ALL") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setQuery(""); setStatus("ALL"); }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton rows={7} />
      ) : isError ? (
        <ErrorState
          description="We couldn't load your patients. Please try again."
          onRetry={() => refetch()}
        />
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="Your patient workspace is ready."
          description="Add your first patient to begin running measurable therapy sessions."
          action={
            <Button onClick={() => { setEditing(null); setSheetOpen(true); }}>
              <Plus data-icon="inline-start" aria-hidden />
              Add Patient
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No patients match those filters."
          description="Try a different search term or clear the filters."
          action={
            <Button variant="outline" onClick={() => { setQuery(""); setStatus("ALL"); }}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="bg-surface-muted/60 hover:bg-surface-muted/60">
                <TableHead>Patient</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last session</TableHead>
                <TableHead className="w-44">ROM progress</TableHead>
                <TableHead>Adherence</TableHead>
                <TableHead className="w-12 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell>
                    <Link
                      href={`/app/patients/${p.id}`}
                      className="flex items-center gap-2.5"
                    >
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-accent text-[11px] font-semibold text-primary-dark">
                          {p.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        <span className="block text-sm font-medium text-ink group-hover:text-primary">
                          {p.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {p.age} yrs · {p.therapist}
                        </span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="block text-sm text-body">{p.program}</span>
                    <span className="block max-w-44 truncate text-xs text-muted-foreground">
                      {p.condition}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PatientStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-sm text-body">
                    {p.lastSession
                      ? format(parseISO(p.lastSession), "d MMM, HH:mm")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={p.romProgress}
                        className="h-1.5 flex-1"
                        aria-label={`ROM progress ${p.romProgress}%`}
                      />
                      <span className="num w-16 text-right text-xs text-muted-foreground">
                        {p.romCurrent}°/{p.romTarget}°
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="num text-sm font-medium text-ink">{p.adherence}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${p.name}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/app/patients/${p.id}`}>
                            <UserRound aria-hidden /> View profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSessionFor(p)}>
                          <Radio aria-hidden /> Start session
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => { setEditing(p); setSheetOpen(true); }}
                        >
                          <Pencil aria-hidden /> Edit patient
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setArchiving(p)}
                        >
                          <Archive aria-hidden /> Archive patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit sheet */}
      <PatientSheet
        open={sheetOpen}
        onOpenChange={(o) => { setSheetOpen(o); if (!o) setEditing(null); }}
        patient={editing}
      />

      {/* Archive confirm */}
      <AlertDialog open={!!archiving} onOpenChange={(o) => !o && setArchiving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {archiving?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Archiving hides this patient from active lists and prevents new
              sessions. Their therapy history and telemetry are retained and the
              profile can be restored at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep active</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                toast.success("Patient archived", {
                  description: `${archiving?.name} has been moved to the archive.`,
                });
                setArchiving(null);
              }}
            >
              Archive patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start session */}
      <StartSessionDialog
        open={!!sessionFor}
        onOpenChange={(o) => !o && setSessionFor(null)}
        defaultPatientId={sessionFor?.id}
        defaultGameId={sessionFor?.primaryGameId}
        onUpgrade={() => setUpgradeOpen(true)}
      />
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
