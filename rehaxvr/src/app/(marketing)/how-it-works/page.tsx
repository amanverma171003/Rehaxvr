import type { Metadata } from "next";
import { Pipeline } from "@/components/marketing/pipeline";
import { CTASection } from "@/components/marketing/cta-section";
import { Reveal } from "@/components/shared/page-primitives";
import { HeroVisual } from "@/components/marketing/hero-visual";

export const metadata: Metadata = { title: "How It Works" };

const DETAILS = [
  {
    title: "Repetitions that are actually earned",
    text: "The exercise state machine only counts a repetition when the joint travels through the therapist-configured range with acceptable form. Cheated reps don't count — and patients can see why in real time.",
  },
  {
    title: "Form feedback while it matters",
    text: "Compensation patterns such as trunk lean, shoulder hiking or pelvic tilt trigger gentle in-game cues during the movement, not in a report three days later.",
  },
  {
    title: "Telemetry without extra work",
    text: "Nobody transcribes anything. ROM, reps, velocity, smoothness, duration and pain input flow into the patient's record the moment the session ends.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="px-4 pb-16 pt-14 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              How it works
            </span>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              From a patient's movement to a therapist's insight — in six steps.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-body">
              No wearables. No markers. No manual counting. Just a camera, a
              screen and a patient in motion.
            </p>
          </Reveal>
        </div>
        <div className="mx-auto mt-12 max-w-6xl">
          <Pipeline />
        </div>
      </section>

      <section className="border-t border-border bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <HeroVisual />
          </Reveal>
          <div className="space-y-8">
            {DETAILS.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08}>
                <div className="border-l-2 border-primary/30 pl-5">
                  <h2 className="text-lg font-semibold text-ink">{d.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{d.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Watch it work with your own patients."
        description="A demo takes thirty minutes. Bring a therapist — they'll ask the hard questions and we like that."
      />
    </>
  );
}
