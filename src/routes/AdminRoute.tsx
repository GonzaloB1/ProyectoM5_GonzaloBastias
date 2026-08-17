import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, role, loading, roleLoading } = useAuth();

  if (loading || roleLoading) {
    return <p>Cargando...</p>;
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}