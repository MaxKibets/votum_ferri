import type { Exercise } from "./exercise";

export interface Training {
  id: string; // Unique identifier
  userId: string; // User ID (foreign key)
  date: string; // ISO date string (YYYY-MM-DD)
  name?: string; // Optional training name
  description?: string; // Optional training description
  exercises: Exercise[]; // List of exercises
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
}

export interface CreateTrainingDTO {
  date: string; // ISO date string (YYYY-MM-DD)
  name?: string;
  description?: string;
  exercises: CreateExerciseDTO[];
}

export interface UpdateTrainingDTO {
  date?: string;
  name?: string;
  description?: string;
  exercises?: CreateExerciseDTO[];
}

export interface CreateExerciseDTO {
  name: string;
  sets: CreateExerciseSetDTO[];
  order: number;
  notes?: string;
}

export interface CreateExerciseSetDTO {
  setNumber: number;
  reps: number;
  weight: number;
  restTime?: number;
  notes?: string;
}

export interface UpdateExerciseDTO {
  name?: string;
  order?: number;
  notes?: string;
  sets?: CreateExerciseSetDTO[];
}
