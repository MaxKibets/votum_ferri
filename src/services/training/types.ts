import type { ExerciseRow } from "@/services/exercise/types";

export interface TrainingRow {
  id: string;
  user_id: string;
  date: string;
  name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  exercises?: ExerciseRow[] | null;
}
