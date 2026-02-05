import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(value: string): boolean {
  if (!dateRegex.test(value)) {
    return false;
  }

  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp);
}

const dateStringSchema = z
  .string()
  .refine(isValidDateString, "Invalid date format");

export const TRAINING_DATE_RANGE_SCHEMA = z
  .object({
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional(),
  })
  .refine(
    ({ startDate, endDate }) => {
      if (!startDate || !endDate) {
        return true;
      }

      return Date.parse(startDate) <= Date.parse(endDate);
    },
    { message: "Start date must be before end date", path: ["startDate"] },
  );

export const EXERCISE_SET_SCHEMA = z.object({
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(1),
  weight: z.number().min(0),
  restTime: z.number().int().min(0).optional(),
  notes: z.string().trim().optional(),
});

export const EXERCISE_SCHEMA = z.object({
  name: z.string().trim().min(1),
  order: z.number().int().min(1),
  notes: z.string().trim().optional(),
  sets: z.array(EXERCISE_SET_SCHEMA).min(1),
});

export const CREATE_TRAINING_SCHEMA = z.object({
  date: dateStringSchema,
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
  exercises: z.array(EXERCISE_SCHEMA).default([]),
});

export const UPDATE_TRAINING_SCHEMA = z
  .object({
    date: dateStringSchema.optional(),
    name: z.string().trim().optional(),
    description: z.string().trim().optional(),
    exercises: z.array(EXERCISE_SCHEMA).optional(),
  })
  .refine(
    (data) =>
      data.date !== undefined ||
      data.name !== undefined ||
      data.description !== undefined ||
      data.exercises !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const CREATE_EXERCISE_SCHEMA = EXERCISE_SCHEMA;

export const UPDATE_EXERCISE_SCHEMA = z
  .object({
    name: z.string().trim().min(1).optional(),
    order: z.number().int().min(1).optional(),
    notes: z.string().trim().optional(),
    sets: z.array(EXERCISE_SET_SCHEMA).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.order !== undefined ||
      data.notes !== undefined ||
      data.sets !== undefined,
    {
      message: "At least one field must be provided",
    },
  );
