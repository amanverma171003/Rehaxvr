"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGames } from "@/hooks/use-data";
import { useAppState } from "@/components/app-state";
import { getEntitlement } from "@/lib/data/games";
import {
  PageHeader,
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/shared/page-primitives";
import { GameCard } from "@/components/shared/game-card";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { StartSessionDialog } from "@/components/app/start-session-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BodyArea, Entitlement } from "@/lib/types";
import { Gamepad2, Search } from "lucide-react";

type AreaFilter = "ALL" | BodyArea;
type EntFilter = "ALL" | "INCLUDED" | "UPGRADE_REQUIRED";

export default function GamesPage() {
  const router = useRouter();
  const { plan } = useAppState();
  const { data, isLoading, isError, refetch } = useGames();

  const [query, setQuery] = useState("");
  const [area, setArea] = useState<AreaFilter>("ALL");
  const [ent, setEnt] = useState<EntFilter>("ALL");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeGameId, setUpgradeGameId] = useState<string | undefined>();
  const [launchGameId, setLaunchGameId] = useState<string | null>(null);

  const games = useMemo(() => {
    let list = data ?? [];
    if (area !== "ALL") list = list.filter((g) => g.bodyArea === area);
    if (ent !== "ALL")
      list = list.filter((g) => getEntitlement(g, plan) === (ent as Entitlement));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.movement.toLowerCase().includes(q) ||
          g.targetJoint.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, area, ent, query, plan]);

  const includedCount = (data ?? []).filter(
    (g) => getEntitlement(g, plan) === "INCLUDED"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Game library"
        description={`${includedCount} of ${data?.length ?? 9} games included in your ${plan} plan.`}
        actions={
          plan === "PRO" ? (
            <Button
              variant="outline"
              onClick={() => { setUpgradeGameId(undefined); setUpgradeOpen(true); }}
            >
              Unlock all 9 with MAX
            </Button>
          ) : undefined
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
            placeholder="Search games or movements…"
            className="pl-9"
            aria-label="Search games"
          />
        </div>
        <Select value={area} onValueChange={(v) => setArea(v as AreaFilter)}>
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by body area">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All body areas</SelectItem>
            <SelectItem value="Elbow">Elbow</SelectItem>
            <SelectItem value="Knee">Knee</SelectItem>
            <SelectItem value="Shoulder">Shoulder</SelectItem>
            <SelectItem value="Hip">Hip</SelectItem>
            <SelectItem value="Neck">Neck</SelectItem>
            <SelectItem value="Upper Limb">Upper limb</SelectItem>
            <SelectItem value="Bilateral">Bilateral</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ent} onValueChange={(v) => setEnt(v as EntFilter)}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by availability">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All availability</SelectItem>
            <SelectItem value="INCLUDED">Included in plan</SelectItem>
            <SelectItem value="UPGRADE_REQUIRED">Available with MAX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <CardGridSkeleton />
      ) : isError ? (
        <ErrorState
          description="We couldn't load your games. Please try again."
          onRetry={() => refetch()}
        />
      ) : games.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title="No games match those filters."
          description="Try a different body area or availability filter."
          action={
            <Button
              variant="outline"
              onClick={() => { setQuery(""); setArea("ALL"); setEnt("ALL"); }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => {
            const entitlement = getEntitlement(game, plan);
            return (
              <GameCard
                key={game.id}
                game={game}
                entitlement={entitlement}
                onOpen={() => router.push(`/app/games/${game.slug}`)}
                onLaunch={
                  entitlement === "INCLUDED"
                    ? () => setLaunchGameId(game.id)
                    : undefined
                }
                onUpgrade={() => { setUpgradeGameId(game.id); setUpgradeOpen(true); }}
              />
            );
          })}
        </div>
      )}

      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        highlightGameId={upgradeGameId}
      />
      <StartSessionDialog
        open={!!launchGameId}
        onOpenChange={(o) => !o && setLaunchGameId(null)}
        defaultGameId={launchGameId ?? undefined}
        onUpgrade={() => setUpgradeOpen(true)}
      />
    </div>
  );
}
