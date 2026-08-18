import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { Pipeline } from "@/components/marketing/pipeline";
import { CTASection } from "@/components/marketing/cta-section";
import { HomeGames, HomeValue } from "@/components/marketing/home-sections";
import { Reveal } from "@/components/shared/page-primitives";
import { ArrowRight, Play } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_50%_at_70%_20%,rgba(34,211,238,0.10),transparent)]"
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div>
            <Reveal y={10}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-medium text-primary-dark">
                <span className="size-1.5 rounded-full bg-teal" aria-hidden />
                AI-powered movement rehabilitation for clinics
              </div>
            </Reveal>
            <Reveal delay={0.08} y={10}>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
                Rehabilitation,
                <br />
                <span className="bg-gradient-to-r from-primary via-[#0891b2] to-teal bg-clip-text text-transparent">
                  Reimagined.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16} y={10}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-body">
                Turn repetitive physical therapy into engaging, measurable
                movement experiences powered by real-time computer vision — no
                sensors, no suits, no controllers.
              </p>
            </Reveal>
            <Reveal delay={0.24} y={10}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="px-5" asChild>
                  <Link href="/book-demo">
                    Book a Clinic Demo
                    <ArrowRight data-icon="inline-end" aria-hidden />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-5" asChild>
                  <Link href="/how-it-works">
                    <Play data-icon="inline-start" aria-hidden />
                    See How It Works
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.32} y={10}>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
                {[
                  ["9", "rehabilitation games"],
                  ["6+", "joint movement targets"],
                  ["1", "camera. That's all."],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className="num block text-2xl font-semibold text-ink">{v}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* PRODUCT STORY / PIPELINE */}
      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                How movement becomes progress
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Human movement becomes data. Data becomes interaction.
                Interaction becomes measurable progress.
              </h2>
            </div>
          </Reveal>
          <div className="mt-10">
            <Pipeline />
          </div>
        </div>
      </section>

      <HomeValue />
      <HomeGames />

      {/* PLANS TEASER */}
      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <Reveal className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Simple commercial model
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Two plans. Monthly or yearly. Every game clearly included — or
              clearly one upgrade away.
            </h2>
            <p className="mt-3 text-[15px] text-body">
              PRO gives your clinic the core rehabilitation game suite. MAX
              unlocks the complete nine-game library, including cervical
              rotation and coordination modules.
            </p>
            <Button className="mt-6" size="lg" asChild>
              <Link href="/pricing">
                Compare PRO and MAX
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={0.12} className="w-full max-w-sm">
            <div className="space-y-3">
              {[
                { plan: "PRO", games: "5 core games", text: "Core rehabilitation game suite", border: "border-border" },
                { plan: "MAX", games: "All 9 games", text: "Complete rehabilitation game library", border: "border-primary/40" },
              ].map((p) => (
                <Link
                  key={p.plan}
                  href="/pricing"
                  className={`flex items-center justify-between rounded-xl border ${p.border} bg-white p-5 card-hover`}
                >
                  <div>
                    <div className="text-base font-semibold text-ink">{p.plan}</div>
                    <div className="text-sm text-muted-foreground">{p.text}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary-dark">{p.games}</div>
                    <div className="text-xs text-muted-foreground">Monthly / Yearly</div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
