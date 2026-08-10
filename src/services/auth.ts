import { api } from "@/lib/api";
import type { Role } from "@/lib/auth";

export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}
export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; role: Role; avatar?: string };
}

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthResponse>("/auth/login", payload),
  register: (payload: RegisterPayload) => api.post<AuthResponse>("/auth/register", payload),
  me: () => api.get<AuthResponse["user"]>("/auth/me"),
  logout: () => api.post<void>("/auth/logout"),
};
