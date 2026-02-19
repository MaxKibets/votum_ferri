import z from "zod";

export const CREATE_EXERCISE_SET_SCHEMA = z.object({
  setNumber: z.number().int().min(1, "Set number must be at least 1"),
  reps: z.number().int().min(1, "Reps must be at least 1"),
  weight: z.number().min(0, "Weight must be non-negative"),
  restTime: z
    .number()
    .int()
    .min(0, "Rest time must be non-negative")
    .optional(),
  notes: z.string().max(500, "Notes must be at most 500 characters").optional(),
});

export const CREATE_EXERCISE_SCHEMA = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Exercise name is required")
    .max(255, "Exercise name must be at most 255 characters"),
  sets: z
    .array(CREATE_EXERCISE_SET_SCHEMA)
    .min(1, "Exercise must have at least 1 set"),
  order: z.number().int().positive("Order must be a positive number"),
  notes: z.string().max(500, "Notes must be at most 500 characters").optional(),
});

export const UPDATE_EXERCISE_SCHEMA = CREATE_EXERCISE_SCHEMA.partial();
