import { computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';

import {
  PaymentTypeRecord,
  AccountTypeRecord,
  CurrencyRecord,
  TransactionTypeRecord,
} from '@/js/records';

import { indexVuexTypes } from './types';

export const useRootStore = (): {
  isAppInitialized: ComputedRef<boolean>;
  currencies: ComputedRef<CurrencyRecord[]>;
  accountTypes: ComputedRef<AccountTypeRecord[]>;
  paymentTypes: ComputedRef<PaymentTypeRecord[]>;
  transactionTypes: ComputedRef<TransactionTypeRecord[]>;
} => {
  const store = useStore();

  const isAppInitialized = computed(
    () => store.getters[indexVuexTypes.GET_APP_INIT_STATUS],
  );

  const currencies = computed(
    () => store.getters[indexVuexTypes.GET_CURRENCIES],
  );

  const accountTypes = computed(
    () => store.getters[indexVuexTypes.GET_ACCOUNT_TYPES],
  );

  const paymentTypes = computed(
    () => store.getters[indexVuexTypes.GET_PAYMENT_TYPES],
  );

  const transactionTypes = computed(
    () => store.getters[indexVuexTypes.GET_TRANSACTION_TYPES],
  );

  return {
    isAppInitialized,
    currencies,
    accountTypes,
    paymentTypes,
    transactionTypes,
  };
};
