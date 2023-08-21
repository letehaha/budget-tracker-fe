import {
  TRANSACTION_TYPES, PAYMENT_TYPES, ACCOUNT_TYPES, TransactionModel,
} from 'shared-types';
import { api } from '@/api/_api';

export const loadTransactions = async (
  {
    limit = 8,
    from = 0,
    accountType,
  }: {
    limit?: number;
    from?: number;
    accountType?: ACCOUNT_TYPES;
  } = {},
): Promise<TransactionModel[]> => {
  try {
    const result = await api.get('/transactions', { limit, from, accountType });

    return result;
  } catch (e) {
    throw new Error(e);
  }
};

export const loadTransactionById = async (
  { id }: { id: number },
): Promise<TransactionModel> => api.get(`/transactions/${id}`);

// Add cache
export const loadTransactionsByTransferId = async (
  transferId: string,
): Promise<TransactionModel[]> => api.get(`/transactions/transfer/${transferId}`);

export const createTransaction = async ({
  amount,
  note = '',
  time,
  transactionType,
  paymentType,
  accountId,
  categoryId,
  destinationAccountId,
  destinationAmount,
  isTransfer = false,
}: {
  amount: number;
  note?: string;
  time: string;
  transactionType: TRANSACTION_TYPES;
  paymentType: PAYMENT_TYPES;
  accountId: number;
  categoryId?: number;
  destinationAccountId?: number;
  destinationAmount?: number;
  isTransfer?: boolean;
}): Promise<void> => {
  try {
    await api.post('/transactions', {
      amount,
      note,
      time,
      transactionType,
      paymentType,
      accountId,
      categoryId,
      destinationAccountId,
      destinationAmount,
      isTransfer,
    });
  } catch (e) {
    throw new Error(e);
  }
};

interface editExternalTransactionPayload {
  txId: number;
  note?: string;
  categoryId?: number;
}
interface editSystemTransactionPayload extends editExternalTransactionPayload {
  amount?: number;
  time?: string;
  transactionType?: TRANSACTION_TYPES;
  paymentType?: PAYMENT_TYPES;
  accountId?: number;
  isTransfer?: boolean;
  destinationAccountId?: number;
  destinationAmount?: number;
}

export const editTransaction = async (
  { txId, ...rest }: editExternalTransactionPayload | editSystemTransactionPayload,
): Promise<void> => {
  try {
    await api.put(`/transactions/${txId}`, rest);
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteTransaction = async (txId: number): Promise<void> => {
  try {
    await api.delete(`/transactions/${txId}`);
  } catch (e) {
    throw new Error(e);
  }
};
