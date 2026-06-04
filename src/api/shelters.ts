import { http } from "./http";
import type { Shelter } from "../types/models";

export async function listShelters(): Promise<Shelter[]> {
  const { data } = await http.get<Shelter[]>("/api/shelters");
  return data;
}

export type UpdateShelterRequest = Omit<Shelter, "id">;

export async function updateShelter(id: number, req: UpdateShelterRequest): Promise<Shelter> {
  const { data } = await http.put<Shelter>(`/api/shelters/${id}`, req);
  return data;
}
