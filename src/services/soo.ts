import { api } from "@/lib/api";
import { MOCK_MODE, tick } from "./_mock";
import {
  createOfficer as storeCreateOfficer,
  setOfficerStatus as storeSetOfficerStatus,
  getStoreSnapshot,
  type FieldOfficer as StoreFieldOfficer,
  type OfficerStatus,
} from "@/lib/store";

export type FieldOfficer = StoreFieldOfficer;

export interface Contractor {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

export interface Ward {
  id: string;
  name: string;
  code?: string;
  councillorName?: string;
}

const WARDS: Ward[] = [
  "Atan",
  "Ojowo",
  "Owu",
  "Ososa",
  "Imuwo",
  "Ikija",
  "Ife",
  "Itele",
  "Mamu",
].map((name, i) => ({ id: `w${i + 1}`, name }));

export const sooService = {
  listFieldOfficers: async (): Promise<FieldOfficer[]> => {
    if (MOCK_MODE) return tick(getStoreSnapshot().officers);
    return api.get<FieldOfficer[]>("/field-officers");
  },

  createFieldOfficer: async (
    data: Omit<FieldOfficer, "id" | "createdAt" | "totalCollected" | "invoicesIssued">,
  ): Promise<FieldOfficer> => {
    if (MOCK_MODE) {
      const o = storeCreateOfficer(data);
      return tick(o);
    }
    return api.post<FieldOfficer>("/field-officers", data);
  },

  setFieldOfficerStatus: async (
    id: string,
    status: OfficerStatus,
    actor: string,
    actorRole: string,
  ): Promise<void> => {
    if (MOCK_MODE) {
      storeSetOfficerStatus(id, status, actor, actorRole);
      return tick(undefined as unknown as void);
    }
    return api.post<void>(`/field-officers/${id}/status`, { status });
  },

  listContractors: async (): Promise<Contractor[]> => {
    if (MOCK_MODE) return tick([]);
    return api.get<Contractor[]>("/contractors");
  },

  listWards: async (): Promise<Ward[]> => {
    if (MOCK_MODE) return tick(WARDS);
    return api.get<Ward[]>("/wards");
  },
};
