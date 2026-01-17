export interface User {
  id: string; // Unique identifier
  email: string; // Unique email
  passwordHash: string; // Hashed password (never exposed via API)
  name?: string; // Optional user name
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}

export interface PublicUser {
  id: string;
  email: string;
  name?: string;
}

