"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/components/ui";
import { CREATE_EXERCISE_SCHEMA } from "@/schemas";
import type {
  CreateExerciseDTO,
  CreateExerciseSetDTO,
  ExerciseResponse,
} from "@/types";
import ExerciseSetsTable from "./exercise-sets-table";

type ExerciseFormValues = z.infer<typeof CREATE_EXERCISE_SCHEMA>;

interface ExerciseFormProps {
  exercise?: ExerciseResponse;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (exercise: CreateExerciseDTO) => void;
  onCancel?: () => void;
}

function getDefaultSets(
  sets?: ExerciseResponse["sets"],
): CreateExerciseSetDTO[] {
  if (!sets?.length) {
    return [{ setNumber: 1, reps: 1, weight: 0 }];
  }

  return sets.map((set) => ({
    setNumber: set.setNumber,
    reps: set.reps,
    weight: set.weight,
    restTime: set.restTime,
    notes: set.notes,
  }));
}

export default function ExerciseForm({
  exercise,
  open = false,
  onOpenChange,
  onSubmit,
  onCancel,
}: ExerciseFormProps) {
  const defaultValues = useMemo<ExerciseFormValues>(
    () => ({
      name: exercise?.name ?? "",
      notes: exercise?.notes ?? "",
      order: exercise?.order ?? 1,
      sets: getDefaultSets(exercise?.sets),
    }),
    [exercise],
  );

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(CREATE_EXERCISE_SCHEMA),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const sets = form.watch("sets");

  const handleAddSet = () => {
    form.setValue("sets", [
      ...sets,
      {
        setNumber: sets.length + 1,
        reps: 1,
        weight: 0,
      },
    ]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length === 1) {
      return;
    }

    const nextSets = sets
      .filter((_, currentIndex) => currentIndex !== index)
      .map((set, currentIndex) => ({ ...set, setNumber: currentIndex + 1 }));

    form.setValue("sets", nextSets, { shouldValidate: true });
  };

  const handleUpdateSet = (
    index: number,
    key: keyof CreateExerciseSetDTO,
    value: number | string | undefined,
  ) => {
    const nextSets = sets.map((set, currentIndex) =>
      currentIndex === index ? { ...set, [key]: value } : set,
    );

    form.setValue("sets", nextSets, { shouldValidate: true });
  };

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit?.(values);
    onOpenChange?.(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {exercise ? "Edit exercise" : "Add exercise"}
          </DialogTitle>
          <DialogDescription>
            Configure exercise details and training sets.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Exercise name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Bench press"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <ExerciseSetsTable
              sets={sets}
              onAdd={handleAddSet}
              onRemove={handleRemoveSet}
              onUpdate={handleUpdateSet}
            />

            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    placeholder="Optional notes"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {form.formState.errors.sets?.message && (
              <FieldError>{form.formState.errors.sets.message}</FieldError>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onCancel?.();
                  onOpenChange?.(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {exercise ? "Save changes" : "Add exercise"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
