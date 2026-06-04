import { http } from "./http";
import type { Disaster } from "../types/models";

export type UpsertDisasterRequest = Omit<Disaster, "id">;

export async function listDisasters(): Promise<Disaster[]> {
  const { data } = await http.get<Disaster[]>("/api/disasters");
  return data;
}

export async function createDisaster(req: UpsertDisasterRequest): Promise<Disaster> {
  const { data } = await http.post<Disaster>("/api/disasters", req);
  return data;
}
