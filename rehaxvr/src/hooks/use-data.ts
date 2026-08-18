"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useOrganization() {
  return useQuery({ queryKey: ["organization"], queryFn: api.getOrganization });
}

export function useSubscription() {
  return useQuery({ queryKey: ["subscription"], queryFn: api.getSubscription });
}

export function useGames() {
  return useQuery({ queryKey: ["games"], queryFn: api.getGames });
}

export function usePatients() {
  return useQuery({ queryKey: ["patients"], queryFn: api.getPatients });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => api.getPatient(id),
  });
}

export function useSessions() {
  return useQuery({ queryKey: ["sessions"], queryFn: api.getSessions });
}

export function usePatientSessions(patientId: string) {
  return useQuery({
    queryKey: ["sessions", "patient", patientId],
    queryFn: () => api.getSessionsForPatient(patientId),
  });
}

export function useTeam() {
  return useQuery({ queryKey: ["team"], queryFn: api.getTeam });
}

export function useInvoices() {
  return useQuery({ queryKey: ["invoices"], queryFn: api.getInvoices });
}

export function useAnalytics() {
  return useQuery({ queryKey: ["analytics"], queryFn: api.getAnalytics });
}
