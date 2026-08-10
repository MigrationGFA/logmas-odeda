import { api } from "@/lib/api";
import { MOCK_MODE, tick } from "./_mock";
import {
  createPermit as storeCreatePermit,
  issuePermit as storeIssuePermit,
  findPermitByToken,
  getStoreSnapshot,
  PERMIT_TYPES as STORE_PERMIT_TYPES,
  type TradePermit as StoreTradePermit,
  type CreatePermitInput,
} from "@/lib/store";

export type TradePermit = StoreTradePermit;
export type PermitTypeConfig = (typeof STORE_PERMIT_TYPES)[number];

export const permitsService = {
  listPermits: async (filters?: Record<string, unknown>): Promise<TradePermit[]> => {
    if (MOCK_MODE) {
      const q = ((filters?.search as string) || "").toLowerCase();
      const all = getStoreSnapshot().permits;
      return tick(
        q
          ? all.filter((p) =>
              [p.permitNumber, p.businessName, p.ownerName, p.phone, p.permitType].some((x) =>
                x?.toLowerCase().includes(q),
              ),
            )
          : all,
      );
    }
    return api.get<TradePermit[]>("/permits", { params: filters });
  },

  getPermit: async (id: string): Promise<TradePermit> => {
    if (MOCK_MODE) {
      const p = getStoreSnapshot().permits.find((x) => x.id === id || x.permitNumber === id);
      if (!p) throw new Error("Permit not found");
      return tick(p);
    }
    return api.get<TradePermit>(`/permits/${id}`);
  },

  createPermit: async (
    data: Partial<TradePermit> & Partial<CreatePermitInput>,
  ): Promise<TradePermit> => {
    if (MOCK_MODE) {
      const p = storeCreatePermit(data as CreatePermitInput);
      return tick(p);
    }
    return api.post<TradePermit>("/permits", data);
  },

  issuePermit: async (id: string, actor: string, actorRole: string): Promise<TradePermit> => {
    if (MOCK_MODE) {
      const p = storeIssuePermit(id, actor, actorRole);
      if (!p) throw new Error("Permit cannot be issued");
      return tick(p);
    }
    return api.post<TradePermit>(`/permits/${id}/issue`, { actor, actorRole });
  },

  approvePermit: async (id: string): Promise<TradePermit> => {
    if (MOCK_MODE) {
      const p = storeIssuePermit(id, "system", "lga_admin");
      if (!p) throw new Error("Permit cannot be approved");
      return tick(p);
    }
    return api.post<TradePermit>(`/permits/${id}/approve`);
  },

  verifyByToken: async (token: string): Promise<TradePermit | null> => {
    if (MOCK_MODE) return tick(findPermitByToken(token));
    return api.get<TradePermit | null>(`/permits/verify/${encodeURIComponent(token)}`);
  },

  listPermitTypes: async (): Promise<readonly PermitTypeConfig[]> => {
    if (MOCK_MODE) return tick(STORE_PERMIT_TYPES);
    return api.get<readonly PermitTypeConfig[]>("/permit-types");
  },
};
