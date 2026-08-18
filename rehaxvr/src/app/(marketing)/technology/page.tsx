import type { Metadata } from "next";
import { CTASection } from "@/components/marketing/cta-section";
import { Reveal } from "@/components/shared/page-primitives";
import { MotionSkeleton } from "@/components/brand/motion-skeleton";
import {
  Camera,
  Cpu,
  Eye,
  Gauge,
  Layers,
  Network,
} from "lucide-react";

export const metadata: Metadata = { title: "Technology" };

const STACK = [
  {
    icon: Camera,
    title: "Standard camera input",
    text: "Any quality RGB camera works. Patients wear nothing — no markers, straps or gloves. Setup is positioning a camera and pressing start.",
  },
  {
    icon: Cpu,
    title: "Edge compute per station",
    text: "Each therapy station runs on a compact mini PC with local inference. Sessions stay responsive with no dependency on cloud round-trips during play.",
  },
  {
    icon: Eye,
    title: "Markerless computer vision",
    text: "Pose estimation converts the video feed into continuous 3D joint positions at interactive frame rates, tuned for clinical movement patterns.",
  },
  {
    icon: Gauge,
    title: "Biomechanical kinematics",
    text: "Joint angles, angular velocity, acceleration and movement smoothness are computed live, alongside compensation detection like trunk lean and shoulder hiking.",
  },
  {
    icon: Layers,
    title: "Exercise state machine",
    text: "Raw movement becomes structured therapy: validated repetitions, range corridors, hold times, form alerts and game events.",
  },
  {
    icon: Network,
    title: "Multi-clinic SaaS layer",
    text: "Organization accounts, roles, entitlements, telemetry storage and analytics — managed centrally, deployed per clinic.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-canvas px-4 pb-20 pt-16 text-white sm:px-6">
        <div className="pointer-events-none absolute inset-0 grid-canvas" aria-hidden />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-cyan/12 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan">
                Technology
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Serious motion science on refreshingly simple hardware.
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#a8c6d8]">
                RehaxVR runs markerless computer vision and real-time
                biomechanics on a mini PC and a standard camera — so the
                technology disappears and the therapy takes over.
              </p>
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {[
                  ["30 fps", "real-time tracking"],
                  ["0", "wearable sensors"],
                  ["Local", "on-station inference"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dd>
                      <span className="num block text-xl font-semibold text-white">{v}</span>
                      <span className="mt-0.5 block text-xs text-[#8CABC4]">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="mx-auto max-w-[280px]">
              <MotionSkeleton className="h-[340px]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 0.05}>
                  <div className="h-full rounded-xl border border-border bg-white p-5 card-hover">
                    <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
                      <Icon className="size-4.5" aria-hidden />
                    </div>
                    <h2 className="mt-4 text-[15px] font-semibold text-ink">{s.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-body">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Technical questions? Bring your IT lead."
        description="We'll walk through deployment, station hardware, data handling and network requirements on the demo call."
      />
    </>
  );
}
