"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { BillingCycle, Plan } from "@/lib/types";
import { ORGANIZATION, SUBSCRIPTION } from "@/lib/data/mock";

/**
 * Demo session/entitlement state. In production this comes from the auth
 * session + billing backend; the UI only ever reads this shape.
 */
export interface AppState {
  plan: Plan;
  cycle: BillingCycle;
  orgName: string;
  userName: string;
  setPlan: (p: Plan) => void;
  setCycle: (c: BillingCycle) => void;
}

const Ctx = createContext<AppState | null>(null);
const KEY = "rehaxvr-demo-state";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<Plan>(SUBSCRIPTION.plan);
  const [cycle, setCycleState] = useState<BillingCycle>(SUBSCRIPTION.cycle);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.plan === "PRO" || parsed.plan === "MAX") setPlanState(parsed.plan);
        if (parsed.cycle === "MONTHLY" || parsed.cycle === "YEARLY")
          setCycleState(parsed.cycle);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((p: Plan, c: BillingCycle) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ plan: p, cycle: c }));
    } catch {
      /* ignore */
    }
  }, []);

  const setPlan = useCallback(
    (p: Plan) => {
      setPlanState(p);
      setCycleState((c) => {
        persist(p, c);
        return c;
      });
    },
    [persist]
  );

  const setCycle = useCallback(
    (c: BillingCycle) => {
      setCycleState(c);
      setPlanState((p) => {
        persist(p, c);
        return p;
      });
    },
    [persist]
  );

  const value = useMemo(
    () => ({
      plan,
      cycle,
      orgName: ORGANIZATION.name,
      userName: ORGANIZATION.adminName,
      setPlan,
      setCycle,
    }),
    [plan, cycle, setPlan, setCycle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
