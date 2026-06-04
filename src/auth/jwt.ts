import { jwtDecode } from "jwt-decode";
import type { JwtClaims, Role } from "../types/auth";

function normalizeRole(r: string): Role | null {
  const clean = r.replace(/^ROLE_/, "");
  if (clean === "ADMIN" || clean === "CITIZEN" || clean === "EMERGENCY_TEAM" || clean === "SHELTER_MANAGER") return clean;
  return null;
}

export function decodeRoles(token: string): Role[] {
  try {
    const claims = jwtDecode<JwtClaims>(token);

    const raw: string[] = [];
    if (Array.isArray(claims.roles)) raw.push(...claims.roles);
    if (Array.isArray(claims.authorities)) raw.push(...claims.authorities);
    if (typeof claims.role === "string") raw.push(claims.role);

    const roles = raw.map(normalizeRole).filter(Boolean) as Role[];
    return Array.from(new Set(roles));
  } catch {
    return [];
  }
}

export function isExpired(token: string): boolean {
  try {
    const claims = jwtDecode<JwtClaims>(token);
    if (!claims.exp) return false;
    return Date.now() >= claims.exp * 1000;
  } catch {
    return true;
  }
}
