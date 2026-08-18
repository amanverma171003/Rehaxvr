import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-8">
        <Logo href="/" />
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Save & exit
        </Link>
      </header>
      <main className="flex-1 px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
