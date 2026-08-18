"use client";

import { Suspense } from "react";
import { LiveSession } from "@/components/app/live-session";

export default function LiveSessionPage() {
  return (
    <Suspense>
      <LiveSession />
    </Suspense>
  );
}
