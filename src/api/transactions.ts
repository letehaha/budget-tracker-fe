import { TransactionModel, endpointsTypes, TRANSACTION_TRANSFER_NATURE } from "shared-types";
import { api } from "@/api/_api";
import { fromSystemAmount, toSystemAmount } from "@/api/helpers";

const formatTransactionResponse = (transaction: TransactionModel): TransactionModel => ({
  ...transaction,
  amount: fromSystemAmount(transaction.amount),
  refAmount: fromSystemAmount(transaction.refAmount),
  cashbackAmount: fromSystemAmount(transaction.cashbackAmount),
  refCommissionRate: fromSystemAmount(transaction.refCommissionRate),
  commissionRate: fromSystemAmount(transaction.commissionRate),
});

const formatTransactionPayload = <T>(transaction: T): T => {
  const params = transaction;
  const fieldsToPatch = ["amount", "destinationAmount"];

  fieldsToPatch.forEach((field) => {
    if (params[field]) params[field] = toSystemAmount(Number(params[field]));
  });

  return params;
};

export const loadTransactions = async (
  params: endpointsTypes.GetTransactionsQuery,
): Promise<endpointsTypes.GetTransactionsResponse> => {
  const result = await api.get("/transactions", params);

  return result.map((item) => formatTransactionResponse(item));
};

export const loadTransactionById = async ({ id }: { id: number }): Promise<TransactionModel> => {
  const result = await api.get(`/transactions/${id}`);

  return formatTransactionResponse(result);
};

export const loadTransactionsByTransferId = async (
  transferId: string,
): Promise<TransactionModel[]> => {
  const result = await api.get(`/transactions/transfer/${transferId}`);

  return result.map((item) => formatTransactionResponse(item));
};

export const createTransaction = async (params: endpointsTypes.CreateTransactionBody) => {
  try {
    const formattedParams = formatTransactionPayload({
      transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
      note: "",
      ...params,
    });

    return api.post("/transactions", formattedParams);
  } catch (e) {
    throw new Error(e);
  }
};

export const editTransaction = async ({
  txId,
  ...rest
}: endpointsTypes.UpdateTransactionBody & { txId: number }): Promise<void> => {
  const params = formatTransactionPayload(rest);

  await api.put(`/transactions/${txId}`, params);
};

export const deleteTransaction = async (txId: number): Promise<void> => {
  await api.delete(`/transactions/${txId}`);
};

export const linkTransactions = async (
  payload: endpointsTypes.LinkTransactionsBody,
): Promise<void> => api.put("/transactions/link", payload);

export const unlinkTransactions = async (
  payload: endpointsTypes.UnlinkTransferTransactionsBody,
): Promise<void> => api.put("/transactions/unlink", payload);
