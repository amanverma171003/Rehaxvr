import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TimerOff } from "lucide-react";

export default function SessionExpiredPage() {
  return (
    <div className="text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-warning/10 text-warning">
        <TimerOff className="size-7" aria-hidden />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
        Your session has expired
      </h1>
      <p className="mt-2 text-sm text-body">
        For security, we sign you out after a period of inactivity. Your work
        is saved — just sign back in to pick up where you left off.
      </p>
      <Button size="lg" className="mt-6 w-full" asChild>
        <Link href="/login?reason=expired">Sign in again</Link>
      </Button>
    </div>
  );
}
