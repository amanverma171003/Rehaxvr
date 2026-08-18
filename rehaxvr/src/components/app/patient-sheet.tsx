"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GAMES } from "@/lib/data/games";
import type { Patient } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(2, "Please enter the patient's name"),
  age: z
    .number({ message: "Enter a valid age" })
    .min(1, "Enter a valid age")
    .max(120, "Enter a valid age"),
  condition: z.string().min(2, "Please describe the condition"),
  program: z.string().min(2, "Please name the therapy program"),
  therapist: z.string().min(1, "Please assign a therapist"),
  primaryGameId: z.string().min(1, "Please select a primary game"),
  romTarget: z
    .number({ message: "Enter a target in degrees" })
    .min(5, "Enter a target in degrees")
    .max(180, "Max 180°"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function PatientSheet({
  open,
  onOpenChange,
  patient,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
}) {
  const editing = !!patient;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      therapist: "",
      primaryGameId: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        patient
          ? {
              name: patient.name,
              age: patient.age,
              condition: patient.condition,
              program: patient.program,
              therapist: patient.therapist,
              primaryGameId: patient.primaryGameId,
              romTarget: patient.romTarget,
              notes: patient.notes,
            }
          : {
              name: "",
              age: undefined as unknown as number,
              condition: "",
              program: "",
              therapist: "",
              primaryGameId: "",
              romTarget: undefined as unknown as number,
              notes: "",
            }
      );
    }
  }, [open, patient, reset]);

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    onOpenChange(false);
    toast.success(editing ? "Patient updated" : "Patient added", {
      description: editing
        ? `${values.name}'s profile has been saved.`
        : `${values.name} is ready for their first session.`,
    });
  };

  const err = (k: keyof FormValues) =>
    errors[k] ? (
      <p className="mt-1 text-xs text-danger" role="alert">
        {errors[k]?.message as string}
      </p>
    ) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{editing ? `Edit ${patient?.name}` : "Add a patient"}</SheetTitle>
          <SheetDescription>
            {editing
              ? "Update the patient profile and therapy configuration."
              : "Create the patient profile — you can start a session right after."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="patient-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-4 pb-4"
          noValidate
        >
          <div className="grid grid-cols-[1fr_88px] gap-3">
            <div>
              <Label htmlFor="pt-name">Full name</Label>
              <Input id="pt-name" className="mt-1.5" placeholder="Jane Doe" aria-invalid={!!errors.name} {...register("name")} />
              {err("name")}
            </div>
            <div>
              <Label htmlFor="pt-age">Age</Label>
              <Input id="pt-age" type="number" className="mt-1.5" aria-invalid={!!errors.age} {...register("age", { valueAsNumber: true })} />
              {err("age")}
            </div>
          </div>

          <div>
            <Label htmlFor="pt-condition">Condition</Label>
            <Input
              id="pt-condition"
              className="mt-1.5"
              placeholder="e.g. Post-op total knee replacement"
              aria-invalid={!!errors.condition}
              {...register("condition")}
            />
            {err("condition")}
          </div>

          <div>
            <Label htmlFor="pt-program">Therapy program</Label>
            <Input
              id="pt-program"
              className="mt-1.5"
              placeholder="e.g. Knee ROM recovery"
              aria-invalid={!!errors.program}
              {...register("program")}
            />
            {err("program")}
          </div>

          <div>
            <Label htmlFor="pt-therapist">Assigned therapist</Label>
            <Select
              value={watch("therapist")}
              onValueChange={(v) => setValue("therapist", v, { shouldValidate: true })}
            >
              <SelectTrigger id="pt-therapist" className="mt-1.5 w-full" aria-invalid={!!errors.therapist}>
                <SelectValue placeholder="Select therapist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sarah Okafor">Sarah Okafor</SelectItem>
                <SelectItem value="David Lin">David Lin</SelectItem>
              </SelectContent>
            </Select>
            {err("therapist")}
          </div>

          <div className="grid grid-cols-[1fr_110px] gap-3">
            <div>
              <Label htmlFor="pt-game">Primary game</Label>
              <Select
                value={watch("primaryGameId")}
                onValueChange={(v) => setValue("primaryGameId", v, { shouldValidate: true })}
              >
                <SelectTrigger id="pt-game" className="mt-1.5 w-full" aria-invalid={!!errors.primaryGameId}>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  {GAMES.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("primaryGameId")}
            </div>
            <div>
              <Label htmlFor="pt-rom">ROM target</Label>
              <div className="relative mt-1.5">
                <Input id="pt-rom" type="number" className="pr-7" aria-invalid={!!errors.romTarget} {...register("romTarget", { valueAsNumber: true })} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">°</span>
              </div>
              {err("romTarget")}
            </div>
          </div>

          <div>
            <Label htmlFor="pt-notes">
              Clinical notes <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="pt-notes"
              className="mt-1.5 min-h-20"
              placeholder="Anything the care team should know…"
              {...register("notes")}
            />
          </div>
        </form>

        <SheetFooter>
          <Button type="submit" form="patient-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
            {isSubmitting
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Add patient"}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
