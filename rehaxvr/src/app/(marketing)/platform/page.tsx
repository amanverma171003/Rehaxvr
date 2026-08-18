import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/marketing/cta-section";
import { Reveal } from "@/components/shared/page-primitives";
import { MotionSkeleton } from "@/components/brand/motion-skeleton";
import {
  Activity,
  ArrowRight,
  Building2,
  Eye,
  Gamepad2,
  LineChart,
  Users,
} from "lucide-react";

export const metadata: Metadata = { title: "Platform" };

const PILLARS = [
  {
    icon: Eye,
    title: "Computer vision engine",
    text: "Markerless pose tracking converts a standard camera feed into continuous 3D joint data — in real time, on local hardware. Patients just move; the platform does the measuring.",
    points: ["Markerless full-body tracking", "Real-time joint angle computation", "Compensation detection: trunk lean, shoulder hiking, pelvic tilt"],
  },
  {
    icon: Gamepad2,
    title: "Rehabilitation game library",
    text: "Nine therapy modules mapped to specific joints and movement patterns. Each repetition is validated by the exercise state machine before it counts.",
    points: ["9 games across elbow, knee, shoulder, hip, neck and coordination", "Therapist-configured range corridors", "Form alerts during play"],
  },
  {
    icon: LineChart,
    title: "Therapy telemetry & analytics",
    text: "Every session produces structured, comparable data: ROM, repetitions, velocity, smoothness, duration, pain input and adherence over time.",
    points: ["Per-session and per-patient trends", "ROM progress toward targets", "Adherence and utilization insights"],
  },
  {
    icon: Building2,
    title: "Multi-clinic SaaS",
    text: "Organization accounts, team roles, therapy stations and subscription management designed for single clinics and multi-location organizations alike.",
    points: ["Organization Admin, Therapist and Staff roles", "PRO and MAX subscription entitlements", "Station and device oversight"],
  },
];

const WORKFLOW = [
  { step: "01", title: "Add the patient", text: "Create a profile with condition, program and ROM targets in under a minute." },
  { step: "02", title: "Pick the game", text: "Choose the module matching the target joint and movement — the plan shows exactly what's included." },
  { step: "03", title: "Run the session", text: "The patient plays. The therapist watches live ROM, reps and form feedback on the session screen." },
  { step: "04", title: "Review progress", text: "Telemetry lands in analytics automatically. Adjust targets and progress the program with evidence." },
];

export default function PlatformPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Platform
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                One platform from camera to clinical insight.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-body">
                RehaxVR combines computer vision, biomechanics, gamified
                exercises and organization-grade SaaS into a single system your
                clinic can run every day.
              </p>
              <div className="mt-7 flex gap-3">
                <Button size="lg" asChild>
                  <Link href="/book-demo">
                    Book a Clinic Demo
                    <ArrowRight data-icon="inline-end" aria-hidden />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/technology">Explore the technology</Link>
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative mx-auto max-w-[300px] rounded-2xl border border-border bg-canvas grid-canvas p-6">
              <MotionSkeleton className="h-[320px]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="grid gap-6 rounded-2xl border border-border bg-white p-6 sm:p-8 md:grid-cols-[auto_1fr_1fr] md:items-center card-hover">
                  <div className="grid size-12 place-items-center rounded-xl bg-accent text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-ink">{p.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-body">{p.text}</p>
                  </div>
                  <ul className="space-y-2 md:border-l md:border-border md:pl-6">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-sm text-body">
                        <Activity className="mt-0.5 size-3.5 shrink-0 text-teal" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Therapist workflow
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Designed for a busy clinic floor.
              </h2>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW.map((w, i) => (
              <Reveal key={w.step} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-border bg-white p-5 card-hover">
                  <span className="num text-xs font-semibold text-primary">{w.step}</span>
                  <h3 className="mt-2 text-[15px] font-semibold text-ink">{w.title}</h3>
                  <p className="mt-1.5 text-sm text-body">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-sm text-body">
              <Users className="size-4 shrink-0 text-primary" aria-hidden />
              Roles built in: Organization Admins manage subscription and team,
              Therapists run patients and sessions, Staff support daily operations.
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
