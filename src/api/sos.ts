import { http } from "./http";
import type { EmergencyRequest } from "../types/models";

export async function createSOS(req: { location: string; requestType: string }) {
  const { data } = await http.post<EmergencyRequest>("/api/emergency-requests", req);
  return data;
}

export async function mySOS(): Promise<EmergencyRequest[]> {
  const { data } = await http.get<EmergencyRequest[]>("/api/emergency-requests/me");
  return data;
}

export async function allSOS(): Promise<EmergencyRequest[]> {
  const { data } = await http.get<EmergencyRequest[]>("/api/emergency-requests");
  return data;
}

export async function updateSOSStatus(id: number, status: EmergencyRequest["status"]) {
  const { data } = await http.patch<EmergencyRequest>(`/api/emergency-requests/${id}/status`, { status });
  return data;
}
