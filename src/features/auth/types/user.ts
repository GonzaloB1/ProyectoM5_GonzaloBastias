export type UserRole = "customer" | "admin";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}