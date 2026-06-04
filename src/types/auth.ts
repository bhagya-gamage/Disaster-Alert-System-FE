export type Role = "CITIZEN" | "SHELTER_MANAGER" | "EMERGENCY_TEAM" | "ADMIN";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string; tokenType: "Bearer" | string };

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type JwtClaims = {
  sub?: string;
  exp?: number;
  iat?: number;
  roles?: string[];
  authorities?: string[];
  role?: string;
};
