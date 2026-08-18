"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntitlementBadge } from "@/components/shared/badges";
import { useAppState } from "@/components/app-state";
import { PATIENTS } from "@/lib/data/mock";
import { GAMES, getEntitlement } from "@/lib/data/games";
import { Play, Radio } from "lucide-react";

export function StartSessionDialog({
  open,
  onOpenChange,
  defaultPatientId,
  defaultGameId,
  onUpgrade,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPatientId?: string;
  defaultGameId?: string;
  onUpgrade?: () => void;
}) {
  const router = useRouter();
  const { plan } = useAppState();
  const [patientId, setPatientId] = useState(defaultPatientId ?? "");
  const [gameId, setGameId] = useState(defaultGameId ?? "");
  const [duration, setDuration] = useState("15");

  const activePatients = PATIENTS.filter((p) => p.status === "ACTIVE");
  const game = GAMES.find((g) => g.id === gameId);
  const entitlement = game ? getEntitlement(game, plan) : null;
  const blocked = entitlement === "UPGRADE_REQUIRED" || entitlement === "LOCKED";

  const patient = useMemo(
    () => PATIENTS.find((p) => p.id === patientId),
    [patientId]
  );

  const start = () => {
    onOpenChange(false);
    router.push(`/app/sessions/live?patient=${patientId}&game=${gameId}&min=${duration}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="size-5 text-primary" aria-hidden />
            Start a therapy session
          </DialogTitle>
          <DialogDescription>
            Choose the patient and game module. The station takes over from there.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ss-patient">Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger id="ss-patient" className="mt-1.5 w-full">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {activePatients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                    <span className="text-muted-foreground"> · {p.program}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ss-game">Game module</Label>
            <Select value={gameId} onValueChange={setGameId}>
              <SelectTrigger id="ss-game" className="mt-1.5 w-full">
                <SelectValue placeholder="Select game" />
              </SelectTrigger>
              <SelectContent>
                {GAMES.map((g) => {
                  const ent = getEntitlement(g, plan);
                  return (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                      {ent === "UPGRADE_REQUIRED" && (
                        <span className="text-muted-foreground"> · MAX</span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {game && entitlement && (
              <div className="mt-2 flex items-center gap-2">
                <EntitlementBadge entitlement={entitlement} />
                <span className="text-xs text-muted-foreground">
                  {game.targetJoint} · {game.movement}
                </span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="ss-duration">Target duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="ss-duration" className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {blocked && game && (
            <div className="rounded-lg border border-primary/25 bg-accent/60 px-3.5 py-3 text-sm text-primary-dark">
              <p className="font-medium">{game.name} is available with MAX.</p>
              <p className="mt-0.5 text-xs text-body">
                Upgrade your subscription to launch this module — it unlocks instantly.
              </p>
            </div>
          )}

          {patient && game && !blocked && (
            <div className="rounded-lg bg-surface-muted px-3.5 py-3 text-xs text-body">
              <span className="font-medium text-ink">{patient.name}</span> will
              play <span className="font-medium text-ink">{game.name}</span> targeting{" "}
              {game.movement.toLowerCase()} for {duration} minutes. Target ROM:{" "}
              <span className="num font-medium text-ink">{patient.romTarget}°</span>.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {blocked ? (
            <Button
              onClick={() => {
                onOpenChange(false);
                onUpgrade?.();
              }}
            >
              Upgrade to MAX
            </Button>
          ) : (
            <Button onClick={start} disabled={!patientId || !gameId}>
              <Play data-icon="inline-start" aria-hidden />
              Start session
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
