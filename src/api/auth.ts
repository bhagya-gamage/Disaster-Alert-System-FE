import { http } from "./http";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth";

export async function register(req: RegisterRequest) {
  await http.post("/api/auth/register", req);
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/api/auth/login", req);
  return data;
}
