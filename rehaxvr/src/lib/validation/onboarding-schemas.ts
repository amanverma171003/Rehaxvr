// Single source of truth for onboarding wizard schemas.
// Used by both client (form validation) and server actions (safeParse) so
// nothing about a request can be trusted just because the wizard sent it.
import { z } from "zod";

// step 1 : organization details collected in the wizard
// stations is optional in the UI (the placeholder literally says "Optional").
// useCase is NOT on this step — it lives in profileStepSchema below.
export const organizationStepSchema = z.object({
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  // Values must match the check constraint on organizations.org_type.
  orgType: z.enum(["rehab", "clinic", "hospital", "multi"], "Select an organization type"),
  // stations is a "planned range" not a count — optional per the UI.
  stations: z.enum(["1-2", "3-5", "6-15", "16+"]).optional().or(z.literal("")),
});

// step 2 : the admin's profile + primary use case
export const profileStepSchema = z.object({
  adminName: z.string().min(2, "Full name must be at least 2 characters"),
  useCase: z.enum(["ortho", "neuro", "geriatric", "mixed"], "Select a primary use case"),
});

// step 3 : plan + billing cycle — must map to a seeded plan_prices row
export const planStepSchema = z.object({
  plan: z.enum(["PRO", "MAX"]),
  cycle: z.enum(["MONTHLY", "YEARLY"]),
});

// step 5 : a single invitation row (used both in-array and standalone for resend)
export const inviteSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  role: z.enum(["ADMIN", "THERAPIST", "STAFF"]),
});

// step 5 : the whole list — capped so a caller can't submit thousands of rows
export const invitesStepSchema = z.object({
  invites: z.array(inviteSchema).max(50, "Too many invitations at once"),
});

export type OrganizationStepInput = z.infer<typeof organizationStepSchema>;
export type ProfileStepInput = z.infer<typeof profileStepSchema>;
export type PlanStepInput = z.infer<typeof planStepSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;
export type InvitesStepInput = z.infer<typeof invitesStepSchema>;
