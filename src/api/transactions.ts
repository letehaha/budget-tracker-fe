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

export const createTransaction = async ({
  amount,
  note = '',
  time,
  transactionType,
  paymentType,
  accountId,
  categoryId,
  currencyId,
  fromAccountId,
  fromAccountType,
  toAccountId,
  toAccountType,
}: {
  amount: number;
  note?: string;
  time: string;
  transactionType: TRANSACTION_TYPES;
  paymentType: PAYMENT_TYPES;
  accountId: number;
  categoryId: number;
  currencyId: number;
  fromAccountId?: number;
  fromAccountType?: ACCOUNT_TYPES;
  toAccountId?: number;
  toAccountType?: ACCOUNT_TYPES;
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
      fromAccountId,
      fromAccountType,
      toAccountId,
      toAccountType,
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
}: {
  txId: number;
  amount: number;
  note?: string;
  time: string;
  transactionType: TRANSACTION_TYPES;
  paymentType: PAYMENT_TYPES;
  accountId: number;
  categoryId: number;
  currencyId?: number;
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
