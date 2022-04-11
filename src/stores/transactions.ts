import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { TRANSACTION_TYPES as TYPES } from '@/js/const';
import {
  TransactionRecord,
  TransactionModelRecord,
  MONOTransactionRecord,
} from '@/js/records';
import { useBanksMonobankStore } from './integrations/banks/monobank';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions: Ref<TransactionModelRecord[]> = ref([]);

  const monobankStore = useBanksMonobankStore();

  const loadTransactions = async (
    { limit = 8, from = 0 } = {},
  ) => {
    try {
      const result = await api.get('/transactions', { limit, from });

      const resultTxs = [];
      const monoTxs = [];

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
          monoTxs.push(new MONOTransactionRecord(item));
        }
      });

      transactions.value = resultTxs;
      monobankStore.setTransactions(monoTxs);

      return resultTxs;
    } catch (e) {
      throw new Error(e);
    }
  };

  const createTransaction = async ({
    amount,
    note = '',
    time,
    transactionTypeId,
    paymentTypeId,
    accountId,
    categoryId,
  }) => {
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

      await loadTransactions();
    } catch (e) {
      throw new Error(e);
    }
  };

  const editTransaction = async ({
    txId,
    amount,
    note = '',
    time,
    transactionTypeId,
    paymentTypeId,
    accountId,
    categoryId,
  }) => {
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

      await loadTransactions();
    } catch (e) {
      throw new Error(e);
    }
  };

  const deleteTransaction = async ({ txId }: { txId: number }) => {
    try {
      await api.delete(`/transactions/${txId}`);

      await loadTransactions();
    } catch (e) {
      throw new Error(e);
    }
  };

  const replaceTransaction = (
    tx: TransactionRecord | MONOTransactionRecord,
  ) => {
    let localTx: TransactionModelRecord = null;

    if (tx instanceof TransactionRecord) {
      localTx = new TransactionModelRecord(
        TYPES.system,
        tx,
      );
    }
    if (tx instanceof MONOTransactionRecord) {
      localTx = new TransactionModelRecord(
        TYPES.monobank,
        tx,
      );
    }
    const oldTx = transactions.value
      .findIndex(item => localTx.tx.id === item.tx.id);

    transactions.value[oldTx] = localTx;
  };

  return {
    transactions,
    loadTransactions,
    createTransaction,
    editTransaction,
    deleteTransaction,
    replaceTransaction,
  };
});
