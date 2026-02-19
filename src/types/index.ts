/**
 * Types module interface.
 * All TypeScript types and interfaces are exported through this barrel file.
 */

export type { Exercise, ExerciseSet } from "./exercise";
export type { SupabaseProfile } from "./supabase";
export type { Training } from "./training";
export type {
  CreateExerciseDTO,
  CreateExerciseSetDTO,
  CreateTrainingDTO,
  ExerciseResponse,
  ExerciseSetResponse,
  GetTrainingsParams,
  TrainingResponse,
  UpdateTrainingDTO,
} from "./training-api";
export type {
  PublicUser,
  User,
} from "./user";
