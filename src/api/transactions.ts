import {
  TRANSACTION_TYPES, PAYMENT_TYPES, ACCOUNT_TYPES, TransactionModel,
} from 'shared-types';
import { api } from '@/api/_api';
import { fromSystemAmount } from '@/js/helpers';

const formatTransaction = (transaction: TransactionModel): TransactionModel => ({
  ...transaction,
  amount: fromSystemAmount(transaction.amount),
  refAmount: fromSystemAmount(transaction.refAmount),
  cashbackAmount: fromSystemAmount(transaction.cashbackAmount),
  refCommissionRate: fromSystemAmount(transaction.refCommissionRate),
  commissionRate: fromSystemAmount(transaction.commissionRate),
});

export const loadTransactions = async (
  params: {
    limit?: number;
    from?: number;
    accountType?: ACCOUNT_TYPES;
  } = {},
): Promise<TransactionModel[]> => {
  const result = await api.get('/transactions', params);

  return result.map(item => formatTransaction(item));
};

export const loadTransactionById = async (
  { id }: { id: number },
): Promise<TransactionModel> => {
  const result = await api.get(`/transactions/${id}`);

  return formatTransaction(result);
};

export const loadTransactionsByTransferId = async (
  transferId: string,
): Promise<TransactionModel[]> => {
  const result = await api.get(`/transactions/transfer/${transferId}`);

  return result.map(item => formatTransaction(item));
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
    await api.post('/transactions', {
      ...rest,
      note,
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
  await api.put(`/transactions/${txId}`, rest);
};

export const deleteTransaction = async (txId: number): Promise<void> => {
  await api.delete(`/transactions/${txId}`);
};
