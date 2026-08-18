import type { Game, Plan, Entitlement } from "@/lib/types";

/**
 * Game catalog — the entitlement mapping (`plans`) is configuration,
 * not hardcoded UI logic. PRO includes the 5 core games; MAX includes all 9.
 */
export const GAMES: Game[] = [
  {
    id: "g-apple",
    slug: "apple-pick-drop",
    name: "Apple Pick & Drop",
    tagline: "Reach, grasp and release through a full elbow arc.",
    description:
      "Patients pick virtual apples and drop them into a basket, driving controlled elbow flexion and extension. The exercise state machine counts clean repetitions and flags shoulder compensation.",
    bodyArea: "Elbow",
    targetJoint: "Elbow",
    movement: "Flexion / Extension",
    movementPlane: "Sagittal",
    targetAngle: "0° – 140°",
    objective: "Elbow ROM; biceps/triceps activation",
    plans: ["PRO", "MAX"],
    status: "AVAILABLE",
    accent: "#ef7d54",
  },
  {
    id: "g-pedal",
    slug: "pedal-power",
    name: "Pedal Power",
    tagline: "Cycle through a landscape with knee-driven power.",
    description:
      "Seated knee flexion and extension propels a virtual bicycle. Cadence, symmetry and range are measured continuously so therapists can progress resistance safely.",
    bodyArea: "Knee",
    targetJoint: "Knee",
    movement: "Flexion / Extension",
    movementPlane: "Sagittal",
    targetAngle: "0° – 120°",
    objective: "Quadriceps strengthening; lower-limb mobility",
    plans: ["PRO", "MAX"],
    status: "AVAILABLE",
    accent: "#4c9f70",
  },
  {
    id: "g-wing",
    slug: "wing-flight",
    name: "Wing Flight",
    tagline: "Glide by raising and lowering the arms like wings.",
    description:
      "Shoulder abduction and adduction control altitude in a gliding flight. Smoothness scoring encourages slow, controlled arcs instead of momentum swings.",
    bodyArea: "Shoulder",
    targetJoint: "Shoulder",
    movement: "Abduction / Adduction",
    movementPlane: "Frontal",
    targetAngle: "0° – 160°",
    objective: "Deltoid activation; shoulder rehabilitation",
    plans: ["PRO", "MAX"],
    status: "AVAILABLE",
    accent: "#5b8def",
  },
  {
    id: "g-step",
    slug: "step-climber",
    name: "Step Climber",
    tagline: "Climb a tower with alternating hip drives.",
    description:
      "Alternating hip flexion moves the character up a climbing course. Designed for gait preparation, with stance-time symmetry captured on every step.",
    bodyArea: "Hip",
    targetJoint: "Hip",
    movement: "Flexion / Extension",
    movementPlane: "Sagittal",
    targetAngle: "0° – 110°",
    objective: "Hip mobility; gait rehabilitation",
    plans: ["PRO", "MAX"],
    status: "AVAILABLE",
    accent: "#9d7bd8",
  },
  {
    id: "g-wood",
    slug: "woodpecker",
    name: "Woodpecker",
    tagline: "Peck rhythmically with controlled neck nods.",
    description:
      "Gentle cervical flexion and extension drives a woodpecker's pecking rhythm. Amplitude limits are therapist-configured to keep motion inside a safe corridor.",
    bodyArea: "Neck",
    targetJoint: "Cervical spine",
    movement: "Flexion / Extension",
    movementPlane: "Sagittal",
    targetAngle: "0° – 45°",
    objective: "Cervical mobility; posture correction",
    plans: ["PRO", "MAX"],
    status: "AVAILABLE",
    accent: "#d8973c",
  },
  {
    id: "g-metronome",
    slug: "metronome",
    name: "Metronome",
    tagline: "Tilt side to side in time with the beat.",
    description:
      "Lateral neck flexion follows a metronome's tempo, pacing lateral cervical stretching with audio-visual rhythm cues and hold-time tracking.",
    bodyArea: "Neck",
    targetJoint: "Cervical spine",
    movement: "Lateral flexion",
    movementPlane: "Frontal",
    targetAngle: "0° – 40°",
    objective: "Lateral cervical stretching",
    plans: ["MAX"],
    status: "AVAILABLE",
    accent: "#3fb8c9",
  },
  {
    id: "g-owl",
    slug: "owl-watch",
    name: "Owl Watch",
    tagline: "Rotate to spot movement across the forest.",
    description:
      "Neck rotation scans a night forest for animated targets. Rotational range and speed are logged per side to surface asymmetry over time.",
    bodyArea: "Neck",
    targetJoint: "Cervical spine",
    movement: "Rotation",
    movementPlane: "Transverse",
    targetAngle: "0° – 70°",
    objective: "Cervical rotation; stiffness relief",
    plans: ["MAX"],
    status: "AVAILABLE",
    accent: "#7a6ff0",
  },
  {
    id: "g-balloon",
    slug: "balloon-popping",
    name: "Balloon Popping",
    tagline: "Reach out and pop balloons across the field of view.",
    description:
      "Upper-limb reach targets appear across configurable zones. Reach envelope, response time and hand-eye coordination trends are captured per session.",
    bodyArea: "Upper Limb",
    targetJoint: "Shoulder / Elbow / Hand",
    movement: "Multi-directional reach",
    movementPlane: "Sagittal",
    targetAngle: "Reach envelope",
    objective: "Upper-limb extension; hand-eye coordination",
    plans: ["MAX"],
    status: "AVAILABLE",
    accent: "#e2637f",
  },
  {
    id: "g-goal",
    slug: "goalkeeper",
    name: "Goalkeeper",
    tagline: "Defend the goal with fast bilateral reaches.",
    description:
      "Bilateral hand reaching blocks incoming shots. Reaction time, left/right symmetry and coordination quality make this a strong late-stage coordination module.",
    bodyArea: "Bilateral",
    targetJoint: "Shoulders / Hands",
    movement: "Bilateral reach",
    movementPlane: "Frontal",
    targetAngle: "Reach envelope",
    objective: "Motor coordination; rapid response",
    plans: ["MAX"],
    status: "AVAILABLE",
    accent: "#38a3a5",
  },
];

export function getGame(idOrSlug: string): Game | undefined {
  return GAMES.find((g) => g.id === idOrSlug || g.slug === idOrSlug);
}

export function gamesForPlan(plan: Plan): Game[] {
  return GAMES.filter((g) => g.plans.includes(plan));
}

/** Entitlement is derived from data — never assumed by the UI. */
export function getEntitlement(game: Game, plan: Plan | null): Entitlement {
  if (game.status === "COMING_SOON") return "COMING_SOON";
  if (!plan) return "LOCKED";
  if (game.plans.includes(plan)) return "INCLUDED";
  if (game.plans.includes("MAX") && plan === "PRO") return "UPGRADE_REQUIRED";
  return "LOCKED";
}
