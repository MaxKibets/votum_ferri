export interface ExerciseSetRow {
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
}

export interface ExerciseRow {
  id: string;
  training_id: string;
  name: string;
  order_number: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  exercise_sets?: ExerciseSetRow[] | null;
}
