"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getGame, getEntitlement } from "@/lib/data/games";
import { useAppState } from "@/components/app-state";
import { GameArt } from "@/components/brand/game-art";
import {
  EntitlementBadge,
  PlanBadge,
} from "@/components/shared/badges";
import { ErrorState, SectionHeader } from "@/components/shared/page-primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StartSessionDialog } from "@/components/app/start-session-dialog";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { GAME_UTILIZATION } from "@/lib/data/mock";
import {
  ArrowLeft,
  ArrowUpRight,
  Crosshair,
  Gauge,
  Layers,
  Move,
  Play,
  Target,
} from "lucide-react";

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { plan } = useAppState();
  const game = getGame(slug);
  const [startOpen, setStartOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (!game) {
    return (
      <ErrorState
        title="Game not found"
        description="That module doesn't exist in the current catalog."
      />
    );
  }

  const entitlement = getEntitlement(game, plan);
  const included = entitlement === "INCLUDED";
  const util = GAME_UTILIZATION.find((u) => u.gameId === game.id);

  const specs = [
    { icon: Crosshair, label: "Target joint", value: game.targetJoint },
    { icon: Move, label: "Movement", value: game.movement },
    { icon: Layers, label: "Movement plane", value: game.movementPlane },
    { icon: Gauge, label: "Target range", value: game.targetAngle },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link href="/app/games">
          <ArrowLeft data-icon="inline-start" aria-hidden />
          Game library
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Hero */}
          <div className="overflow-hidden rounded-2xl border border-border">
            <GameArt game={game} className="aspect-[2/1] rounded-none" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-ink">
                {game.name}
              </h1>
              <EntitlementBadge entitlement={entitlement} />
            </div>
            <p className="mt-1 text-[15px] text-muted-foreground">{game.tagline}</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-body">
              {game.description}
            </p>
          </div>

          <section className="space-y-3">
            <SectionHeader title="Therapeutic objective" />
            <Card className="gap-0 p-0">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal">
                  <Target className="size-4" aria-hidden />
                </div>
                <p className="text-sm leading-relaxed text-body">{game.objective}</p>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Side rail */}
        <div className="space-y-5">
          <Card className="gap-0 p-0">
            <CardContent className="p-5">
              {included ? (
                <>
                  <p className="text-sm font-medium text-ink">
                    Included in your {plan} plan
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Launch this module on any therapy station.
                  </p>
                  <Button size="lg" className="mt-4 w-full" onClick={() => setStartOpen(true)}>
                    <Play data-icon="inline-start" aria-hidden />
                    Launch session
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <PlanBadge plan="MAX" />
                    <p className="text-sm font-medium text-ink">Available with MAX</p>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-body">
                    {game.name} is part of the complete rehabilitation game
                    library. Upgrading unlocks it — plus every other MAX module —
                    instantly for your whole organization.
                  </p>
                  <Button size="lg" className="mt-4 w-full" onClick={() => setUpgradeOpen(true)}>
                    Upgrade to MAX
                    <ArrowUpRight data-icon="inline-end" aria-hidden />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="gap-0 p-0">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-ink">Module specification</h2>
              <dl className="mt-3 space-y-3">
                {specs.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <Icon className="size-4 text-primary" aria-hidden />
                      <dt className="w-32 text-[13px] text-muted-foreground">{s.label}</dt>
                      <dd className="num text-[13px] font-medium text-ink">{s.value}</dd>
                    </div>
                  );
                })}
              </dl>
            </CardContent>
          </Card>

          {util && included && (
            <Card className="gap-0 p-0">
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold text-ink">Usage at your clinic</h2>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-surface-muted px-3 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Sessions
                    </p>
                    <p className="num mt-0.5 text-lg font-semibold text-ink">{util.sessions}</p>
                  </div>
                  <div className="rounded-lg bg-surface-muted px-3 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Minutes
                    </p>
                    <p className="num mt-0.5 text-lg font-semibold text-ink">
                      {util.minutes.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="gap-0 border-dashed p-0">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-ink">Difficulty & configuration</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-body">
                Range corridors, repetition targets and pacing are configured per
                patient when starting a session. Defaults follow the module
                specification above.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <StartSessionDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        defaultGameId={game.id}
        onUpgrade={() => setUpgradeOpen(true)}
      />
      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        highlightGameId={game.id}
      />
    </div>
  );
}
