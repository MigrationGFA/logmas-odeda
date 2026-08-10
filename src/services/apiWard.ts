



import { api } from "../lib/api";

// Types based on your controller
export interface Ward {
  id: string;
  name: string;
  code: string;
}

export interface WardsListResponse {
  success: boolean;
  count: number;
  data: Ward[];
}

const MOCK_WARDS: Ward[] = [
  { id: "ward-1", name: "Ward 1 (Odeda Secretariat)", code: "W01" },
  { id: "ward-2", name: "Ward 2 (Osiele Market)", code: "W02" },
  { id: "ward-3", name: "Ward 3 (Obantoko Corridor)", code: "W03" },
  { id: "ward-4", name: "Ward 4 (Alagbagba)", code: "W04" },
  { id: "ward-5", name: "Ward 5 (Ilugun)", code: "W05" },
  { id: "ward-6", name: "Ward 6 (Opeji)", code: "W06" },
  { id: "ward-7", name: "Ward 7 (Itesi / Camp)", code: "W07" },
  { id: "ward-8", name: "Ward 8 (Kuto / Border)", code: "W08" },
  { id: "ward-9", name: "Ward 9 (Boluwaji)", code: "W09" },
  { id: "ward-10", name: "Ward 10 (Obete)", code: "W10" },
];

// Service functions
export const wardsService = {
  // Get all active wards (public endpoint)
  getWardsList: async (): Promise<Ward[]> => {
    try {
      return await api.get<Ward[]>("/general/wards");
    } catch {
      return MOCK_WARDS;
    }
  },
};