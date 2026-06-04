export type Disaster = {
  id: number;
  disasterType: string;
  description: string;
  severityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  location: string;
  startDate: string;
  status: "ACTIVE" | "RESOLVED" | "CANCELLED";
};

export type Alert = {
  id: number;
  title: string;
  message: string;
  alertDate: string;
  disasterId: number;
};

export type Shelter = {
  id: number;
  shelterName: string;
  address: string;
  totalCapacity: number;
  currentOccupancy: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "CITIZEN" | "SHELTER_MANAGER" | "EMERGENCY_TEAM" | "ADMIN";
};

export type EmergencyRequest = {
  id: number;
  location: string; // "lat, lng"
  requestType: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESCUED" | "CANCELLED";
  createdAt?: string;
};

export type RescueOperation = {
  id: number;
  requestId: number;
  teamName: string;
  status: "CREATED" | "DISPATCHED" | "ARRIVED" | "COMPLETED" | "CANCELLED";
};

export type Volunteer = {
  id: number;
  name: string;
  phone: string;
  skills: string;
};
