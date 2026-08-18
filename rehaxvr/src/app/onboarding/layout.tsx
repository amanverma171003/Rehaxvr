import { Logo } from "@/components/brand/logo";
import { signOut } from "@/lib/auth/actions";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-8">
        <Logo href="/" />
        {/* Each wizard step already persists on "Continue", so the state is
            "saved" the moment the user gets to this button. Signing out is
            what actually lets them leave — a plain link to /login would be
            bounced back here by middleware while the session is still valid. */}
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Save & exit
          </button>
        </form>
      </header>
      <main className="flex-1 px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
