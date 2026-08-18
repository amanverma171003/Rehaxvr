import {
  ADHERENCE_TREND,
  COMPLETION_TREND,
  GAME_UTILIZATION,
  INVOICES,
  ORGANIZATION,
  PATIENTS,
  ROM_TREND,
  SESSIONS,
  SUBSCRIPTION,
  TEAM,
} from "@/lib/data/mock";
import { GAMES } from "@/lib/data/games";

/**
 * Data access layer. Every function returns a Promise so swapping the
 * mock implementation for real HTTP calls requires no UI changes.
 */
const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async getOrganization() {
    await delay(300);
    return ORGANIZATION;
  },
  async getSubscription() {
    await delay(350);
    return SUBSCRIPTION;
  },
  async getGames() {
    await delay(400);
    return GAMES;
  },
  async getPatients() {
    await delay(500);
    return PATIENTS;
  },
  async getPatient(id: string) {
    await delay(400);
    return PATIENTS.find((p) => p.id === id) ?? null;
  },
  async getSessions() {
    await delay(500);
    return SESSIONS;
  },
  async getSessionsForPatient(patientId: string) {
    await delay(400);
    return SESSIONS.filter((s) => s.patientId === patientId);
  },
  async getTeam() {
    await delay(400);
    return TEAM;
  },
  async getInvoices() {
    await delay(400);
    return INVOICES;
  },
  async getAnalytics() {
    await delay(600);
    return {
      romTrend: ROM_TREND,
      completionTrend: COMPLETION_TREND,
      gameUtilization: GAME_UTILIZATION,
      adherenceTrend: ADHERENCE_TREND,
    };
  },
};
