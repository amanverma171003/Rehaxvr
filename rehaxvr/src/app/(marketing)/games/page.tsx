import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import { MarketingGamesGrid } from "@/components/marketing/games-grid";
import { Reveal } from "@/components/shared/page-primitives";

export const metadata: Metadata = { title: "Games" };

export default function GamesMarketingPage() {
  return (
    <>
      <section className="px-4 pb-4 pt-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Game library
            </span>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Nine therapy modules. Every one mapped to a movement that matters.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-body">
              Each game targets a specific joint and movement pattern, with
              therapist-configured ranges and objective telemetry. PRO includes
              the five core modules; MAX unlocks the complete library.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <MarketingGamesGrid />
        </div>
      </section>
      <CTASection
        title="Want to see a specific module in action?"
        description="Tell us which movements your programs target and we'll demo those games first."
      />
    </>
  );
}
