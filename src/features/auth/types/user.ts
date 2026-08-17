import type { User } from "firebase/auth";

export type UserRole = "customer" | "admin";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  firebaseUser: User | null;
  role: UserRole | null;
  loading: boolean;
  roleLoading: boolean;
} 