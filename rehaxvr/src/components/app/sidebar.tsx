"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { PlanBadge } from "@/components/shared/badges";
import { useAppState } from "@/components/app-state";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  Gamepad2,
  LayoutDashboard,
  LifeBuoy,
  Radio,
  Settings,
  Users,
  UsersRound,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const APP_NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/patients", label: "Patients", icon: UserRound },
  { href: "/app/games", label: "Games", icon: Gamepad2 },
  { href: "/app/sessions", label: "Sessions", icon: Radio },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/team", label: "Team", icon: UsersRound },
  { href: "/app/subscription", label: "Subscription", icon: CreditCard },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5 px-3" aria-label="Application">
      {APP_NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
              active
                ? "bg-accent text-primary-dark"
                : "text-body hover:bg-muted hover:text-ink"
            )}
          >
            <Icon
              className={cn("size-4", active ? "text-primary" : "text-muted-foreground")}
              aria-hidden
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  const { plan, orgName } = useAppState();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo href="/app" />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>
      <div className="border-t border-border p-3">
        <Link
          href="/app/help"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-body transition-colors hover:bg-muted hover:text-ink"
        >
          <LifeBuoy className="size-4 text-muted-foreground" aria-hidden />
          Help & Support
        </Link>
        <div className="mt-2 rounded-xl border border-border bg-surface-muted/60 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-medium text-ink">{orgName}</span>
            <PlanBadge plan={plan} />
          </div>
          {plan === "PRO" && (
            <>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                4 more games available with MAX.
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full bg-white" asChild>
                <Link href="/app/subscription">Upgrade to MAX</Link>
              </Button>
            </>
          )}
          {plan === "MAX" && (
            <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
              Complete game library unlocked.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
