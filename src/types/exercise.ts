export interface Exercise {
  id: string; // Unique identifier
  trainingId: string; // Training ID (foreign key)
  name: string; // Exercise name (required)
  sets: ExerciseSet[]; // List of sets
  order: number; // Exercise order within training
  notes?: string; // Optional exercise notes
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}

export interface ExerciseSet {
  id: string; // Unique identifier
  exerciseId: string; // Exercise ID (foreign key)
  setNumber: number; // Set number (1, 2, 3, ...)
  reps: number; // Number of repetitions
  weight: number; // Weight (kg)
  restTime?: number; // Optional rest time after set (seconds)
  completed?: boolean; // Optional completion flag
  notes?: string; // Optional notes for the set
}

