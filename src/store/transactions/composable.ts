import { ref, Ref } from 'vue';
import { useStore } from 'vuex';
import { TransactionModelRecord } from '@/js/records';
import { transactionsVuexTypes, namespace } from './types';

export const useTransactionsStore = (): {
  transactions: Ref<TransactionModelRecord[]>;
  fetchTransactions: (options) => void;
} => {
  const store = useStore();

  const transactions = ref([]);
  const fetchTransactions = async (options) => {
    const data = await store.dispatch(`${namespace}/${transactionsVuexTypes.FETCH_TRANSACTIONS}`, options);

    transactions.value.push(...data);
  };

  return {
    transactions,
    fetchTransactions,
  };
};
