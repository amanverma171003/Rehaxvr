import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MotionSkeleton } from "@/components/brand/motion-skeleton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-canvas p-10 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 grid-canvas" aria-hidden />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-cyan/10 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <Logo dark />
        </div>
        <div className="relative flex items-center justify-center py-6">
          <div className="w-full max-w-[240px] opacity-90">
            <MotionSkeleton className="h-[300px]" />
          </div>
        </div>
        <div className="relative">
          <blockquote className="max-w-sm text-lg font-medium leading-relaxed text-[#d7ecf5]">
            Movement becomes data. Data becomes interaction. Interaction
            becomes measurable rehabilitation progress.
          </blockquote>
          <p className="mt-4 text-sm text-[#8CABC4]">
            The rehabilitation platform for clinics and therapy organizations.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="lg:hidden">
            <Logo />
          </span>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ← Back to website
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
