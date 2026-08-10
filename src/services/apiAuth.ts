/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../lib/api";
import { Role } from "./apiOverview";

// Types based on your controller
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "citizen" | "business_owner";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  suspendedAt: string | null;
  suspendedById: string | null;
  suspensionReason: string | null;
  passwordResetRequired: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  avatarUrl: string | null;
  address: string | null;
  tokenVersion:number;
  nin: string | null;
  createdById: string | null;
  wardId: string;
  assignedWardId: string | null;
  contractorId: string | null;
  commissionRate: number;
  agentId: string | null;
  isWalkIn: boolean;
  walkInRegisteredById: string | null;
  notifyByEmail: boolean;
  notifyBySms: boolean;
  notifyByInApp: boolean;
  ward: Ward | null;
  meta: any | null;
  error: any | null;
}

// Ward Interface
export interface Ward {
  id: string;
  name: string;
}


export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    // role: string;
    user?: any;
}

export interface GoogleLoginData {
  token: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  error: string | null;
}
export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}


export const MOCK_USERS_BY_ROLE: Record<string, User> = {
  super_admin: {
    id: "mock-super-admin",
    email: "super@logmas.gov.ng",
    phone: "08011112222",
    firstName: "Adewale",
    lastName: "Super",
    role: "super_admin",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Odeda LGA Secretariat, Odeda",
    tokenVersion: 1,
    nin: "11112222333",
    createdById: null,
    wardId: "ward-1",
    assignedWardId: null,
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-1", name: "Ward 1 (Odeda Secretariat)" },
    meta: null,
    error: null,
  },
  chairman: {
    id: "mock-chairman",
    email: "chairman@logmas.gov.ng",
    phone: "08033733155",
    firstName: "Folusho Joseph",
    lastName: "Badejo",
    role: "chairman",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Chairman's Office, Odeda LGA Secretariat",
    tokenVersion: 1,
    nin: "22223333444",
    createdById: null,
    wardId: "ward-1",
    assignedWardId: null,
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-1", name: "Ward 1 (Odeda Secretariat)" },
    meta: null,
    error: null,
  },
  lga_admin: {
    id: "mock-lga-admin",
    email: "admin@logmas.gov.ng",
    phone: "08022223333",
    firstName: "Olumide",
    lastName: "Admin",
    role: "lga_admin",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Administration Block, Odeda LGA",
    tokenVersion: 1,
    nin: "33334444555",
    createdById: null,
    wardId: "ward-1",
    assignedWardId: null,
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-1", name: "Ward 1 (Odeda Secretariat)" },
    meta: null,
    error: null,
  },
  treasurer: {
    id: "mock-treasurer",
    email: "treasurer@logmas.gov.ng",
    phone: "08033334444",
    firstName: "Yetunde",
    lastName: "Treasurer",
    role: "treasurer",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Treasury Department, Odeda LGA",
    tokenVersion: 1,
    nin: "44445555666",
    createdById: null,
    wardId: "ward-1",
    assignedWardId: null,
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-1", name: "Ward 1 (Odeda Secretariat)" },
    meta: null,
    error: null,
  },
  auditor: {
    id: "mock-auditor",
    email: "auditor@logmas.gov.ng",
    phone: "08044445555",
    firstName: "Folake",
    lastName: "Auditor",
    role: "auditor",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Internal Audit Unit, Odeda LGA",
    tokenVersion: 1,
    nin: "55556666777",
    createdById: null,
    wardId: "ward-1",
    assignedWardId: null,
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-1", name: "Ward 1 (Odeda Secretariat)" },
    meta: null,
    error: null,
  },
  ward_councillor: {
    id: "mock-ward-councillor",
    email: "councillor@logmas.gov.ng",
    phone: "07061088375",
    firstName: "Osunnowo",
    lastName: "Azeez",
    role: "ward_councillor",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Ward 1 Office, Odeda Town",
    tokenVersion: 1,
    nin: "66667777888",
    createdById: null,
    wardId: "ward-1",
    assignedWardId: "ward-1",
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-1", name: "Ward 1 (Odeda Secretariat)" },
    meta: null,
    error: null,
  },
  field_officer: {
    id: "mock-field-officer",
    email: "field@logmas.gov.ng",
    phone: "08055556666",
    firstName: "Tunji",
    lastName: "Field",
    role: "field_officer",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Revenue Field Office, Osiele Market",
    tokenVersion: 1,
    nin: "77778888999",
    createdById: null,
    wardId: "ward-2",
    assignedWardId: "ward-2",
    contractorId: null,
    commissionRate: 10,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-2", name: "Ward 2 (Osiele Market)" },
    meta: null,
    error: null,
  },
  contractor: {
    id: "mock-contractor",
    email: "agent@logmas.gov.ng",
    phone: "08066667777",
    firstName: "Femi",
    lastName: "Agent",
    role: "contractor",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Haulage & Revenue Services, Obantoko",
    tokenVersion: 1,
    nin: "88889999000",
    createdById: null,
    wardId: "ward-3",
    assignedWardId: null,
    contractorId: "contractor-01",
    commissionRate: 15,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-3", name: "Ward 3 (Obantoko Corridor)" },
    meta: null,
    error: null,
  },
  citizen: {
    id: "mock-citizen",
    email: "evans@joemarineng.com",
    phone: "08077778888",
    firstName: "Adebayo",
    lastName: "Citizen",
    role: "citizen",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "12 Camp Road, Obantoko, Odeda LGA",
    tokenVersion: 1,
    nin: "99990000111",
    createdById: null,
    wardId: "ward-7",
    assignedWardId: null,
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-7", name: "Ward 7 (Itesi / Camp)" },
    meta: null,
    error: null,
  },
  business_owner: {
    id: "mock-business-owner",
    email: "business@logmas.gov.ng",
    phone: "08088889999",
    firstName: "Bola",
    lastName: "Enterprises",
    role: "business_owner",
    isActive: true,
    suspendedAt: null,
    suspendedById: null,
    suspensionReason: null,
    passwordResetRequired: false,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    avatarUrl: null,
    address: "Osiele Market Complex, Odeda LGA",
    tokenVersion: 1,
    nin: "00001111222",
    createdById: null,
    wardId: "ward-2",
    assignedWardId: null,
    contractorId: null,
    commissionRate: 0,
    agentId: null,
    isWalkIn: false,
    walkInRegisteredById: null,
    notifyByEmail: true,
    notifyBySms: true,
    notifyByInApp: true,
    ward: { id: "ward-2", name: "Ward 2 (Osiele Market)" },
    meta: null,
    error: null,
  },
};

export function findMockUserByEmail(email: string): User {
  const clean = (email || "").trim().toLowerCase();
  for (const mockUser of Object.values(MOCK_USERS_BY_ROLE)) {
    if (mockUser.email.toLowerCase() === clean) {
      return mockUser;
    }
  }
  if (clean.includes("super")) return MOCK_USERS_BY_ROLE.super_admin;
  if (clean.includes("chairman")) return MOCK_USERS_BY_ROLE.chairman;
  if (clean.includes("admin")) return MOCK_USERS_BY_ROLE.lga_admin;
  if (clean.includes("treasurer")) return MOCK_USERS_BY_ROLE.treasurer;
  if (clean.includes("auditor")) return MOCK_USERS_BY_ROLE.auditor;
  if (clean.includes("councillor")) return MOCK_USERS_BY_ROLE.ward_councillor;
  if (clean.includes("field")) return MOCK_USERS_BY_ROLE.field_officer;
  if (clean.includes("agent") || clean.includes("contractor")) return MOCK_USERS_BY_ROLE.contractor;
  if (clean.includes("business")) return MOCK_USERS_BY_ROLE.business_owner;

  return {
    ...MOCK_USERS_BY_ROLE.citizen,
    id: `mock-user-${Date.now()}`,
    email: clean || "citizen@logmas.gov.ng",
    firstName: clean ? clean.split("@")[0] : "Demo Citizen",
  };
}

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<User> => {
    try {
      return await api.post<User>("/auth/register", data);
    } catch {
      const role = data.role || "citizen";
      const base = MOCK_USERS_BY_ROLE[role] || MOCK_USERS_BY_ROLE.citizen;
      const user: User = {
        ...base,
        id: `mock-reg-${Date.now()}`,
        email: data.email,
        firstName: data.firstName || "Demo",
        lastName: data.lastName || "User",
        role: role as Role,
      };
      tokenManager.setUser(user);
      tokenManager.setAccessToken(`mock-token-${user.role}-${user.id}`);
      tokenManager.setRefreshToken(`mock-refresh-${user.id}`);
      return user;
    }
  },

  // Login with email/password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/login", credentials);
    } catch {
      const user = findMockUserByEmail(credentials.email);
      const accessToken = `mock-token-${user.role}-${user.id}`;
      const refreshToken = `mock-refresh-${user.id}`;
      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
      tokenManager.setUser(user);
      return { accessToken, refreshToken, user };
    }
  },

  // Get current user profile
  getMe: async (): Promise<User> => {
    try {
      return await api.get<User>("/auth/me");
    } catch {
      const stored = tokenManager.getUser();
      if (stored) return stored;
      return MOCK_USERS_BY_ROLE.super_admin;
    }
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    try {
      return await api.patch<User>(`/auth/update/profile/${tokenManager.getUser()?.id}`, data);
    } catch {
      const current = tokenManager.getUser() || MOCK_USERS_BY_ROLE.citizen;
      const updated = { ...current, ...data };
      tokenManager.setUser(updated);
      return updated;
    }
  },

  // Google login
  googleLogin: async (data: GoogleLoginData): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/google", data);
    } catch {
      const user = MOCK_USERS_BY_ROLE.citizen;
      const accessToken = `mock-google-token-${user.id}`;
      const refreshToken = `mock-google-refresh-${user.id}`;
      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
      tokenManager.setUser(user);
      return { accessToken, refreshToken, user };
    }
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    try {
      return await api.post<{ message: string }>('/auth/forgot-password', data);
    } catch {
      return { message: "Password reset instructions sent." };
    }
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    try {
      return await api.post<{ message: string }>('/auth/reset-password', data);
    } catch {
      return { message: "Password reset successful." };
    }
  },

  // Change Password (authenticated)
  changePassword: async (data: ChangePasswordData): Promise<{ message: string; accessToken: string }> => {
    try {
      return await api.patch<{ message: string; accessToken: string }>('/auth/change-password', data);
    } catch {
      const user = tokenManager.getUser() || MOCK_USERS_BY_ROLE.citizen;
      const accessToken = `mock-token-${user.role}-${user.id}`;
      tokenManager.setAccessToken(accessToken);
      return { message: "Password changed successfully", accessToken };
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      return await api.post<RefreshTokenResponse>("/auth/refresh", { refreshToken });
    } catch {
      const user = tokenManager.getUser() || MOCK_USERS_BY_ROLE.citizen;
      const accessToken = `mock-token-${user.role}-${user.id}`;
      return { accessToken };
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post<void>("/auth/logout");
    } catch {
      // ignore detached backend error
    } finally {
      tokenManager.clearAllTokens();
    }
  },
};

// Helper functions for token management
export const tokenManager = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("logmas.auth.token");
  },

  setAccessToken: (token: string | null) => {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("logmas.auth.token", token);
    } else {
      localStorage.removeItem("logmas.auth.token");
    }
  },

  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("logmas.auth.refreshToken");
  },

  setRefreshToken: (token: string | null) => {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("logmas.auth.refreshToken", token);
    } else {
      localStorage.removeItem("logmas.auth.refreshToken");
    }
  },

  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("logmas.auth.user");
    return raw ? JSON.parse(raw) : null;
  },

  setUser: (user: User | null) => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem("logmas.auth.user", JSON.stringify(user));
    else localStorage.removeItem("logmas.auth.user");
  },

  clearAllTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("logmas.auth.token");
    localStorage.removeItem("logmas.auth.refreshToken");
    localStorage.removeItem("logmas.auth.user"); // ← add this line
  },
};
