import type { Metadata } from "next";
import { Reveal } from "@/components/shared/page-primitives";
import { PricingClient } from "@/components/marketing/pricing-client";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <section className="px-4 pb-16 pt-14 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Pricing
            </span>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Two plans. Zero surprises.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-body">
              Every plan includes patient management, session telemetry and
              team access. The difference is the game library.
            </p>
          </Reveal>
        </div>
        <div className="mx-auto mt-10 max-w-6xl">
          <PricingClient />
        </div>
      </section>
      <CTASection
        title="Not sure which plan fits?"
        description="Book a demo and we'll map your therapy programs to the game library together — then you decide."
      />
    </>
  );
}
