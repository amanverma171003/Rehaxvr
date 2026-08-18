import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types";

/**
 * Placeholder game artwork — abstract "therapy module" visuals built from
 * the game's movement pattern, rendered on a dark canvas with the game's
 * accent hue. Swappable for real screenshots without layout changes.
 */
export function GameArt({
  game,
  className,
}: {
  game: Game;
  className?: string;
}) {
  const a = game.accent;
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-canvas grid-canvas",
        className
      )}
      role="img"
      aria-label={`${game.name} — ${game.movement} module preview`}
    >
      <svg viewBox="0 0 400 200" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`glow-${game.id}`} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor={a} stopOpacity="0.32" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="200" fill={`url(#glow-${game.id})`} />
        <MovementGlyph game={game} />
        {/* telemetry ticks */}
        <g fill="rgba(240,247,252,0.5)" fontSize="9" fontFamily="var(--font-geist-mono)">
          <text x="16" y="24">{game.targetJoint.toUpperCase()}</text>
          <text x="16" y="186">{game.movementPlane.toUpperCase()} PLANE</text>
          <text x="384" y="24" textAnchor="end">{game.targetAngle}</text>
        </g>
        <g stroke="rgba(34,211,238,0.4)" strokeWidth="1.4">
          <path d="M10 16 v-6 h6" /> <path d="M390 16 v-6 h-6" />
          <path d="M10 184 v6 h6" /> <path d="M390 184 v6 h-6" />
        </g>
      </svg>
    </div>
  );
}

function MovementGlyph({ game }: { game: Game }) {
  const a = game.accent;
  const joint = (cx: number, cy: number, r = 5) => (
    <>
      <circle cx={cx} cy={cy} r={r + 5} fill={a} opacity="0.22" />
      <circle cx={cx} cy={cy} r={r} fill="#0B1F33" stroke={a} strokeWidth="2.4" />
    </>
  );
  const arc = (d: string) => (
    <path d={d} stroke={a} strokeWidth="2" strokeDasharray="4 6" fill="none" opacity="0.75" />
  );
  const bone = { stroke: "#7FB8CC", strokeWidth: 3.4, strokeLinecap: "round" as const };

  switch (game.id) {
    case "g-apple": // elbow flexion arc
      return (
        <g>
          <line x1="150" y1="150" x2="200" y2="95" {...bone} />
          <line x1="200" y1="95" x2="262" y2="120" {...bone} />
          {arc("M 262 120 A 66 66 0 0 0 232 44")}
          {joint(150, 150)}
          {joint(200, 95, 6)}
          {joint(262, 120)}
          <circle cx="238" cy="50" r="9" fill={a} opacity="0.9" />
          <path d="M238 42 q3 -6 8 -7" stroke="#7FB8CC" strokeWidth="2" fill="none" />
        </g>
      );
    case "g-pedal": // knee cycle
      return (
        <g>
          <circle cx="200" cy="112" r="46" stroke={a} strokeWidth="2" strokeDasharray="5 7" opacity="0.8" />
          <line x1="200" y1="112" x2="232" y2="80" {...bone} />
          <line x1="232" y1="80" x2="284" y2="96" {...bone} />
          {joint(200, 112, 6)}
          {joint(232, 80)}
          {joint(284, 96)}
        </g>
      );
    case "g-wing": // shoulder abduction wings
      return (
        <g>
          <line x1="200" y1="70" x2="200" y2="150" {...bone} />
          <line x1="200" y1="90" x2="128" y2="60" {...bone} />
          <line x1="200" y1="90" x2="272" y2="60" {...bone} />
          {arc("M 272 60 A 78 78 0 0 1 258 138")}
          {arc("M 128 60 A 78 78 0 0 0 142 138")}
          {joint(200, 90, 6)}
          {joint(128, 60)}
          {joint(272, 60)}
          {joint(200, 150, 4)}
        </g>
      );
    case "g-step": // stairs + hip
      return (
        <g>
          <path d="M120 156 h44 v-24 h44 v-24 h44 v-24 h44" stroke={a} strokeWidth="2.4" opacity="0.8" fill="none" />
          <line x1="196" y1="70" x2="196" y2="110" {...bone} />
          <line x1="196" y1="110" x2="228" y2="128" {...bone} />
          {joint(196, 70, 4)}
          {joint(196, 110, 6)}
          {joint(228, 128)}
        </g>
      );
    case "g-wood": // neck nod
      return (
        <g>
          <circle cx="200" cy="76" r="22" stroke="#7FB8CC" strokeWidth="3" fill="rgba(255,255,255,0.03)" />
          <line x1="200" y1="98" x2="200" y2="152" {...bone} />
          {arc("M 226 60 A 36 36 0 0 1 226 96")}
          {joint(200, 104, 6)}
          <path d="M222 74 l16 5 -16 6 z" fill={a} opacity="0.9" />
        </g>
      );
    case "g-metronome": // lateral tilt
      return (
        <g>
          <path d="M176 152 L200 64 L224 152 Z" stroke={a} strokeWidth="2.2" fill="rgba(255,255,255,0.02)" opacity="0.85" />
          <line x1="200" y1="142" x2="236" y2="82" {...bone} />
          {arc("M 236 82 A 68 68 0 0 0 164 82")}
          {joint(200, 142, 6)}
          {joint(236, 82)}
        </g>
      );
    case "g-owl": // rotation
      return (
        <g>
          <circle cx="200" cy="104" r="34" stroke="#7FB8CC" strokeWidth="3" fill="rgba(255,255,255,0.03)" />
          <circle cx="188" cy="98" r="7" stroke={a} strokeWidth="2.4" />
          <circle cx="214" cy="98" r="7" stroke={a} strokeWidth="2.4" />
          <circle cx="190" cy="98" r="2.4" fill={a} />
          <circle cx="216" cy="98" r="2.4" fill={a} />
          {arc("M 148 128 A 62 62 0 0 1 148 78")}
          {arc("M 252 78 A 62 62 0 0 1 252 128")}
          <path d="M148 78 l-6 10 M252 128 l6 -10" stroke={a} strokeWidth="2" />
        </g>
      );
    case "g-balloon": // reach targets
      return (
        <g>
          {[
            [140, 66, 13],
            [212, 48, 10],
            [278, 76, 12],
            [246, 120, 9],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} stroke={a} strokeWidth="2.2" fill={`${a}22`} />
              <path d={`M${x} ${y + r} q 3 8 -2 14`} stroke="#7FB8CC" strokeWidth="1.6" fill="none" />
            </g>
          ))}
          <line x1="150" y1="158" x2="196" y2="120" {...bone} />
          <line x1="196" y1="120" x2="238" y2="128" {...bone} />
          {joint(150, 158)}
          {joint(196, 120, 6)}
          {joint(238, 128)}
        </g>
      );
    case "g-goal": // goal + bilateral hands
    default:
      return (
        <g>
          <path d="M120 150 v-70 h160 v70" stroke="#7FB8CC" strokeWidth="3" fill="none" />
          <path d="M120 80 h160 M160 80 v70 M200 80 v70 M240 80 v70" stroke="rgba(127,184,204,0.3)" strokeWidth="1.4" />
          <circle cx="200" cy="118" r="11" stroke={a} strokeWidth="2.6" fill={`${a}26`} />
          {joint(146, 104, 6)}
          {joint(254, 104, 6)}
          {arc("M 146 104 A 54 54 0 0 1 200 62")}
          {arc("M 254 104 A 54 54 0 0 0 200 62")}
        </g>
      );
  }
}
