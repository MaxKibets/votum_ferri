import type { Exercise } from "./exercise";

export interface Training {
  id: string; // Unique identifier
  userId: string; // User ID (foreign key)
  date: Date; // Training date
  name?: string; // Optional training name
  description?: string; // Optional training description
  exercises: Exercise[]; // List of exercises
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}

export interface CreateTrainingDTO {
  date: string; // ISO date string
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
