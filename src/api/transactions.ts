import {
  TRANSACTION_TYPES, PAYMENT_TYPES, ACCOUNT_TYPES, TransactionModel,
} from 'shared-types';
import { api } from '@/api/_api';
import { fromSystemAmount, toSystemAmount } from '@/api/helpers';

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
  const fieldsToPatch = ['amount', 'destinationAmount'];

  fieldsToPatch.forEach(field => {
    if (params[field]) params[field] = toSystemAmount(Number(params[field]));
  });

  return params;
};

export const loadTransactions = async (
  params: {
    limit?: number;
    from?: number;
    accountType?: ACCOUNT_TYPES;
  } = {},
): Promise<TransactionModel[]> => {
  const result = await api.get('/transactions', params);

  return result.map(item => formatTransactionResponse(item));
};

export const loadTransactionById = async (
  { id }: { id: number },
): Promise<TransactionModel> => {
  const result = await api.get(`/transactions/${id}`);

  return formatTransactionResponse(result);
};

export const loadTransactionsByTransferId = async (
  transferId: string,
): Promise<TransactionModel[]> => {
  const result = await api.get(`/transactions/transfer/${transferId}`);

  return result.map(item => formatTransactionResponse(item));
};

export const createTransaction = async ({
  note = '',
  isTransfer = false,
  ...rest
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
    const params = formatTransactionPayload({
      ...rest,
      note,
      isTransfer,
    });

    await api.post('/transactions', params);
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
  const params = formatTransactionPayload(rest);

  await api.put(`/transactions/${txId}`, params);
};

export const deleteTransaction = async (txId: number): Promise<void> => {
  await api.delete(`/transactions/${txId}`);
};
