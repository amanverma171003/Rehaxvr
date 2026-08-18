import type { Metadata } from "next";
import { AppSidebar } from "@/components/app/sidebar";
import { AppTopbar } from "@/components/app/topbar";
import { AppStateProvider } from "@/components/app-state";

export const metadata: Metadata = { title: "Dashboard" };

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppStateProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="lg:pl-60">
          <AppTopbar />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
        </div>
      </div>
    </AppStateProvider>
  );
}
