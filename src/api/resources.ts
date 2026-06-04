import { http } from "./http";
import type { Resource } from "../types/resources";

export async function listResources(shelterId?: number): Promise<Resource[]> {
  const { data } = await http.get<Resource[]>("/api/resources", { params: { shelterId } });
  return data;
}

export async function createResource(req: Omit<Resource, "id">): Promise<Resource> {
  const { data } = await http.post<Resource>("/api/resources", req);
  return data;
}

export async function updateResource(id: number, req: Omit<Resource, "id">): Promise<Resource> {
  const { data } = await http.put<Resource>(`/api/resources/${id}`, req);
  return data;
}

export async function deleteResource(id: number) {
  await http.delete(`/api/resources/${id}`);
}
