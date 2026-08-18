"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MotionSkeleton } from "@/components/brand/motion-skeleton";
import { RomGauge } from "@/components/brand/rom-gauge";
import { PATIENTS } from "@/lib/data/mock";
import { getGame, GAMES } from "@/lib/data/games";
import { Camera, CheckCircle2, Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";

/**
 * Live therapy session view. The "telemetry" is a deterministic simulation
 * driving the same UI a real vision engine would feed.
 */
export function LiveSession() {
  const router = useRouter();
  const params = useSearchParams();

  const patient =
    PATIENTS.find((p) => p.id === params.get("patient")) ?? PATIENTS[0];
  const game = getGame(params.get("game") ?? "") ?? GAMES[2];
  const targetMinutes = Number(params.get("min") ?? 15);

  const targetReps = 20;
  const targetRom = patient.romTarget;

  const [running, setRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState(0); // continuous motion phase
  const [reps, setReps] = useState(0);
  const [peak, setPeak] = useState(0);
  const [endOpen, setEndOpen] = useState(false);
  const lastRepPhase = useRef(0);

  // simulation clock
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed((e) => e + 0.1);
      setPhase((p) => p + 0.1);
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  // current joint angle follows a smooth oscillation toward target
  const cycleSeconds = 4.2;
  const cycle = (phase % cycleSeconds) / cycleSeconds;
  const amplitude = Math.min(0.92, 0.72 + phase / 600);
  const angle = Math.max(
    0,
    Math.round(targetRom * amplitude * 0.5 * (1 - Math.cos(cycle * Math.PI * 2)))
  );

  useEffect(() => {
    if (angle > peak) setPeak(angle);
    // count a rep at the top of each cycle
    const currentCycle = Math.floor(phase / cycleSeconds);
    if (currentCycle > lastRepPhase.current && running) {
      lastRepPhase.current = currentCycle;
      setReps((r) => Math.min(r + 1, targetReps));
    }
  }, [angle, peak, phase, running]);

  const quality = Math.min(96, 78 + Math.floor(phase / 20));
  const smoothness = Math.min(94, 74 + Math.floor(phase / 15));
  const progress = Math.min((elapsed / (targetMinutes * 60)) * 100, 100);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(Math.floor(elapsed % 60)).padStart(2, "0");

  const done = reps >= targetReps;

  const endSession = (completed: boolean) => {
    toast.success(completed ? "Session completed" : "Session ended", {
      description: `${patient.name} · ${game.name} · ${reps} reps · peak ${peak}° — telemetry saved.`,
    });
    router.push(`/app/patients/${patient.id}`);
  };

  const gaugeMax = useMemo(() => Math.max(targetRom + 20, 60), [targetRom]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas text-white">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-cyan" />
          </span>
          <div>
            <p className="text-sm font-semibold">{game.name}</p>
            <p className="text-xs text-[#8CABC4]">
              {patient.name} · {game.movement} · Station 02
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8CABC4]">
          <Camera className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Markerless tracking · 30 fps</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? (
              <>
                <Pause data-icon="inline-start" aria-hidden /> Pause
              </>
            ) : (
              <>
                <Play data-icon="inline-start" aria-hidden /> Resume
              </>
            )}
          </Button>
          <Button
            size="sm"
            className="bg-danger text-white hover:bg-danger/85"
            onClick={() => setEndOpen(true)}
          >
            <Square data-icon="inline-start" aria-hidden />
            End session
          </Button>
        </div>
      </header>

      {/* Stage */}
      <div className="relative flex flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-canvas" aria-hidden />
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan/8 blur-3xl"
          aria-hidden
        />

        {/* Center: skeleton */}
        <div className="relative flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-[300px] sm:max-w-[340px]">
            <MotionSkeleton className="h-[52vh] min-h-[300px]" animate={running} />
          </div>

          {/* form banner */}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-teal/40 bg-teal/15 px-4 py-2 text-sm font-medium text-teal backdrop-blur"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                Rep target reached — great session!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right rail: telemetry */}
        <aside className="hidden w-72 flex-col gap-3 overflow-y-auto border-l border-white/10 bg-canvas-deep/60 p-4 backdrop-blur md:flex">
          <div className="rounded-xl border border-white/10 bg-canvas-deep/80 p-4">
            <RomGauge
              value={angle}
              target={targetRom}
              max={gaugeMax}
              label={game.movement}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-canvas-deep/80 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#8CABC4]">
              Repetitions
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <motion.span
                key={reps}
                initial={{ scale: 1.25, color: "#22D3EE" }}
                animate={{ scale: 1, color: "#FFFFFF" }}
                className="num text-4xl font-bold"
              >
                {reps}
              </motion.span>
              <span className="num text-lg text-[#8CABC4]">/ {targetReps}</span>
            </div>
            <div className="mt-2.5 flex gap-1" aria-hidden>
              {Array.from({ length: targetReps }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i < reps ? "bg-gradient-to-r from-cyan to-teal" : "bg-white/10"}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-canvas-deep/80 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#8CABC4]">
                Peak ROM
              </p>
              <p className="num mt-0.5 text-xl font-semibold">{peak}°</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-canvas-deep/80 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#8CABC4]">
                Quality
              </p>
              <p className="num mt-0.5 text-xl font-semibold">{quality}%</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-canvas-deep/80 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#8CABC4]">
                Smoothness
              </p>
              <p className="num mt-0.5 text-xl font-semibold">{smoothness}%</p>
            </div>
            <div className="rounded-xl border border-teal/30 bg-teal/10 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-teal">
                Form
              </p>
              <p className="mt-0.5 text-sm font-medium text-white">
                No compensation
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom bar */}
      <footer className="border-t border-white/10 bg-canvas-deep/70 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-4">
          <span className="num text-lg font-semibold tabular-nums">
            {mm}:{ss}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-teal"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-[#8CABC4]">
            {targetMinutes} min target
          </span>
          <span
            className={`hidden rounded-md px-2 py-1 text-[11px] font-medium sm:inline ${
              running
                ? "bg-cyan/15 text-cyan"
                : "bg-warning/15 text-warning"
            }`}
          >
            {running ? "IN PROGRESS" : "PAUSED"}
          </span>
        </div>
        {/* mobile telemetry strip */}
        <div className="mt-2.5 grid grid-cols-4 gap-2 md:hidden">
          {[
            ["Angle", `${angle}°`],
            ["Reps", `${reps}/${targetReps}`],
            ["Peak", `${peak}°`],
            ["Quality", `${quality}%`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-white/5 px-2 py-1.5 text-center">
              <p className="text-[9px] uppercase tracking-wider text-[#8CABC4]">{k}</p>
              <p className="num text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </footer>

      {/* End confirmation */}
      <AlertDialog open={endOpen} onOpenChange={setEndOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this session?</AlertDialogTitle>
            <AlertDialogDescription>
              {patient.name} has completed {reps} of {targetReps} repetitions
              with a peak range of {peak}°. Telemetry recorded so far will be
              saved to their session history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep going</AlertDialogCancel>
            <AlertDialogAction onClick={() => endSession(done)}>
              End & save session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
