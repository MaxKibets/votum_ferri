import z from "zod";
import { CREATE_EXERCISE_SCHEMA } from "./exercise";

export const CREATE_TRAINING_SCHEMA = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  name: z.string().max(255, "Name must be at most 255 characters").optional(),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  exercises: z
    .array(CREATE_EXERCISE_SCHEMA)
    .min(1, "Training must have at least 1 exercise"),
});

export const UPDATE_TRAINING_SCHEMA = CREATE_TRAINING_SCHEMA.partial();
