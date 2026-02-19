export interface GetTrainingsParams {
  month?: string; // YYYY-MM
  date?: string; // YYYY-MM-DD
  limit?: number;
  offset?: number;
}

export interface CreateExerciseSetDTO {
  setNumber: number;
  reps: number;
  weight: number;
  restTime?: number;
  notes?: string;
}

export interface CreateExerciseDTO {
  name: string;
  sets: CreateExerciseSetDTO[];
  order: number;
  notes?: string;
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

export interface ExerciseSetResponse {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  restTime?: number;
  completed?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseResponse {
  id: string;
  trainingId: string;
  name: string;
  sets: ExerciseSetResponse[];
  order: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingResponse {
  id: string;
  userId: string;
  date: string;
  name?: string;
  description?: string;
  exercises: ExerciseResponse[];
  createdAt: string;
  updatedAt: string;
}
