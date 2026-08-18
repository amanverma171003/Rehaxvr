"use client";

import { Suspense } from "react";
import { SettingsTabs } from "@/components/app/settings-tabs";

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsTabs />
    </Suspense>
  );
}
