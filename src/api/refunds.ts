import { api } from "@/api/_api";
import { TransactionModel } from "shared-types";
import { formatTransactionResponse } from "./transactions";

export const linkRefund = async (params: { originalTxId: number | null; refundTxId: number }) =>
  api.post("/transactions/refund", params);

type GetRefundsResponse = {
  id: number;
  originalTxId: number;
  refundTxId: number;
  originalTransaction: TransactionModel;
  refundTransaction: TransactionModel;
}[];

export const getRefundsForTransaction = async (params: {
  transactionId: number;
}): Promise<GetRefundsResponse> => {
  const result: GetRefundsResponse = await api.get(
    `/transactions/${params.transactionId}/refunds`,
    params,
  );

  return result.map((i) => ({
    ...i,
    originalTransaction: formatTransactionResponse(i.originalTransaction),
    refundTransaction: formatTransactionResponse(i.refundTransaction),
  }));
};
