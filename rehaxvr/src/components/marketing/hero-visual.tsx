"use client";

import { motion } from "framer-motion";
import { MotionSkeleton } from "@/components/brand/motion-skeleton";
import { RomGauge } from "@/components/brand/rom-gauge";
import { Activity, Camera, Repeat } from "lucide-react";

/**
 * Hero product visualization: dark tracking canvas with animated skeleton,
 * floating telemetry chips and a live ROM gauge.
 */
export function HeroVisual() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-8 rounded-[32px] bg-cyan/20 blur-3xl opacity-40"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-canvas grid-canvas shadow-2xl shadow-canvas/40">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#8CABC4]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            LIVE TRACKING — STATION 02
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8CABC4]">
            <Camera className="size-3.5" aria-hidden />
            30 fps · markerless
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 p-4 sm:p-6">
          {/* skeleton stage */}
          <div className="relative h-[300px] sm:h-[340px]">
            <MotionSkeleton className="mx-auto h-full max-w-[240px]" />

            {/* floating telemetry chips */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute left-0 top-8 rounded-lg border border-white/10 bg-canvas-deep/90 px-2.5 py-1.5 backdrop-blur"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#8CABC4]">
                <Repeat className="size-3 text-teal" aria-hidden /> Reps
              </div>
              <div className="num text-lg font-semibold text-white">
                14<span className="text-xs text-[#8CABC4]"> / 20</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute bottom-10 left-0 rounded-lg border border-white/10 bg-canvas-deep/90 px-2.5 py-1.5 backdrop-blur"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#8CABC4]">
                <Activity className="size-3 text-cyan" aria-hidden /> Smoothness
              </div>
              <div className="num text-lg font-semibold text-white">
                92<span className="text-xs text-[#8CABC4]">%</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute right-0 top-24 hidden rounded-lg border border-teal/30 bg-canvas-deep/90 px-2.5 py-1.5 backdrop-blur sm:block"
            >
              <div className="text-[10px] font-medium uppercase tracking-wider text-teal">
                Form check
              </div>
              <div className="text-xs font-medium text-white">No compensation</div>
            </motion.div>
          </div>

          {/* right rail: gauge */}
          <div className="hidden w-40 flex-col justify-center gap-4 sm:flex">
            <RomGauge value={128} target={160} label="Shoulder abduction" />
            <div className="rounded-lg border border-white/10 bg-canvas-deep/80 p-3">
              <div className="text-[10px] font-medium uppercase tracking-wider text-[#8CABC4]">
                Game
              </div>
              <div className="mt-0.5 text-sm font-semibold text-white">Wing Flight</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan to-teal"
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <div className="mt-1.5 num text-[11px] text-[#8CABC4]">
                Session 70% · 08:24
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
