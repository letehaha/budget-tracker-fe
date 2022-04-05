import {
  ref, Ref, computed, WritableComputedRef,
} from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { TransactionTypeRecord } from '@/js/records';

export const useTransactionTypesStore = defineStore('transaction-types', () => {
  const transactionTypes: Ref<TransactionTypeRecord[]> = ref([]);

  const loadTransactionTypes = async () => {
    const result = await api.get('/models/transaction-types');

    transactionTypes.value = result.map(
      item => new TransactionTypeRecord(item),
    );
  };

  const getTransactionTypeById: WritableComputedRef<
    (id: number) => TransactionTypeRecord
  > = computed(
    () => (id: number) => transactionTypes.value.find(item => item.id === id),
  );

  return {
    transactionTypes,
    loadTransactionTypes,
    getTransactionTypeById,
  };
});
