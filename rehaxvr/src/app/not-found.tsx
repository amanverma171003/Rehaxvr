import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div>
        <p className="num text-6xl font-semibold text-border-strong">404</p>
        <h1 className="mt-3 text-xl font-semibold text-ink">
          This page took a wrong turn
        </h1>
        <p className="mt-1.5 max-w-sm text-sm text-body">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Back to website</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/app">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
