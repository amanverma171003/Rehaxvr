import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/page-primitives";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = { title: "FAQ" };

const FAQS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Deployment & hardware",
    items: [
      {
        q: "What hardware does a therapy station need?",
        a: "A compact mini PC, a standard RGB camera and a display. Inference runs locally on the station, so sessions stay responsive without relying on a cloud connection during play.",
      },
      {
        q: "Do patients wear any sensors or markers?",
        a: "No. RehaxVR uses markerless computer vision — patients simply move in front of the camera. There is nothing to attach, calibrate to the body, or sanitize between patients.",
      },
      {
        q: "How much space does a station need?",
        a: "A typical station works in a standard therapy bay: enough room for the patient to move the target joint freely within the camera's field of view. We confirm the exact layout during onboarding.",
      },
    ],
  },
  {
    group: "Games & therapy",
    items: [
      {
        q: "How many games are included?",
        a: "The library has nine rehabilitation games covering elbow, knee, shoulder, hip and cervical movements plus reach and coordination modules. PRO includes the five core games; MAX includes all nine.",
      },
      {
        q: "Can therapists configure difficulty and range?",
        a: "Yes. Target range corridors, repetition targets and session length are configured per patient, and the exercise state machine validates each repetition against those settings.",
      },
      {
        q: "What telemetry is captured per session?",
        a: "Range of motion, validated repetitions, movement velocity and smoothness, compensation alerts, session duration, completion and optional patient pain input.",
      },
    ],
  },
  {
    group: "Subscriptions & billing",
    items: [
      {
        q: "What is the difference between PRO and MAX?",
        a: "PRO is the core rehabilitation game suite with five games. MAX is the complete nine-game library including the cervical rotation, lateral flexion and coordination modules. Both include the full SaaS platform.",
      },
      {
        q: "Can we switch between monthly and yearly billing?",
        a: "Yes, at any time from the Subscription screen. Changes take effect at the next renewal, and the UI shows exactly when the new cycle starts before you confirm.",
      },
      {
        q: "What happens to MAX games if we downgrade to PRO?",
        a: "MAX-only games become 'Available with MAX' at the end of your current billing period. Patient history and telemetry from those games are always retained.",
      },
    ],
  },
  {
    group: "Organization & onboarding",
    items: [
      {
        q: "How does organization onboarding work?",
        a: "Create the organization account, confirm your clinic profile, choose PRO or MAX with monthly or yearly billing, review the subscription, invite your team and you're in the dashboard. Most organizations finish in under ten minutes.",
      },
      {
        q: "What roles are available for team members?",
        a: "Organization Admin (subscription, billing, team and full management), Therapist (patients, sessions, games and analytics) and Staff (operational patient and session workflows).",
      },
      {
        q: "Can we run multiple clinics under one organization?",
        a: "Yes. RehaxVR is built as multi-clinic SaaS — one organization can govern multiple locations and therapy stations under a single subscription.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="px-4 pb-16 pt-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                FAQ
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Answers before you ask.
              </h1>
              <p className="mt-4 text-lg text-body">
                Deployment, games, subscriptions and onboarding — the questions
                every clinic asks first.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 space-y-8">
            {FAQS.map((group, gi) => (
              <Reveal key={group.group} delay={gi * 0.05}>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.group}
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="mt-3 rounded-xl border border-border bg-white px-4"
                  >
                    {group.items.map((item, i) => (
                      <AccordionItem key={item.q} value={`${gi}-${i}`}>
                        <AccordionTrigger className="text-left text-[15px] font-medium text-ink">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-body">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
