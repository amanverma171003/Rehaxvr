import type { Metadata } from "next";
import { Reveal } from "@/components/shared/page-primitives";
import { BookDemoForm } from "@/components/marketing/book-demo-form";
import { CalendarCheck, MonitorPlay, Users } from "lucide-react";

export const metadata: Metadata = { title: "Book a Clinic Demo" };

const EXPECT = [
  {
    icon: MonitorPlay,
    title: "A live therapy session",
    text: "Watch movement drive a game in real time — ROM, reps and form feedback included.",
  },
  {
    icon: Users,
    title: "Your use cases, mapped",
    text: "We match your therapy programs to specific game modules and telemetry.",
  },
  {
    icon: CalendarCheck,
    title: "A clear next step",
    text: "Deployment plan, hardware list and subscription options for your organization.",
  },
];

export default function BookDemoPage() {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Book a demo
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Thirty minutes. One camera. Your whole team is welcome.
            </h1>
            <p className="mt-4 max-w-md text-lg text-body">
              Tell us about your organization and we&apos;ll schedule a live
              RehaxVR session tailored to your therapy programs.
            </p>
          </Reveal>
          <div className="mt-10 space-y-5">
            {EXPECT.map((e, i) => {
              const Icon = e.icon;
              return (
                <Reveal key={e.title} delay={0.1 + i * 0.07}>
                  <div className="flex gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                      <Icon className="size-4.5" aria-hidden />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-semibold text-ink">{e.title}</h2>
                      <p className="mt-0.5 text-sm text-body">{e.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
        <Reveal delay={0.15}>
          <BookDemoForm />
        </Reveal>
      </div>
    </section>
  );
}
