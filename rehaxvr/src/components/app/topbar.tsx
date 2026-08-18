"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { NavLinks } from "@/components/app/sidebar";
import { useAppState } from "@/components/app-state";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  Gamepad2,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { PATIENTS } from "@/lib/data/mock";
import { GAMES } from "@/lib/data/games";

export function AppTopbar() {
  const { userName, orgName } = useAppState();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const initials = userName
    .replace("Dr. ", "")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b border-border">
              <SheetTitle>
                <Logo href="/app" />
              </SheetTitle>
            </SheetHeader>
            <div className="py-3">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <Logo href="/app" className="sm:flex hidden" />
      </div>

      {/* Search / command */}
      <button
        onClick={() => setCmdOpen(true)}
        className="hidden h-9 w-72 items-center gap-2 rounded-lg border border-border bg-surface-muted/60 px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong md:flex"
        aria-label="Search patients, games and pages"
      >
        <Search className="size-4" aria-hidden />
        Search patients, games…
        <kbd className="ml-auto rounded border border-border bg-white px-1.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setCmdOpen(true)}
            aria-label="Search"
          >
            <Search />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Search</TooltipContent>
      </Tooltip>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen} title="Search" description="Search patients, games and pages">
        <CommandInput placeholder="Search patients, games, pages…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {[
              ["Dashboard", "/app", LayoutDashboard],
              ["Patients", "/app/patients", UserRound],
              ["Games", "/app/games", Gamepad2],
              ["Sessions", "/app/sessions", Radio],
              ["Analytics", "/app/analytics", BarChart3],
              ["Team", "/app/team", UsersRound],
              ["Settings", "/app/settings", Settings],
            ].map(([label, href, Icon]) => {
              const I = Icon as React.ElementType;
              return (
                <CommandItem
                  key={href as string}
                  onSelect={() => {
                    setCmdOpen(false);
                    router.push(href as string);
                  }}
                >
                  <I className="size-4" aria-hidden />
                  {label as string}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Patients">
            {PATIENTS.slice(0, 5).map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => {
                  setCmdOpen(false);
                  router.push(`/app/patients/${p.id}`);
                }}
              >
                <UserRound className="size-4" aria-hidden />
                {p.name}
                <span className="ml-auto text-xs text-muted-foreground">{p.program}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Games">
            {GAMES.slice(0, 5).map((g) => (
              <CommandItem
                key={g.id}
                onSelect={() => {
                  setCmdOpen(false);
                  router.push(`/app/games/${g.slug}`);
                }}
              >
                <Gamepad2 className="size-4" aria-hidden />
                {g.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted"
              aria-label="Account menu"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-[13px] font-medium leading-tight text-ink">
                  {userName}
                </span>
                <span className="block max-w-40 truncate text-[11px] leading-tight text-muted-foreground">
                  {orgName}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block text-sm font-medium">{userName}</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Organization Admin
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/settings?tab=profile">
                <UserRound aria-hidden /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/settings?tab=security">
                <ShieldCheck aria-hidden /> Security
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/help">
                <LifeBuoy aria-hidden /> Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => router.push("/login")}>
              <LogOut aria-hidden /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
