import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/8 text-danger">
        <ShieldAlert className="size-7" aria-hidden />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
        You don&apos;t have access to this area
      </h1>
      <p className="mt-2 text-sm text-body">
        This section requires a different role — for example, subscription and
        billing are managed by your Organization Admin. If you think this is a
        mistake, ask your admin to update your role.
      </p>
      <div className="mt-6 space-y-3">
        <Button size="lg" className="w-full" asChild>
          <Link href="/app">Back to dashboard</Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/login">Sign in with a different account</Link>
        </Button>
      </div>
    </div>
  );
}
