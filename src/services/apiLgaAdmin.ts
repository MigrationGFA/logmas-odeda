import { api } from "../lib/api";

// Types based on your controller
export type Role = 
  | "ward_councillor"
  | "contractor"
  | "field_officer"
  | "agent"
  | "chairman"
  | "treasurer"
  | "auditor";

export type ApplicationStatus = 
  | "submitted"
  | "payment_pending"
  | "paid"
  | "under_review"
  | "forwarded_to_councillor"
  | "approved"
  | "rejected"
  | "certificate_issued";

export interface Ward {
  id: string;
  name: string;
  code: string;
  description?: string;
  deletedAt?: string | null;
  councillors?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isActive: boolean;
  }[];
  _count?: {
    complaints: number;
    stateOfOriginApplications: number;
    businesses: number;
  };
}

export interface WardListResponse {
  data: Ward[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateWardData {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateWardData {
  name?: string;
  code?: string;
  description?: string;
}

export interface AssignCouncillorData {
  councillorId: string;
}

export interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  isActive: boolean;
  wardId?: string;
  ward?: {
    id: string;
    name: string;
  };
  contractorId?: string;
  contractor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  lastLoginAt?: string;
}

export interface StaffListResponse {
  data: Staff[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateStaffData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  wardId?: string;
  contractorId?: string;
}

export interface CreateStaffResponse {
  staff: Staff;
  // temporaryPassword: string;
  notice: string;
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  wardId?: string;
  contractorId?: string;
}

export interface StaffDetails extends Staff {
  address?: string;
  fieldOfficers?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
  }[];
}

export interface AdminOverviewResponse {
  stats: {
    citizens: number;
    fieldOfficers: number;
    pendingApplications: number;
    totalInvoices: number;
  };
  recentApplications: Array<{
    id: string;
    applicant: string;
    ward: string;
    status: ApplicationStatus;
  }>;
}

// Add these types to existing file

export type AccountRole = 
  | "ward_councillor"
  | "contractor"
  | "field_officer"
  | "agent"
  | "chairman"
  | "treasurer"
  | "auditor";

export type AccountStatus = "active" | "suspended" | "pending_reset";

export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AccountRole;
  ward: string | null;
  status: AccountStatus;
  lastLogin: string | null;
  createdAt: string;
  suspendedAt?: string | null;
  suspensionReason?: string | null;
  contractor?: string | null;
}

export interface AccountsCounts {
  total: number;
  active: number;
  suspended: number;
  pending: number;
}

export interface AccountsOverviewResponse {
  counts: AccountsCounts;
  accounts: Account[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PasswordResetResponse {
  message: string;
  // temporaryPassword: string;
  notice: string;
}

// Add these types

export interface ContractorStats {
  totalContractors: number;
  activeContractors: number;
  totalAgentsDeployed: number;
  totalRevenueViaContractors: number;
}

export interface Contractor {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  commission: number;
  status: 'active' | 'suspended';
  startDate: string;
  lastLogin: string | null;
  agentCount: number;
  collected: number;
  scope: string[];
  wards: string[];
}

export interface FieldAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  status: 'active' | 'suspended';
  contractorId: string | null;
  contractorName: string;
  totalCollected: number;
}

export interface ContractorsOverviewResponse {
  stats: ContractorStats;
  contractors: Contractor[];
  fieldAgents: FieldAgent[];
}

export interface CreateContractorData {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  commission?: number;
  scopeIds?: string[];  // Array of levy config IDs
  wardIds?: string[];   // Array of ward IDs
}

export interface CreateContractorResponse {
  contractor: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    commissionRate: number;
  };
  notice: string;
}

export interface AddAgentData {
  name: string;
  email: string;
  phone?: string;
  wardId?: string;
  levyConfigId?: string;
}

export interface AddAgentResponse {
  agent: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    ward: { name: string } | null;
    contractor: { id: string; firstName: string; lastName: string } | null;
  };
}

export type PermitStatus = 'pending_payment' | 'issued' | 'expired' | 'revoked' | 'paid'
export interface PermitListItem {
  id: string;
  permitNumber: string;
  status: PermitStatus;
  validFrom: string; // or Date
  validTo: string;
  businessName: string;
  ownerName: string;
  ward: string;
  wardId: string | null;
  fee: number;
  amountPaid: number;
  permitType: string;
  issuedBy: string | null;
}

export interface PermitStats {
  issued: number;
  pending: number;
  totalRevenue: number;
  activeOfficers: number;
}

export interface AllPermitsResponse {
  stats: PermitStats;
  permits: PermitListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetPermitsParams {
  search?: string;
  wardId?: string;
  status?: PermitStatus;
  page?: number;
  limit?: number;
}

export interface RevokedPermitResponse {
  id: string;
  permitNumber: string;
  status: 'revoked';
  businessName: string;
  permitType: string;
  reason: string | null;
}


// Add to lgaAdminService object
export const lgaAdminService = {
  // ... existing methods ...
  
  // Contractors Management
  getContractorsOverview: (params?: { search?: string }) =>
    api.get<ContractorsOverviewResponse>("/lga/contractors/overview", { params }),
  
  createContractor: (data: CreateContractorData) =>
    api.post<CreateContractorResponse>("/lga/contractors", data),
  
  addAgentToContractor: (contractorId: string, data: AddAgentData) =>
    api.post<AddAgentResponse>(`/lga/contractors/${contractorId}/agents`, data),
  // Accounts Overview
  getAccountsOverview: (params?: { 
    search?: string; 
    role?: AccountRole; 
    page?: number; 
    limit?: number 
  }) =>
    api.get<AccountsOverviewResponse>("/lga/accounts/overview", { params }),
  
  // Reset Account Password
  resetAccountPassword: (id: string) =>
    api.patch<PasswordResetResponse>(`/lga/accounts/${id}/reset-password`),

  // Ward Management
  createWard: (data: CreateWardData) =>
    api.post<Ward>("/lga/wards", data),
  
  listWards: (params?: { page?: number; limit?: number }) =>
    api.get<Ward[]>("/lga/wards", { params }),
  
  getWardById: (id: string) =>
    api.get<Ward>(`/lga/wards/${id}`),
  
  updateWard: (id: string, data: UpdateWardData) =>
    api.patch<Ward>(`/lga/wards/${id}`, data),
  
  assignCouncillor: (id: string, data: AssignCouncillorData) =>
    api.patch<{ wardId: string; councillorId: string }>(`/lga/wards/${id}/assign-councillor`, data),
  
  deleteWard: (id: string) =>
    api.delete<null>(`/lga/wards/${id}`),
  
  // Staff Management
  createStaff: (data: CreateStaffData) =>
    api.post<CreateStaffResponse>("/lga/staff", data),
  
  listStaff: (params?: { role?: Role; wardId?: string; isActive?: boolean; page?: number; limit?: number }) =>
    api.get<Staff[]>("/lga/staff", { params }),
  
  getStaffById: (id: string) =>
    api.get<StaffDetails>(`/lga/staff/${id}`),
  
  updateStaff: (id: string, data: UpdateStaffData) =>
    api.patch<Staff>(`/lga/staff/${id}`, data),
  
  toggleStaffStatus: (id: string,reason?:string) =>
    api.patch<{ id: string; email: string; isActive: boolean; role: string }>(
      `/lga/staff/${id}/toggle-status`,{reason}
    ),
    
    // Admin Overview
    getAdminOverview: () =>
      api.get<AdminOverviewResponse>("/lga/overview"),
    
    getAllPermits: (params?: GetPermitsParams) =>
      api.get<AllPermitsResponse>('/lga/permits', { params }),

    revokePermit: (id: string, revokeReason?: string) =>
      api.patch<RevokedPermitResponse>(`/lga/permits/${id}/revoke`, {revokeReason}),
};