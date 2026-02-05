import type { ACTION_ERROR_CODES } from "./constants";

export type ActionResponse<T> = {
  data: T | null;
  error: { code: string; message: string; field?: string } | null;
};

export type ActionErrorCode =
  (typeof ACTION_ERROR_CODES)[keyof typeof ACTION_ERROR_CODES];

export type ExerciseSetRow = {
  id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  rest_time: number | null;
  completed: boolean | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ExerciseRow = {
  id: string;
  training_id: string;
  name: string;
  order_number: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  exercise_sets?: ExerciseSetRow[] | null;
};

export type TrainingRow = {
  id: string;
  user_id: string;
  date: string;
  name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  exercises?: ExerciseRow[] | null;
};
