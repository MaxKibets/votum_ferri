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
