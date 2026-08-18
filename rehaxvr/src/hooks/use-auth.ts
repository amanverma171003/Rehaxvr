"use client";
// Subscribes to Supabase auth state and exposes {user, session, loading, onboarded, organizationId, signOut}.
// Import this hook only inside Client Components.

import { useEffect, useState } from "react";
import { type User, type Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signOut as serverSignOut } from "@/lib/auth/actions";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  // Onboarding gate — mirrors what middleware uses so client-side redirects
  // (e.g. from /app pages) don't have to re-query the DB.
  onboarded: boolean;
  organizationId: string | null;
}

export function useAuth(): AuthState & { signOut: () => Promise<void> } {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    onboarded: false,
    organizationId: null,
  });

  useEffect(() => {
    const supabase = createClient();

    // Helper that pulls the same session context the middleware uses so the
    // client agrees with the server on whether onboarding is complete.
    async function refresh(session: Session | null) {
      if (!session?.user) {
        setState({ user: null, session: null, loading: false, onboarded: false, organizationId: null });
        return;
      }
      const { data } = await supabase.rpc("get_session_context");
      const row = Array.isArray(data) ? data[0] : data;
      setState({
        user: session.user,
        session,
        loading: false,
        onboarded: !!row?.onboarded_at,
        organizationId: row?.organization_id ?? null,
      });
    }

    supabase.auth.getSession().then(({ data: { session } }) => refresh(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      refresh(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { ...state, signOut: serverSignOut };
}
