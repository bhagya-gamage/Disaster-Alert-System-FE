import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../types/auth";
import { useAuth } from "../auth/AuthContext";

export function RequireRole({ anyOf }: { anyOf: Role[] }) {
  const { token, roles } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  const ok = roles.some((r) => anyOf.includes(r));
  if (!ok) return <Navigate to="/" replace />;

  return <Outlet />;
}
