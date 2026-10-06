import { getApiUrl } from "./api";

export interface AuthUser {
  email: string;
  role: "Student" | "Proctor and DSW" | "Security Guard" | "Shift Supervisor" | "Admin" | string;
  name?: string;
  fullName?: string;
  badgeNumber?: string;
  department?: string;
  phoneNumber?: string;
  token?: string;
}

const AUTH_STORAGE_KEY = "campusguard_auth_user";

export function getRoleDashboardPath(role: string): string {
  switch (role) {
    case "Student":
      return "/dashboard/student";
    case "Proctor and DSW":
      return "/dashboard/proctor";
    case "Security Guard":
      return "/dashboard/guard";
    case "Shift Supervisor":
      return "/dashboard/supervisor";
    case "Admin":
      return "/dashboard/admin";
    default:
      return "/dashboard";
  }
}

export function saveAuthUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function updateStoredAuthUser(updates: Partial<AuthUser>): AuthUser | null {
  const current = getStoredAuthUser();
  if (!current) return null;
  const updated = { ...current, ...updates };
  saveAuthUser(updated);
  return updated;
}

export function clearAuthUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export async function performLogout(): Promise<void> {
  try {
    await fetch(`${getApiUrl()}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
  } catch (err) {
    console.error("Backend logout error:", err);
  } finally {
    clearAuthUser();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
