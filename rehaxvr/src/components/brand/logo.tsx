import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="#0E7490" />
      {/* Motion arc + joint nodes */}
      <path
        d="M8 22c2.5-8 7-12.5 16-12.5"
        stroke="#22D3EE"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="8" cy="22" r="2.6" fill="#fff" />
      <circle cx="14.2" cy="13.6" r="2" fill="#7DE3F4" />
      <circle cx="24" cy="9.5" r="2.6" fill="#fff" />
    </svg>
  );
}

export function Logo({
  href = "/",
  dark = false,
  className,
}: {
  href?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 select-none", className)}
      aria-label="RehaxVR home"
    >
      <LogoMark />
      <span
        className={cn(
          "text-[17px] font-semibold tracking-tight",
          dark ? "text-white" : "text-ink"
        )}
      >
        Rehax<span className="text-primary">VR</span>
      </span>
    </Link>
  );
}
