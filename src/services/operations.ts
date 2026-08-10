import { api } from "@/lib/api";
import { MOCK_MODE, tick } from "./_mock";
import {
  createInvoice as storeCreateInvoice,
  markInvoicePaid as storeMarkInvoicePaid,
  findByQrOrCode,
  findInvoiceByRef,
  getStoreSnapshot,
  type Invoice as StoreInvoice,
  type Receipt as StoreReceipt,
  type CreateInvoiceInput,
  type PaymentMethod,
} from "@/lib/store";

export type Invoice = StoreInvoice;
export type Receipt = StoreReceipt;

export interface InvoiceFilters {
  status?: string;
  search?: string;
  ward?: string;
  from?: string;
  to?: string;
}

export const operationsService = {
  listInvoices: async (filters?: InvoiceFilters): Promise<Invoice[]> => {
    if (MOCK_MODE) {
      let rows = getStoreSnapshot().invoices;
      if (filters?.status && filters.status !== "all")
        rows = rows.filter((i) => i.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        rows = rows.filter((i) =>
          (i.reference + i.customerName + i.levyType).toLowerCase().includes(q),
        );
      }
      return tick(rows);
    }
    return api.get<Invoice[]>("/invoices", { params: filters });
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    if (MOCK_MODE) {
      const inv = getStoreSnapshot().invoices.find((i) => i.id === id || i.reference === id);
      if (!inv) throw new Error("Invoice not found");
      return tick(inv);
    }
    return api.get<Invoice>(`/invoices/${id}`);
  },

  createInvoice: async (data: Partial<Invoice> & Partial<CreateInvoiceInput>): Promise<Invoice> => {
    if (MOCK_MODE) {
      const inv = storeCreateInvoice(data as CreateInvoiceInput);
      return tick(inv);
    }
    return api.post<Invoice>("/invoices", data);
  },

  payInvoice: async (
    id: string,
    data: {
      channel: string;
      amount?: number;
      reference?: string;
      actor?: string;
      actorRole?: string;
    },
  ): Promise<Receipt> => {
    if (MOCK_MODE) {
      const rec = storeMarkInvoicePaid(
        id,
        data.channel as PaymentMethod,
        data.actor ?? "system",
        data.actorRole ?? "system",
      );
      if (!rec) throw new Error("Invoice cannot be paid");
      return tick(rec);
    }
    return api.post<Receipt>(`/invoices/${id}/pay`, data);
  },

  listReceipts: async (): Promise<Receipt[]> => {
    if (MOCK_MODE) return tick(getStoreSnapshot().receipts);
    return api.get<Receipt[]>("/receipts");
  },

  getReceipt: async (id: string): Promise<Receipt> => {
    if (MOCK_MODE) {
      const r = getStoreSnapshot().receipts.find((x) => x.id === id || x.receiptNumber === id);
      if (!r) throw new Error("Receipt not found");
      return tick(r);
    }
    return api.get<Receipt>(`/receipts/${id}`);
  },

  verifyByCode: async (token: string): Promise<{ receipt: Receipt; invoice?: Invoice } | null> => {
    if (MOCK_MODE) return tick(findByQrOrCode(token));
    return api.get<{ receipt: Receipt; invoice?: Invoice } | null>(
      `/payments/verify/${encodeURIComponent(token)}`,
    );
  },

  findInvoiceByRef: async (ref: string): Promise<Invoice | null> => {
    if (MOCK_MODE) return tick(findInvoiceByRef(ref));
    return api.get<Invoice | null>(`/invoices/by-ref/${encodeURIComponent(ref)}`);
  },
};
