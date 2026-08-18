"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Camera,
  Gamepad2,
  LineChart,
  Move3d,
  PersonStanding,
} from "lucide-react";
import { Reveal } from "@/components/shared/page-primitives";

const STEPS = [
  {
    icon: PersonStanding,
    title: "Patient movement",
    text: "The patient simply moves in front of a standard camera. No sensors, no suits, no controllers.",
  },
  {
    icon: Camera,
    title: "Computer vision",
    text: "Markerless pose estimation tracks the body in real time on low-cost edge hardware.",
  },
  {
    icon: Move3d,
    title: "3D joint data",
    text: "Key joints become continuous 3D positions — the skeleton of every exercise.",
  },
  {
    icon: Activity,
    title: "Biomechanical analysis",
    text: "ROM, angular velocity, smoothness and compensation patterns are computed live.",
  },
  {
    icon: Gamepad2,
    title: "Game interaction",
    text: "Clean movement drives the game. Every repetition is earned through correct form.",
  },
  {
    icon: LineChart,
    title: "Therapy telemetry",
    text: "Reps, ROM, quality and adherence flow into the therapist's analytics automatically.",
  },
];

export function Pipeline() {
  return (
    <div className="relative">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} delay={i * 0.07}>
              <div className="group relative h-full rounded-xl border border-border bg-white p-5 card-hover">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-4.5" aria-hidden />
                  </div>
                  <span className="num text-xs font-semibold text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">
                  {step.text}
                </p>
                {i < STEPS.length - 1 && (
                  <motion.div
                    className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-border-strong lg:block"
                    aria-hidden
                  >
                    {(i + 1) % 3 !== 0 && (
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                        <path d="M0 6h16m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </motion.div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
