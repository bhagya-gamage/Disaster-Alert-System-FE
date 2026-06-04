import { http } from "./http";
import type { Shelter } from "../types/models";

export async function listShelters(): Promise<Shelter[]> {
  const { data } = await http.get<Shelter[]>("/api/shelters");
  return data;
}
