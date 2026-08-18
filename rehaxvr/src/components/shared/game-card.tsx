"use client";

import { GameArt } from "@/components/brand/game-art";
import { EntitlementBadge, PlanBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import type { Entitlement, Game } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Crosshair, Move, Play } from "lucide-react";

export function GameCard({
  game,
  entitlement,
  onOpen,
  onLaunch,
  onUpgrade,
  className,
  compact = false,
}: {
  game: Game;
  entitlement: Entitlement;
  onOpen?: () => void;
  onLaunch?: () => void;
  onUpgrade?: () => void;
  className?: string;
  compact?: boolean;
}) {
  const upgradeNeeded = entitlement === "UPGRADE_REQUIRED";

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-white card-hover",
        className
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full text-left focus-visible:outline-2 focus-visible:outline-ring"
        aria-label={`View details for ${game.name}`}
      >
        <GameArt
          game={game}
          className={cn(
            "aspect-[2/1] rounded-none transition-opacity",
            upgradeNeeded && "opacity-80"
          )}
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {upgradeNeeded && <PlanBadge plan="MAX" />}
        </div>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-semibold text-ink">{game.name}</h3>
            <p className="mt-0.5 text-[13px] text-muted-foreground">{game.tagline}</p>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
          <div className="flex items-center gap-1.5 text-body">
            <Crosshair className="size-3.5 text-primary" aria-hidden />
            <dt className="sr-only">Target joint</dt>
            <dd>{game.targetJoint}</dd>
          </div>
          <div className="flex items-center gap-1.5 text-body">
            <Move className="size-3.5 text-primary" aria-hidden />
            <dt className="sr-only">Movement</dt>
            <dd className="truncate">{game.movement}</dd>
          </div>
        </dl>

        {!compact && (
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            {game.objective}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <EntitlementBadge entitlement={entitlement} />
          {entitlement === "INCLUDED" && onLaunch && (
            <Button size="sm" onClick={onLaunch}>
              <Play data-icon="inline-start" aria-hidden />
              Launch
            </Button>
          )}
          {upgradeNeeded && onUpgrade && (
            <Button size="sm" variant="outline" onClick={onUpgrade}>
              Upgrade to MAX
              <ArrowUpRight data-icon="inline-end" aria-hidden />
            </Button>
          )}
          {entitlement === "INCLUDED" && !onLaunch && onOpen && (
            <Button size="sm" variant="ghost" onClick={onOpen}>
              Details
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
