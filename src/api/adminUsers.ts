import { http } from "./http";
import type { User } from "../types/models";

export async function listUsers(): Promise<User[]> {
  const { data } = await http.get<User[]>("/api/admin/users");
  return data;
}

export async function updateUserRole(id: number, role: User["role"]): Promise<User> {
  const { data } = await http.patch<User>(`/api/admin/users/${id}/role`, { role });
  return data;
}

export async function deleteUser(id: number) {
  await http.delete(`/api/admin/users/${id}`);
}
