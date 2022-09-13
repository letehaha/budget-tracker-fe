import { TRANSACTION_TYPES, PAYMENT_TYPES, ACCOUNT_TYPES } from 'shared-types';
import { api } from '@/api';
import { TRANSACTION_TYPES as TYPES } from '@/js/const';
import {
  TransactionRecord,
  TransactionModelRecord,
  MONOTransactionRecord,
} from '@/js/records';

export const loadTransactions = async (
  {
    limit = 8,
    from = 0,
  }: {
    limit?: number;
    from?: number;
  } = {},
): Promise<TransactionModelRecord[]> => {
  try {
    const result = await api.get('/transactions', { limit, from });

    const resultTxs: TransactionModelRecord[] = [];

    result.forEach(item => {
      if (item.accountType === ACCOUNT_TYPES.system) {
        resultTxs.push(new TransactionModelRecord(
          TYPES.system,
          new TransactionRecord(item),
        ));
      }
      if (item.accountType === ACCOUNT_TYPES.monobank) {
        resultTxs.push(new TransactionModelRecord(
          TYPES.monobank,
          new MONOTransactionRecord(item),
        ));
      }
    });

    return resultTxs;
  } catch (e) {
    throw new Error(e);
  }
};

export const loadTransactionById = async (
  { id }: { id: number },
): Promise<TransactionRecord> => {
  let result = await api.get(`/transactions/${id}`);
  result = new TransactionRecord(result);

  return result;
};

// Add cache
export const loadTransactionsByTransferId = async (
  transferId: string,
): Promise<TransactionRecord[]> => {
  const result = await api.get(`/transactions/transfer/${transferId}`);

  return result.map(item => new TransactionRecord(item));
};

export const createTransaction = async ({
  amount,
  note = '',
  time,
  transactionType,
  paymentType,
  accountId,
  categoryId,
  currencyId,
  currencyCode,
  destinationAccountId,
  destinationAmount,
  isTransfer = false,
  destinationCurrencyId,
  destinationCurrencyCode,
}: {
  amount: number;
  note?: string;
  time: string;
  transactionType: TRANSACTION_TYPES;
  paymentType: PAYMENT_TYPES;
  accountId: number;
  categoryId?: number;
  currencyId: number;
  currencyCode: string;
  destinationAccountId?: number;
  destinationAmount?: number;
  isTransfer?: boolean;
  destinationCurrencyId?: number;
  destinationCurrencyCode?: string;
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
      currencyId,
      currencyCode,
      destinationAccountId,
      destinationAmount,
      destinationCurrencyId,
      destinationCurrencyCode,
      isTransfer,
    });
  } catch (e) {
    throw new Error(e);
  }
};

export const editTransaction = async ({
  txId,
  amount,
  note = '',
  time,
  transactionType,
  paymentType,
  accountId,
  categoryId,
  currencyId,
  currencyCode,
  isTransfer,
  destinationAccountId,
  destinationAmount,
  destinationCurrencyId,
  destinationCurrencyCode,
}: {
  txId: number;
  amount: number;
  note?: string;
  time: string;
  transactionType: TRANSACTION_TYPES;
  paymentType: PAYMENT_TYPES;
  accountId: number;
  categoryId?: number;
  currencyId?: number;
  currencyCode?: string;
  isTransfer?: boolean;
  destinationAccountId?: number;
  destinationAmount?: number;
  destinationCurrencyId?: number;
  destinationCurrencyCode?: string;
}): Promise<void> => {
  try {
    await api.put(`/transactions/${txId}`, {
      amount,
      note,
      time,
      transactionType,
      paymentType,
      accountId,
      categoryId,
      currencyId,
      isTransfer,
      currencyCode,
      destinationAccountId,
      destinationAmount,
      destinationCurrencyId,
      destinationCurrencyCode,
    });
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
