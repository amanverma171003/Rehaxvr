"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Semi-circular ROM gauge. `value`/`target` in degrees.
 * Used on dark visualization surfaces (live session, hero).
 */
export function RomGauge({
  value,
  target,
  max = 180,
  label = "Range of motion",
  className,
  light = false,
}: {
  value: number;
  target: number;
  max?: number;
  label?: string;
  className?: string;
  light?: boolean;
}) {
  const r = 54;
  const c = Math.PI * r; // semicircle length
  const pct = Math.min(value / max, 1);
  const targetPct = Math.min(target / max, 1);
  const targetAngle = 180 - targetPct * 180;
  const tx = 70 + r * Math.cos((targetAngle * Math.PI) / 180);
  const ty = 70 - r * Math.sin((targetAngle * Math.PI) / 180);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg viewBox="0 0 140 84" className="w-full" role="img" aria-label={`${label}: ${value} of ${target} degrees target`}>
        <path
          d={`M 16 70 A ${r} ${r} 0 0 1 124 70`}
          fill="none"
          stroke={light ? "#D9E2EC" : "rgba(148,196,214,0.2)"}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <motion.path
          d={`M 16 70 A ${r} ${r} 0 0 1 124 70`}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        {/* target tick */}
        <circle cx={tx} cy={ty} r="3.4" fill={light ? "#0E7490" : "#fff"} stroke="#14B8A6" strokeWidth="2" />
        <text
          x="70"
          y="58"
          textAnchor="middle"
          className="num"
          fontSize="24"
          fontWeight="700"
          fill={light ? "#102A43" : "#F0F7FC"}
        >
          {Math.round(value)}°
        </text>
        <text
          x="70"
          y="76"
          textAnchor="middle"
          fontSize="9"
          fill={light ? "#627D98" : "#8CABC4"}
        >
          target {target}°
        </text>
      </svg>
      <span
        className={cn(
          "text-[11px] font-medium uppercase tracking-wider",
          light ? "text-muted-foreground" : "text-[#8CABC4]"
        )}
      >
        {label}
      </span>
    </div>
  );
}
