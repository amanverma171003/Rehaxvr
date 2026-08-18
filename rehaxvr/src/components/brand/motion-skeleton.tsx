"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated markerless-tracking skeleton. The right arm sweeps through a
 * shoulder-abduction arc — the core "movement becomes data" visual.
 * Pure SVG so it can be swapped for real 3D assets later without layout changes.
 */
export function MotionSkeleton({
  className,
  animate = true,
  compact = false,
}: {
  className?: string;
  animate?: boolean;
  compact?: boolean;
}) {
  const joint = (cx: number, cy: number, r = 4, glow = false) => (
    <g>
      {glow && (
        <circle cx={cx} cy={cy} r={r + 6} fill="rgba(34,211,238,0.18)" />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#0B1F33"
        stroke="#22D3EE"
        strokeWidth="2"
      />
    </g>
  );

  const bone = "stroke-[#3FA9C4] stroke-[2.5]";

  return (
    <svg
      viewBox="0 0 220 300"
      className={cn("w-full h-full", className)}
      fill="none"
      role="img"
      aria-label="Markerless motion tracking skeleton with animated shoulder movement"
    >
      {/* tracking frame corners */}
      {!compact && (
        <g stroke="rgba(34,211,238,0.35)" strokeWidth="1.5">
          <path d="M14 26 v-12 h12" />
          <path d="M206 26 v-12 h-12" />
          <path d="M14 274 v12 h12" />
          <path d="M206 274 v12 h-12" />
        </g>
      )}

      {/* head */}
      <circle
        cx="110"
        cy="48"
        r="17"
        stroke="#3FA9C4"
        strokeWidth="2.5"
        fill="rgba(34,211,238,0.06)"
      />
      {/* spine */}
      <line x1="110" y1="65" x2="110" y2="150" className={bone} />
      {/* shoulders */}
      <line x1="78" y1="86" x2="142" y2="86" className={bone} />
      {/* left arm (static, slightly out) */}
      <line x1="78" y1="86" x2="58" y2="130" className={bone} />
      <line x1="58" y1="130" x2="52" y2="172" className={bone} />
      {/* pelvis */}
      <line x1="88" y1="150" x2="132" y2="150" className={bone} />
      {/* legs */}
      <line x1="88" y1="150" x2="82" y2="212" className={bone} />
      <line x1="82" y1="212" x2="80" y2="270" className={bone} />
      <line x1="132" y1="150" x2="138" y2="212" className={bone} />
      <line x1="138" y1="212" x2="140" y2="270" className={bone} />

      {/* animated right arm — shoulder abduction */}
      <motion.g
        style={{ originX: "142px", originY: "86px", transformBox: "view-box" }}
        animate={animate ? { rotate: [12, -78, 12] } : { rotate: -35 }}
        transition={
          animate
            ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <line x1="142" y1="86" x2="176" y2="120" className={bone} />
        <line x1="176" y1="120" x2="196" y2="156" className={bone} />
        {joint(176, 120, 4)}
        {joint(196, 156, 4, true)}
      </motion.g>

      {/* ROM arc at right shoulder */}
      <path
        d="M 174 118 A 46 46 0 0 0 178 52"
        stroke="rgba(34,211,238,0.45)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        fill="none"
      />

      {/* static joints */}
      {joint(110, 48, 3)}
      {joint(78, 86)}
      {joint(142, 86, 4, true)}
      {joint(58, 130)}
      {joint(52, 172)}
      {joint(110, 150, 3)}
      {joint(88, 150)}
      {joint(132, 150)}
      {joint(82, 212)}
      {joint(138, 212)}
      {joint(80, 270)}
      {joint(140, 270)}
    </svg>
  );
}
