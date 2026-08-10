/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../lib/api";
import { ApplicationStatus } from "./apiOverview";

export type Gender = "male" | "female" | "other";

export interface ApiResponse<T> {
  data: T;
  meta: any;
  error: null;
}


export interface Ward {
  id: string;
  name: string;
  code: string;
}

export interface Invoice {
  id: string;
  status: string;
  totalAmount: number;
  balanceDue: number;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: string;
}

export interface Application {
  id: string;
  applicationNo: string;
  status: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  address: string;
  phone: string;
  email: string | null;
  passportUrl: string | null;
  nin: string;
  purpose: string;
  applicantId: string;
  wardId: string;
  reviewedByAdminId: string | null;
  reviewedByAdminAt: string | null;
  reviewNotes: string | null;
  approvedByCouncillorId: string | null;
  approvedByCouncillorAt: string | null;
  councillorNotes: string | null;
  rejectionReason: string | null;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
  // ward: {
  //   id: string;
  //   name: string;
  //   code: string;
  // };
  assignedCouncillor:{ id: string, firstName: string, lastName: string }
  invoice: {
    id: string;
    status: string;
    totalAmount: string;
    balanceDue: string;
    invoiceNumber?: string;
  };
  certificate: null | any;
}

export interface SubmitApplicationData {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  phone: string;
  email: string;
  // wardId: string;
  purpose: string;
  nin: string;
  passportUrl?: string;
}

export interface ForwardApplicationData {
  reviewNotes?: string;
  councillorId: string; 
}

export interface DecideApplicationData {
  decision: "approved" | "rejected";
  councillorNotes?: string;
  rejectionReason?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CertificateVerificationResponse {
  id:string;
  dateOfBirth:string;
  valid: boolean;
  certificateNumber: string;
  issuedAt: string;
  expiresAt?: string;
  isExpired: boolean;
  holder: string;
  gender: Gender;
  ward: string;
  purpose: string;
  issuingAuthority: string;
  qrToken: string;
  fullName:string;
  state:string;
  issuedBy:string;
  councillorName:string;
  verificationUrl:string;
}

export interface CertificateDataResponse {
id: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender | "N/A";
  ward: string;
  state: string;
  issuedAt: string;
  certificateNumber: string;
  councillorName: string;
  issuedBy: string;
  verificationUrl: string;
  qrToken?: string | null;
}

// Mock data store for state of origin applications in memory
const MOCK_SOO_APPLICATIONS: Application[] = [
  {
    id: "soo-001",
    applicationNo: "SOO/2026/0001",
    status: "approved",
    fullName: "Adebayo Citizen",
    dateOfBirth: "1992-05-14",
    gender: "male",
    address: "12 Camp Road, Obantoko, Odeda LGA",
    phone: "08077778888",
    email: "evans@joemarineng.com",
    passportUrl: null,
    nin: "99990000111",
    purpose: "Employment Verification",
    applicantId: "mock-citizen",
    wardId: "ward-7",
    reviewedByAdminId: "mock-lga-admin",
    reviewedByAdminAt: "2026-08-01T10:00:00Z",
    reviewNotes: "All documents verified.",
    approvedByCouncillorId: "mock-ward-councillor",
    approvedByCouncillorAt: "2026-08-02T11:00:00Z",
    councillorNotes: "Confirmed resident of Ward 7.",
    rejectionReason: null,
    invoiceId: "inv-soo-001",
    createdAt: "2026-08-01T09:00:00Z",
    updatedAt: "2026-08-02T11:00:00Z",
    assignedCouncillor: { id: "mock-ward-councillor", firstName: "Osunnowo", lastName: "Azeez" },
    invoice: {
      id: "inv-soo-001",
      status: "paid",
      totalAmount: "2500",
      balanceDue: "0",
      invoiceNumber: "ODE/INV/2026/000100",
    },
    certificate: {
      id: "cert-soo-001",
      certificateNumber: "ODE/COO/2026/000001",
      issuedAt: "2026-08-02T11:00:00Z",
    },
  },
];

// Service functions with standalone fallback logic
export const stateOfOriginService = {
  // Citizen endpoints
  submitApplication: async (data: SubmitApplicationData): Promise<Application> => {
    try {
      return await api.post<Application>("/state-of-origin", data);
    } catch {
      const newApp: Application = {
        id: `soo-${Date.now()}`,
        applicationNo: `SOO/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        status: "pending_review",
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender === "female" ? "female" : "male",
        address: data.address,
        phone: data.phone,
        email: data.email || null,
        passportUrl: data.passportUrl || null,
        nin: data.nin,
        purpose: data.purpose,
        applicantId: "mock-citizen",
        wardId: "ward-1",
        reviewedByAdminId: null,
        reviewedByAdminAt: null,
        reviewNotes: null,
        approvedByCouncillorId: null,
        approvedByCouncillorAt: null,
        councillorNotes: null,
        rejectionReason: null,
        invoiceId: `inv-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedCouncillor: { id: "mock-ward-councillor", firstName: "Osunnowo", lastName: "Azeez" },
        invoice: {
          id: `inv-${Date.now()}`,
          status: "issued",
          totalAmount: "2500",
          balanceDue: "2500",
          invoiceNumber: `ODE/INV/2026/${Math.floor(100000 + Math.random() * 899999)}`,
        },
        certificate: null,
      };
      MOCK_SOO_APPLICATIONS.unshift(newApp);
      return newApp;
    }
  },

  getMyApplications: async (): Promise<ApiResponse<Application[]>> => {
    try {
      return await api.get<ApiResponse<Application[]>>("/state-of-origin/my");
    } catch {
      return { data: MOCK_SOO_APPLICATIONS, meta: { total: MOCK_SOO_APPLICATIONS.length }, error: null };
    }
  },

  getMyApplicationById: async (id: string): Promise<ApiResponse<Application>> => {
    try {
      return await api.get<ApiResponse<Application>>(`/state-of-origin/my/${id}`);
    } catch {
      const found = MOCK_SOO_APPLICATIONS.find((a) => a.id === id) || MOCK_SOO_APPLICATIONS[0];
      return { data: found, meta: null, error: null };
    }
  },

  // LGA Admin endpoints
  getAllApplications: async (params?: {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    wardId?: string;
  }): Promise<ApiResponse<Application[]>> => {
    try {
      return await api.get<ApiResponse<Application[]>>("/state-of-origin/admin", { params });
    } catch {
      return { data: MOCK_SOO_APPLICATIONS, meta: { total: MOCK_SOO_APPLICATIONS.length }, error: null };
    }
  },

  getApplicationById: async (id: string): Promise<ApiResponse<Application>> => {
    try {
      return await api.get<ApiResponse<Application>>(`/state-of-origin/admin/${id}`);
    } catch {
      const found = MOCK_SOO_APPLICATIONS.find((a) => a.id === id) || MOCK_SOO_APPLICATIONS[0];
      return { data: found, meta: null, error: null };
    }
  },

  forwardToCouncillor: async (id: string, data: ForwardApplicationData): Promise<ApiResponse<Application>> => {
    try {
      return await api.patch<ApiResponse<Application>>(`/state-of-origin/admin/${id}/forward`, data);
    } catch {
      const app = MOCK_SOO_APPLICATIONS.find((a) => a.id === id) || MOCK_SOO_APPLICATIONS[0];
      app.status = "forwarded_to_councillor";
      app.reviewedByAdminId = "mock-lga-admin";
      app.reviewedByAdminAt = new Date().toISOString();
      app.reviewNotes = data.reviewNotes || "Forwarded for verification";
      return { data: app, meta: null, error: null };
    }
  },

  // Ward Councillor endpoints
  getCouncillorQueue: async (): Promise<ApiResponse<Application[]>> => {
    try {
      return await api.get<ApiResponse<Application[]>>("/state-of-origin/councillor/queue");
    } catch {
      return { data: MOCK_SOO_APPLICATIONS, meta: { total: MOCK_SOO_APPLICATIONS.length }, error: null };
    }
  },

  decideOnApplication: async (id: string, data: DecideApplicationData): Promise<ApiResponse<{ application: Application; certificate: Certificate }>> => {
    try {
      return await api.patch<ApiResponse<{ application: Application; certificate: Certificate }>>(
        `/state-of-origin/councillor/${id}/decide`,
        data,
      );
    } catch {
      const app = MOCK_SOO_APPLICATIONS.find((a) => a.id === id) || MOCK_SOO_APPLICATIONS[0];
      app.status = data.decision === "approved" ? "approved" : "rejected";
      app.approvedByCouncillorId = "mock-ward-councillor";
      app.approvedByCouncillorAt = new Date().toISOString();
      app.councillorNotes = data.councillorNotes || null;
      app.rejectionReason = data.rejectionReason || null;
      
      const cert: Certificate = {
        id: `cert-${Date.now()}`,
        certificateNumber: `ODE/COO/2026/${Math.floor(100000 + Math.random() * 899999)}`,
        issuedAt: new Date().toISOString(),
      };
      if (data.decision === "approved") {
        app.certificate = cert;
      }
      return { data: { application: app, certificate: cert }, meta: null, error: null };
    }
  },

  // Public verification
  verifyCertificate: async (code: string): Promise<ApiResponse<CertificateVerificationResponse>> => {
    try {
      return await api.get<ApiResponse<CertificateVerificationResponse>>(`/state-of-origin/verify/${code}`);
    } catch {
      return {
        data: {
          id: "soo-001",
          dateOfBirth: "1992-05-14",
          valid: true,
          certificateNumber: code || "ODE/COO/2026/000001",
          issuedAt: "2026-08-02T11:00:00Z",
          isExpired: false,
          holder: "Adebayo Citizen",
          gender: "male",
          ward: "Ward 7 (Itesi / Camp)",
          purpose: "Employment Verification",
          issuingAuthority: "Odeda Local Government Secretariat",
          qrToken: "mock-qr-token-12345",
          fullName: "Adebayo Citizen",
          state: "Ogun State",
          issuedBy: "Folusho Joseph Badejo (Chairman)",
          councillorName: "Osunnowo Azeez (Ward Councillor)",
          verificationUrl: `https://logmas.gov.ng/verify?code=${code}`,
        },
        meta: null,
        error: null,
      };
    }
  },

  getCertificate: async (applicationId: string): Promise<CertificateVerificationResponse> => {
    try {
      return await api.get<CertificateVerificationResponse>(`/state-of-origin/certificate/${applicationId}`);
    } catch {
      return {
        id: applicationId,
        dateOfBirth: "1992-05-14",
        valid: true,
        certificateNumber: "ODE/COO/2026/000001",
        issuedAt: "2026-08-02T11:00:00Z",
        isExpired: false,
        holder: "Adebayo Citizen",
        gender: "male",
        ward: "Ward 7 (Itesi / Camp)",
        purpose: "Employment Verification",
        issuingAuthority: "Odeda Local Government Secretariat",
        qrToken: "mock-qr-token-12345",
        fullName: "Adebayo Citizen",
        state: "Ogun State",
        issuedBy: "Folusho Joseph Badejo (Chairman)",
        councillorName: "Osunnowo Azeez (Ward Councillor)",
        verificationUrl: `https://logmas.gov.ng/verify?code=ODE-COO-2026-000001`,
      };
    }
  },
};
