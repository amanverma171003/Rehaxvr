export type Plan = "PRO" | "MAX";
export type BillingCycle = "MONTHLY" | "YEARLY";

export type BodyArea =
  | "Elbow"
  | "Knee"
  | "Shoulder"
  | "Hip"
  | "Neck"
  | "Upper Limb"
  | "Bilateral";

export type MovementPlane = "Sagittal" | "Frontal" | "Transverse";

export type GameStatus = "AVAILABLE" | "COMING_SOON";

export interface Game {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bodyArea: BodyArea;
  targetJoint: string;
  movement: string;
  movementPlane: MovementPlane;
  targetAngle: string;
  objective: string;
  plans: Plan[]; // plans that include this game
  status: GameStatus;
  accent: string; // per-game accent hue for artwork
}

export type Entitlement =
  | "INCLUDED"
  | "UPGRADE_REQUIRED"
  | "LOCKED"
  | "COMING_SOON";

export type PatientStatus = "ACTIVE" | "ON_HOLD" | "DISCHARGED" | "ARCHIVED";

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  condition: string;
  program: string;
  status: PatientStatus;
  therapist: string;
  lastSession: string | null; // ISO
  nextSession: string | null;
  totalSessions: number;
  adherence: number; // 0-100
  romProgress: number; // 0-100 toward target
  romCurrent: number; // degrees
  romTarget: number;
  romBaseline: number;
  primaryGameId: string;
  startedAt: string;
  notes: string;
}

export type SessionStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  gameId: string;
  gameName: string;
  therapist: string;
  startedAt: string; // ISO
  durationMin: number;
  reps: number;
  targetReps: number;
  peakRom: number;
  targetRom: number;
  smoothness: number; // 0-100
  quality: number; // 0-100
  painLevel: number | null; // 0-10
  status: SessionStatus;
  compensations: string[];
}

export type Role = "ADMIN" | "THERAPIST" | "STAFF";
export type MemberStatus = "ACTIVE" | "PENDING" | "DEACTIVATED";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  joinedAt: string | null;
  lastActive: string | null;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  currency: string;
  status: "PAID" | "OPEN" | "FAILED";
  plan: Plan;
  cycle: BillingCycle;
}

export interface Subscription {
  plan: Plan;
  cycle: BillingCycle;
  status: "ACTIVE" | "PAST_DUE" | "CANCELLED";
  renewsAt: string;
  startedAt: string;
  seatsUsed: number;
  stations: number;
}

// -----------------------------------------------------------------------------
// Onboarding domain types — shape returned by get_onboarding_state RPC and
// consumed by the wizard/useAuth. Kept minimal on purpose; downstream code
// should query specific tables rather than treating these as full DB rows.
// -----------------------------------------------------------------------------
export interface Organization {
  id: string;
  name: string;
  slug: string;
  orgType: "rehab" | "clinic" | "hospital" | "multi";
  location: string | null;
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED";
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  onboardedAt: string | null;
  onboardingOrganizationId: string | null;
}

export interface OnboardingState {
  onboardedAt: string | null;
  organization: {
    id: string;
    name: string;
    org_type: string;
    location: string | null;
  } | null;
  profile: { fullName: string | null };
  subscription: {
    plan_code: Plan;
    interval: BillingCycle;
    status: "INCOMPLETE" | "ACTIVE" | "TRIALING" | "PAST_DUE" | "UNPAID" | "CANCELLED";
  } | null;
}
