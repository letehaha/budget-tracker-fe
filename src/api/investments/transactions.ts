import { TRANSACTION_TYPES } from "shared-types";
import { api } from "@/api/_api";

interface CreateInvestmentTransactionParams {
  accountId: number;
  securityId: number;
  transactionType: TRANSACTION_TYPES;
  date: string;
  name?: string;
  quantity: string;
  price: string;
  fees: string;
}

export const createInvestmentTransaction = async (
  params: CreateInvestmentTransactionParams,
) => {
  const result = await api.post("/investing/transaction", params);

  return result;
};
