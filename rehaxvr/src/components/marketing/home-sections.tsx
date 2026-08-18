"use client";

import Link from "next/link";
import { GAMES, getEntitlement } from "@/lib/data/games";
import { GameArt } from "@/components/brand/game-art";
import { EntitlementBadge } from "@/components/shared/badges";
import { Reveal } from "@/components/shared/page-primitives";
import { Button } from "@/components/ui/button";
import { RomGauge } from "@/components/brand/rom-gauge";
import {
  ArrowRight,
  BarChart3,
  Building2,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

/* ------------------------------ Value proposition ----------------------------- */

const VALUES = [
  {
    icon: HeartPulse,
    title: "Patients keep showing up",
    text: "Exercises become games patients want to finish. Repetitions are earned through correct movement — not counted on faith.",
  },
  {
    icon: BarChart3,
    title: "Therapists see every session",
    text: "ROM, reps, smoothness, compensation alerts and pain input are captured automatically, session after session.",
  },
  {
    icon: Building2,
    title: "Organizations stay in control",
    text: "Multi-clinic governance, team roles, station management and a subscription that scales with your organization.",
  },
  {
    icon: ShieldCheck,
    title: "Deploys on low-cost hardware",
    text: "A mini PC and a standard camera per station. Local inference keeps sessions responsive and simple to run.",
  },
];

export function HomeValue() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Why clinics choose RehaxVR
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Engaging for patients. Measurable for therapists. Manageable for
              organizations.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 0.06}>
                  <div className="h-full rounded-xl border border-border bg-white p-5 card-hover">
                    <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
                      <Icon className="size-4.5" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-ink">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-body">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Telemetry snapshot panel */}
          <Reveal delay={0.15}>
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="text-sm font-semibold text-ink">
                What a therapist sees after one session
              </h3>
              <div className="mt-4">
                <RomGauge value={104} target={120} max={160} label="Knee flexion" light />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Repetitions", "52 / 50"],
                  ["Smoothness", "84%"],
                  ["Duration", "18 min"],
                  ["Pain input", "2 / 10"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-surface-muted px-3 py-2">
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="num mt-0.5 text-base font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-lg border border-teal/25 bg-teal/6 px-3 py-2 text-xs text-[#0d7a6c]">
                No compensation patterns detected this session.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Games teaser -------------------------------- */

export function HomeGames() {
  const featured = GAMES.slice(0, 6);
  return (
    <section className="border-t border-border bg-surface-muted/50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Therapy modules, not arcade games
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Nine games. Nine movement targets. One library.
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/games">
                Explore the full library
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((game, i) => (
            <Reveal key={game.id} delay={i * 0.05}>
              <Link
                href={`/games#${game.slug}`}
                className="group block overflow-hidden rounded-xl border border-border bg-white card-hover"
              >
                <GameArt game={game} className="aspect-[2/1] rounded-none" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-semibold text-ink">{game.name}</h3>
                    <EntitlementBadge
                      entitlement={getEntitlement(game, "PRO") === "INCLUDED" ? "INCLUDED" : "UPGRADE_REQUIRED"}
                    />
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {game.targetJoint} · {game.movement}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
