"use client";

import { useRouter } from "next/navigation";
import { PricingSection } from "@/components/shared/pricing-cards";
import { GAMES } from "@/lib/data/games";
import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/shared/page-primitives";

export function PricingClient() {
  const router = useRouter();

  return (
    <div>
      <PricingSection
        ctaLabel="Start with"
        onSelect={(plan, cycle) =>
          router.push(`/signup?plan=${plan}&cycle=${cycle}`)
        }
      />

      {/* Entitlement matrix */}
      <Reveal>
        <div className="mx-auto mt-14 max-w-4xl">
          <h2 className="text-center text-lg font-semibold text-ink">
            Game entitlement by plan
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60 text-left">
                  <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
                    Game
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
                    Movement target
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-medium text-muted-foreground">
                    PRO
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-medium text-primary-dark">
                    MAX
                  </th>
                </tr>
              </thead>
              <tbody>
                {GAMES.map((g) => (
                  <tr key={g.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{g.name}</td>
                    <td className="px-4 py-3 text-body">
                      {g.targetJoint} · {g.movement}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {g.plans.includes("PRO") ? (
                        <Check className="mx-auto size-4 text-teal" aria-label="Included in PRO" />
                      ) : (
                        <Minus className="mx-auto size-4 text-border-strong" aria-label="Not included in PRO" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center bg-accent/40">
                      <Check className="mx-auto size-4 text-primary" aria-label="Included in MAX" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Prices are configured per organization and shown at checkout.
            Entitlements can be adjusted by product configuration without UI changes.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
