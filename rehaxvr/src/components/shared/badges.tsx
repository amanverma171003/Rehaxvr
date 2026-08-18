import { cn } from "@/lib/utils";
import type {
  Entitlement,
  MemberStatus,
  PatientStatus,
  Plan,
  Role,
  SessionStatus,
} from "@/lib/types";
import {
  Check,
  Circle,
  Clock,
  Crown,
  Loader2,
  Lock,
  Sparkles,
  XCircle,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

const base =
  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap";

export function PlanBadge({
  plan,
  className,
  size = "sm",
}: {
  plan: Plan;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        base,
        size === "md" && "px-2.5 py-1 text-xs rounded-lg",
        plan === "MAX"
          ? "border-primary/25 bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm"
          : "border-primary/30 bg-accent text-primary-dark",
        className
      )}
    >
      {plan === "MAX" ? <Crown className="size-3" aria-hidden /> : <Check className="size-3" aria-hidden />}
      {plan}
    </span>
  );
}

const entitlementStyles: Record<
  Entitlement,
  { label: string; className: string; icon: React.ElementType }
> = {
  INCLUDED: {
    label: "Included in plan",
    className: "border-teal/30 bg-teal/10 text-[#0d7a6c]",
    icon: Check,
  },
  UPGRADE_REQUIRED: {
    label: "Available with MAX",
    className: "border-primary/25 bg-primary/5 text-primary-dark",
    icon: Crown,
  },
  LOCKED: {
    label: "Locked",
    className: "border-border bg-muted text-muted-foreground",
    icon: Lock,
  },
  COMING_SOON: {
    label: "Coming soon",
    className: "border-border bg-muted text-muted-foreground",
    icon: Sparkles,
  },
};

export function EntitlementBadge({
  entitlement,
  className,
}: {
  entitlement: Entitlement;
  className?: string;
}) {
  const s = entitlementStyles[entitlement];
  const Icon = s.icon;
  return (
    <span className={cn(base, s.className, className)}>
      <Icon className="size-3" aria-hidden />
      {s.label}
    </span>
  );
}

const sessionStyles: Record<
  SessionStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  SCHEDULED: {
    label: "Scheduled",
    className: "border-border bg-muted text-body",
    icon: CalendarClock,
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "border-cyan/40 bg-cyan/10 text-primary-dark",
    icon: Loader2,
  },
  COMPLETED: {
    label: "Completed",
    className: "border-success/25 bg-success/8 text-success",
    icon: Check,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-warning/30 bg-warning/8 text-warning",
    icon: XCircle,
  },
  FAILED: {
    label: "Failed",
    className: "border-danger/25 bg-danger/8 text-danger",
    icon: AlertTriangle,
  },
};

export function SessionStatusBadge({
  status,
  className,
}: {
  status: SessionStatus;
  className?: string;
}) {
  const s = sessionStyles[status];
  const Icon = s.icon;
  return (
    <span className={cn(base, s.className, className)}>
      <Icon
        className={cn("size-3", status === "IN_PROGRESS" && "animate-spin")}
        aria-hidden
      />
      {s.label}
    </span>
  );
}

const patientStyles: Record<PatientStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "border-success/25 bg-success/8 text-success" },
  ON_HOLD: { label: "On hold", className: "border-warning/30 bg-warning/8 text-warning" },
  DISCHARGED: { label: "Discharged", className: "border-primary/25 bg-accent text-primary-dark" },
  ARCHIVED: { label: "Archived", className: "border-border bg-muted text-muted-foreground" },
};

export function PatientStatusBadge({
  status,
  className,
}: {
  status: PatientStatus;
  className?: string;
}) {
  const s = patientStyles[status];
  return (
    <span className={cn(base, s.className, className)}>
      <Circle className="size-1.5 fill-current" aria-hidden />
      {s.label}
    </span>
  );
}

const roleLabels: Record<Role, string> = {
  ADMIN: "Organization Admin",
  THERAPIST: "Therapist",
  STAFF: "Staff",
};

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return (
    <span
      className={cn(
        base,
        role === "ADMIN"
          ? "border-primary/25 bg-accent text-primary-dark"
          : role === "THERAPIST"
            ? "border-teal/30 bg-teal/8 text-[#0d7a6c]"
            : "border-border bg-muted text-body",
        className
      )}
    >
      {roleLabels[role]}
    </span>
  );
}

const memberStyles: Record<MemberStatus, { label: string; className: string; icon: React.ElementType }> = {
  ACTIVE: { label: "Active", className: "border-success/25 bg-success/8 text-success", icon: Check },
  PENDING: { label: "Invitation pending", className: "border-warning/30 bg-warning/8 text-warning", icon: Clock },
  DEACTIVATED: { label: "Deactivated", className: "border-border bg-muted text-muted-foreground", icon: XCircle },
};

export function MemberStatusBadge({
  status,
  className,
}: {
  status: MemberStatus;
  className?: string;
}) {
  const s = memberStyles[status];
  const Icon = s.icon;
  return (
    <span className={cn(base, s.className, className)}>
      <Icon className="size-3" aria-hidden />
      {s.label}
    </span>
  );
}
