/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ReceiptDetails, Receipt } from "@/services/apiReceipts";
import { ReceiptRenderer } from "./ReceiptRenderer";
import { MasterReceiptConfig, OFFICIAL_RECEIPT_CONFIG } from "@/config/receiptTemplateConfig";

interface ReceiptCanvasProps {
  receipt: ReceiptDetails | Receipt | any;
  config?: MasterReceiptConfig;
  className?: string;
  isWatermarked?: boolean;
}

export function ReceiptCanvas({
  receipt,
  config = OFFICIAL_RECEIPT_CONFIG,
  className = "",
  isWatermarked = false,
}: ReceiptCanvasProps) {
  return (
    <ReceiptRenderer
      receipt={receipt}
      config={config}
      className={className}
      isWatermarked={isWatermarked}
    />
  );
}
