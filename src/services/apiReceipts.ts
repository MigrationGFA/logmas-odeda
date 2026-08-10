import { api } from "../lib/api";

// Types based on your controller
export interface Receipt {
  id: string;
  receiptNumber: string;
  amount: number;
  customerName: string;
  levyType: string;
  paidAt: string;
  paymentMethod: string;
  invoiceId: string;
}

export interface ReceiptDetails {
  id: string;
  receiptNumber: string;
  verificationCode: string;
  invoiceRef: string;
  invoiceId: string;
  paymentMethod: string;
  amount: number;
  paidAt: string;
  customerName: string;
  phone: string;
  levyType: string;
  officerName: string | null;
  invoice: {
    address: string;
  };
}

export interface ReceiptsListResponse {
  metta: string;
  data: Receipt[];
  error: string | null;
}

export interface ReceiptDetailsResponse {
  status: string;
  data: ReceiptDetails;
  error: string | null;
}

// Service functions
export const receiptsService = {
  // Get all receipts for current user
  getReceipts: () =>
    api.get<Receipt[]>("/receipts"),
  
  // Get single receipt by ID or receipt number
  getReceiptById: (id: string) =>
    api.get<ReceiptDetailsResponse>(`/receipts/${id}`),
};