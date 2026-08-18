"use client";

import { PageHeader } from "@/components/shared/page-primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, LifeBuoy, Mail, MonitorSmartphone } from "lucide-react";
import { toast } from "sonner";

const RESOURCES = [
  {
    icon: BookOpen,
    title: "Getting started guide",
    text: "Set up stations, add patients and run your first session.",
  },
  {
    icon: MonitorSmartphone,
    title: "Station setup & troubleshooting",
    text: "Camera placement, lighting and connectivity checks.",
  },
  {
    icon: LifeBuoy,
    title: "Therapist handbook",
    text: "Configuring range corridors, reading telemetry and progressing programs.",
  },
];

const FAQS = [
  {
    q: "A session isn't tracking the patient reliably. What should I check?",
    a: "Confirm the patient is fully inside the camera frame, lighting is even without strong backlight, and the station shows 'Online' in Settings → Stations. Most tracking issues are camera placement or lighting.",
  },
  {
    q: "How do I give a new therapist access?",
    a: "Go to Team → Invite Member, enter their work email and choose the Therapist role. They'll receive a secure invitation link.",
  },
  {
    q: "Why is a game showing 'Available with MAX'?",
    a: "Your organization is on the PRO plan and that module is part of the complete MAX library. An Organization Admin can upgrade from the Subscription page — it unlocks instantly.",
  },
  {
    q: "Can I export session data?",
    a: "Data export is on the roadmap. Meanwhile, all telemetry is visible per patient and per session inside the app, and our support team can prepare exports on request.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        description="Guides, answers and a human when you need one."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.title}
              onClick={() =>
                toast.info("Demo", { description: "Documentation would open here." })
              }
              className="rounded-xl border border-border bg-white p-5 text-left card-hover focus-visible:outline-2 focus-visible:outline-ring"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
                <Icon className="size-4.5" aria-hidden />
              </div>
              <h2 className="mt-3 text-[15px] font-semibold text-ink">{r.title}</h2>
              <p className="mt-1 text-[13px] text-body">{r.text}</p>
            </button>
          );
        })}
      </div>

      <Card className="gap-0 p-0">
        <CardContent className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-ink">Common questions</h2>
          <Accordion type="single" collapsible className="mt-2">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={String(i)}>
                <AccordionTrigger className="text-left text-sm font-medium text-ink">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-body">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="gap-0 p-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
              <Mail className="size-4.5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Still stuck?</p>
              <p className="text-xs text-muted-foreground">
                Our support team replies within one business day — priority for MAX organizations.
              </p>
            </div>
          </div>
          <Button
            onClick={() =>
              toast.success("Message sent", {
                description: "Support will get back to you at your work email.",
              })
            }
          >
            Contact support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
