import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/platform", label: "Platform" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/games", label: "Game Library" },
      { href: "/technology", label: "Technology" },
    ],
  },
  {
    title: "Commercial",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/book-demo", label: "Book a Demo" },
      { href: "/faq", label: "FAQ" },
      { href: "/signup", label: "Create Organization" },
    ],
  },
  {
    title: "Organization",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/book-demo", label: "Contact" },
      { href: "/faq", label: "Support" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              AI-powered movement rehabilitation for clinics and therapy
              organizations. Movement becomes data. Data becomes progress.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-body transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RehaxVR. All rights reserved.</p>
          <p>
            RehaxVR is a rehabilitation technology platform. It is designed to
            support therapy programs and does not replace clinical judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}
