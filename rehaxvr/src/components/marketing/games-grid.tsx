"use client";

import { useMemo, useState } from "react";
import { GAMES } from "@/lib/data/games";
import { GameArt } from "@/components/brand/game-art";
import { PlanBadge } from "@/components/shared/badges";
import { Reveal } from "@/components/shared/page-primitives";
import { cn } from "@/lib/utils";
import type { BodyArea } from "@/lib/types";
import { Crosshair, Gauge, Move } from "lucide-react";

const AREAS: ("All" | BodyArea)[] = [
  "All",
  "Elbow",
  "Knee",
  "Shoulder",
  "Hip",
  "Neck",
  "Upper Limb",
  "Bilateral",
];

export function MarketingGamesGrid() {
  const [area, setArea] = useState<(typeof AREAS)[number]>("All");

  const games = useMemo(
    () => (area === "All" ? GAMES : GAMES.filter((g) => g.bodyArea === area)),
    [area]
  );

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter games by body area"
      >
        {AREAS.map((a) => (
          <button
            key={a}
            role="tab"
            aria-selected={area === a}
            onClick={() => setArea(a)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
              area === a
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-body hover:border-border-strong hover:text-ink"
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game, i) => (
          <Reveal key={game.id} delay={Math.min(i * 0.04, 0.3)}>
            <article
              id={game.slug}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white card-hover"
            >
              <GameArt game={game} className="aspect-[2/1] rounded-none" />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-ink">{game.name}</h2>
                  <div className="flex gap-1">
                    {game.plans.includes("PRO") ? (
                      <PlanBadge plan="PRO" />
                    ) : (
                      <PlanBadge plan="MAX" />
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-body">
                  {game.description}
                </p>
                <dl className="mt-4 space-y-1.5 border-t border-border pt-3 text-[13px]">
                  <div className="flex items-center gap-2 text-body">
                    <Crosshair className="size-3.5 text-primary" aria-hidden />
                    <dt className="w-24 text-muted-foreground">Target joint</dt>
                    <dd className="font-medium">{game.targetJoint}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-body">
                    <Move className="size-3.5 text-primary" aria-hidden />
                    <dt className="w-24 text-muted-foreground">Movement</dt>
                    <dd className="font-medium">{game.movement}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-body">
                    <Gauge className="size-3.5 text-primary" aria-hidden />
                    <dt className="w-24 text-muted-foreground">Range</dt>
                    <dd className="num font-medium">{game.targetAngle}</dd>
                  </div>
                </dl>
                <p className="mt-3 rounded-lg bg-surface-muted px-3 py-2 text-[12px] text-body">
                  <span className="font-medium text-ink">Objective: </span>
                  {game.objective}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
