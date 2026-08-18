"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader, SectionHeader } from "@/components/shared/page-primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PasswordInput } from "@/components/auth/password-input";
import { useAppState } from "@/components/app-state";
import { ORGANIZATION } from "@/lib/data/mock";
import { ArrowUpRight, MonitorSmartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function SettingsTabs() {
  const params = useSearchParams();
  const router = useRouter();
  const { orgName, userName, plan } = useAppState();
  const tab = params.get("tab") ?? "organization";
  const [deleteOpen, setDeleteOpen] = useState(false);

  const saved = () =>
    toast.success("Settings saved", { description: "Your changes have been applied." });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Organization, profile, security and preferences."
      />

      <Tabs
        value={tab}
        onValueChange={(v) => router.replace(`/app/settings?tab=${v}`, { scroll: false })}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
        </TabsList>

        {/* ----- Organization ----- */}
        <TabsContent value="organization" className="mt-6 space-y-6">
          <Card className="gap-0 p-0">
            <CardContent className="p-6">
              <SectionHeader title="Organization profile" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="set-org">Organization name</Label>
                  <Input id="set-org" className="mt-1.5" defaultValue={orgName} />
                </div>
                <div>
                  <Label htmlFor="set-type">Type</Label>
                  <Select defaultValue="rehab">
                    <SelectTrigger id="set-type" className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rehab">Rehabilitation center</SelectItem>
                      <SelectItem value="clinic">Physical therapy clinic</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="multi">Multi-location organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="set-location">Location</Label>
                  <Input id="set-location" className="mt-1.5" defaultValue={ORGANIZATION.location} />
                </div>
                <div>
                  <Label htmlFor="set-stations">Therapy stations</Label>
                  <Input id="set-stations" type="number" className="mt-1.5" defaultValue={ORGANIZATION.stations} />
                </div>
              </div>
              <Button className="mt-5" onClick={saved}>Save changes</Button>
            </CardContent>
          </Card>

          <Card className="gap-0 p-0">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-6">
              <div>
                <p className="text-sm font-semibold text-ink">Subscription</p>
                <p className="text-xs text-muted-foreground">
                  Currently on {plan}. Manage plan, billing cycle and invoices.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/app/subscription">
                  Manage subscription
                  <ArrowUpRight data-icon="inline-end" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="gap-0 border-danger/25 p-0">
            <CardContent className="p-6">
              <SectionHeader title="Danger zone" />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/20 bg-danger/4 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Delete organization</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently removes your organization, team and all patient data.
                  </p>
                </div>
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 data-icon="inline-start" aria-hidden />
                  Delete organization
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----- Profile ----- */}
        <TabsContent value="profile" className="mt-6">
          <Card className="gap-0 p-0">
            <CardContent className="p-6">
              <SectionHeader title="Account profile" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="set-name">Full name</Label>
                  <Input id="set-name" className="mt-1.5" defaultValue={userName} />
                </div>
                <div>
                  <Label htmlFor="set-email">Email</Label>
                  <Input id="set-email" type="email" className="mt-1.5" defaultValue={ORGANIZATION.adminEmail} />
                </div>
                <div>
                  <Label htmlFor="set-title">Job title</Label>
                  <Input id="set-title" className="mt-1.5" defaultValue="Clinical Director" />
                </div>
                <div>
                  <Label htmlFor="set-lang">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="set-lang" className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-5" onClick={saved}>Save profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----- Security ----- */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="gap-0 p-0">
            <CardContent className="p-6">
              <SectionHeader title="Change password" />
              <div className="mt-5 max-w-md space-y-4">
                <div>
                  <Label htmlFor="sec-current">Current password</Label>
                  <div className="mt-1.5">
                    <PasswordInput id="sec-current" autoComplete="current-password" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sec-new">New password</Label>
                  <div className="mt-1.5">
                    <PasswordInput id="sec-new" autoComplete="new-password" />
                  </div>
                </div>
                <Button onClick={saved}>Update password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 p-0">
            <CardContent className="p-6">
              <SectionHeader title="Two-factor authentication" />
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-body">
                  Require a verification code in addition to your password.
                </p>
                <Switch
                  aria-label="Enable two-factor authentication"
                  onCheckedChange={(v) =>
                    toast.success(v ? "Two-factor enabled" : "Two-factor disabled")
                  }
                />
              </div>
              <Separator className="my-5" />
              <SectionHeader title="Active sessions" />
              <ul className="mt-4 space-y-3">
                {[
                  ["This device · Portland, OR", "Chrome on macOS · active now"],
                  ["Front-desk station", "Chrome on Windows · 2 hours ago"],
                ].map(([title, sub]) => (
                  <li key={title} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <MonitorSmartphone className="size-4 text-muted-foreground" aria-hidden />
                      <div>
                        <p className="text-sm font-medium text-ink">{title}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.success("Session revoked")}
                    >
                      Revoke
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----- Notifications ----- */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="gap-0 p-0">
            <CardContent className="p-6">
              <SectionHeader title="Email notifications" />
              <ul className="mt-5 space-y-5">
                {[
                  ["Session summaries", "A digest after each completed therapy session", true],
                  ["Patient milestones", "When a patient reaches an ROM or adherence target", true],
                  ["Missed sessions", "When a scheduled session doesn't take place", true],
                  ["Billing & subscription", "Invoices, renewals and payment issues", true],
                  ["Product updates", "New games and platform improvements", false],
                ].map(([title, sub, def]) => (
                  <li key={title as string} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{title}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <Switch defaultChecked={def as boolean} aria-label={title as string} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----- Stations ----- */}
        <TabsContent value="stations" className="mt-6">
          <Card className="gap-0 p-0">
            <CardContent className="p-6">
              <SectionHeader
                title="Therapy stations"
                description="Edge devices connected to your organization"
              />
              <ul className="mt-5 divide-y divide-border">
                {[
                  ["Station 01 · Main gym", "Online · v2.4.1", true],
                  ["Station 02 · Main gym", "Online · v2.4.1 · in session", true],
                  ["Station 03 · Bay 2", "Online · v2.4.1", true],
                  ["Station 04 · Bay 3", "Offline · last seen 14 Aug", false],
                ].map(([name, sub, online]) => (
                  <li key={name as string} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-2 rounded-full ${online ? "bg-success" : "bg-border-strong"}`}
                        aria-hidden
                      />
                      <div>
                        <p className="text-sm font-medium text-ink">{name}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        online
                          ? "bg-success/8 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {online ? "Online" : "Offline"}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete org confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {orgName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your organization, all team members, all
              patient profiles and every session record. This action cannot be
              undone. Consider exporting your data first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep organization</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                setDeleteOpen(false);
                toast("Demo only", {
                  description: "In production this would begin the deletion process.",
                });
              }}
            >
              I understand — delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
