import type { Role } from "@/lib/auth";

export interface StoredAuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export const AUTH_STORAGE_KEY = "logmas.auth.user";

export function readStoredUser(): StoredAuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuthUser) : null;
  } catch {
    return null;
  }
}
