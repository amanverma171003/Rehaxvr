"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useTeam } from "@/hooks/use-data";
import {
  PageHeader,
  TableSkeleton,
  ErrorState,
} from "@/components/shared/page-primitives";
import { MemberStatusBadge, RoleBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Role, TeamMember } from "@/lib/types";
import { Loader2, Mail, MoreHorizontal, Plus, UserX } from "lucide-react";
import { toast } from "sonner";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["ADMIN", "THERAPIST", "STAFF"], {
    message: "Please choose a role",
  }),
});
type InviteValues = z.infer<typeof inviteSchema>;

export default function TeamPage() {
  const { data, isLoading, isError, refetch } = useTeam();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deactivating, setDeactivating] = useState<TeamMember | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: "THERAPIST" },
  });

  const sendInvite = async (values: InviteValues) => {
    await new Promise((r) => setTimeout(r, 900));
    setInviteOpen(false);
    reset({ email: "", role: "THERAPIST" });
    toast.success("Invitation sent", {
      description: `${values.email} has been invited as ${
        values.role === "ADMIN" ? "an Organization Admin" : values.role === "THERAPIST" ? "a Therapist" : "Staff"
      }.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Therapists, staff and admins with access to your organization."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <Plus data-icon="inline-start" aria-hidden />
            Invite Member
          </Button>
        }
      />

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : isError ? (
        <ErrorState
          description="We couldn't load your team. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow className="bg-surface-muted/60 hover:bg-surface-muted/60">
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="w-12 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-accent text-[11px] font-semibold text-primary-dark">
                          {m.name.replace("Dr. ", "").split(" ").map((x) => x[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-ink">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={m.role} />
                  </TableCell>
                  <TableCell>
                    <MemberStatusBadge status={m.status} />
                  </TableCell>
                  <TableCell className="text-sm text-body">
                    {m.lastActive
                      ? format(parseISO(m.lastActive), "d MMM, HH:mm")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${m.name}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        {m.status === "PENDING" && (
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success("Invitation resent", {
                                description: `A new invitation email is on its way to ${m.email}.`,
                              })
                            }
                          >
                            <Mail aria-hidden /> Resend invitation
                          </DropdownMenuItem>
                        )}
                        {m.status === "DEACTIVATED" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success("Member reactivated", {
                                description: `${m.name} can sign in again.`,
                              })
                            }
                          >
                            <Plus aria-hidden /> Reactivate member
                          </DropdownMenuItem>
                        ) : (
                          <>
                            {m.status === "PENDING" && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeactivating(m)}
                              disabled={m.role === "ADMIN"}
                            >
                              <UserX aria-hidden /> Deactivate member
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>
              They&apos;ll receive an email with a secure link to join your
              organization.
            </DialogDescription>
          </DialogHeader>
          <form
            id="invite-form"
            onSubmit={handleSubmit(sendInvite)}
            className="space-y-4"
            noValidate
          >
            <div>
              <Label htmlFor="inv-email">Email address</Label>
              <Input
                id="inv-email"
                type="email"
                className="mt-1.5"
                placeholder="colleague@yourclinic.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="inv-role">Role</Label>
              <Select
                value={watch("role")}
                onValueChange={(v) => setValue("role", v as Role, { shouldValidate: true })}
              >
                <SelectTrigger id="inv-role" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THERAPIST">Therapist</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="ADMIN">Organization Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {watch("role") === "ADMIN"
                  ? "Full access including subscription, billing and team management."
                  : watch("role") === "THERAPIST"
                    ? "Patients, sessions, games and analytics."
                    : "Operational patient and session workflows."}
              </p>
            </div>
          </form>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="invite-form" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
              {isSubmitting ? "Sending…" : "Send invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirmation */}
      <AlertDialog open={!!deactivating} onOpenChange={(o) => !o && setDeactivating(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {deactivating?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access to your organization immediately. Their
              session history and patient assignments are retained, and you can
              reactivate them at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep active</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                toast.success("Member deactivated", {
                  description: `${deactivating?.name} no longer has access.`,
                });
                setDeactivating(null);
              }}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
