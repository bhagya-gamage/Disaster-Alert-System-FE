import { http } from "./http";
import type { Alert } from "../types/models";

export type CreateAlertRequest = {
  title: string;
  message: string;
  alertDate: string;
  disasterId: number;
};

export async function listAlerts(disasterId?: number): Promise<Alert[]> {
  const { data } = await http.get<Alert[]>("/api/alerts", { params: { disasterId } });
  return data;
}

export async function createAlert(req: CreateAlertRequest): Promise<Alert> {
  const { data } = await http.post<Alert>("/api/alerts", req);
  return data;
}
