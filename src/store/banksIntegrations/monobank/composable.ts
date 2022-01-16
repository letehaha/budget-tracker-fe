import { computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { MONOAccountRecord } from '@/js/records';
import { bankMonobankVuexTypes, namespace } from './types';

export const useBankMonobankStore = (): {
  getMonoAccountById: ComputedRef<(id: string) => MONOAccountRecord>;
  updateMonoAccount: (options) => Promise<void>;
  loadLatestTransactions: (options) => Promise<{ minutesToFinish: number }>;
  loadTxsForPeriod: (options) => Promise<void>;
} => {
  const store = useStore();

  const getMonoAccountById = computed(
    () => (id: string) => store.getters[`${namespace}/${bankMonobankVuexTypes.GET_ACCOUNT_BY_ID}`](id),
  );

  const updateMonoAccount = (options) => store.dispatch(
    `${namespace}/${bankMonobankVuexTypes.UPDATE_ACCOUNT_BY_ID}`,
    options,
  );

  const loadLatestTransactions = (options) => store.dispatch(
    `${namespace}/${bankMonobankVuexTypes.LOAD_TRANSACTIONS_FROM_LATEST}`,
    options,
  );

  const loadTxsForPeriod = (options) => store.dispatch(
    `${namespace}/${bankMonobankVuexTypes.LOAD_TRANSACTIONS_FOR_PERIOD}`,
    options,
  );

  return {
    getMonoAccountById,
    updateMonoAccount,
    loadLatestTransactions,
    loadTxsForPeriod,
  };
};
