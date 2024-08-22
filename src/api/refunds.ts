import { api } from "@/api/_api";

export const linkRefund = async (params: { originalTxId: number | null; refundTxId: number }) =>
  api.post("/transactions/refund", params);
