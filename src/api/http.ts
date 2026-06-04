import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken, clearToken } from "../auth/storage";
import { isExpired } from "../auth/jwt";

export const http = axios.create({
  baseURL: API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    if (isExpired(token)) {
      clearToken();
    } else {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
