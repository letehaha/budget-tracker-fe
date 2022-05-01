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
      if (item.transactionEntityId === TYPES.system) {
        resultTxs.push(new TransactionModelRecord(
          TYPES.system,
          new TransactionRecord(item),
        ));
      }
      if (item.transactionEntityId === TYPES.monobank) {
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

export const createTransaction = async ({
  amount,
  note = '',
  time,
  transactionTypeId,
  paymentTypeId,
  accountId,
  categoryId,
}: {
  amount: number;
  note?: string;
  time: Date;
  transactionTypeId: number;
  paymentTypeId: number;
  accountId: number;
  categoryId: number;
}): Promise<void> => {
  try {
    await api.post('/transactions', {
      amount,
      note,
      time,
      transactionTypeId,
      paymentTypeId,
      accountId,
      categoryId,
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
  transactionTypeId,
  paymentTypeId,
  accountId,
  categoryId,
}: {
  txId: number;
  amount: number;
  note?: string;
  time: Date;
  transactionTypeId: number;
  paymentTypeId: number;
  accountId: number;
  categoryId: number;
}): Promise<void> => {
  try {
    await api.put(`/transactions/${txId}`, {
      amount,
      note,
      time,
      transactionTypeId,
      paymentTypeId,
      accountId,
      categoryId,
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