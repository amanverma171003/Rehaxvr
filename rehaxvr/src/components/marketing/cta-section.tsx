import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/page-primitives";

export function CTASection({
  title = "See RehaxVR in your clinic.",
  description = "Book a live demo and watch movement become measurable therapy in under thirty minutes.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-canvas grid-canvas px-6 py-14 text-center sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-cyan/15 blur-3xl"
            aria-hidden
          />
          <h2 className="relative text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-[15px] text-[#a8c6d8]">
            {description}
          </p>
          <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="glow-cyan bg-cyan text-canvas-deep hover:bg-cyan/85 px-5" asChild>
              <Link href="/book-demo">
                Book a Clinic Demo
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white px-5"
              asChild
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
