import React from "react";
import type { Role } from "../types/auth";
import { clearToken, getToken, setToken as persistToken } from "./storage";
import { decodeRoles, isExpired } from "./jwt";

type AuthState = {
  token: string | null;
  roles: Role[];
};

type AuthCtx = AuthState & {
  setToken: (token: string) => void;
  logout: () => void;
};

const Ctx = React.createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => {
    const token = getToken();
    if (token && !isExpired(token)) {
      return { token, roles: decodeRoles(token) };
    }
    return { token: null, roles: [] };
  });

  const setToken = (token: string) => {
    persistToken(token);
    setState({ token, roles: decodeRoles(token) });
  };

  const logout = () => {
    clearToken();
    setState({ token: null, roles: [] });
  };

  return <Ctx.Provider value={{ ...state, setToken, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
