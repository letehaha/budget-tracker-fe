import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCurrenciesStore } from './currencies';
import { useAccountTypesStore } from './account-types';
import { usePaymentTypesStore } from './payment-types';
import { useTransactionTypesStore } from './transaction-types';
import { useAccountsStore } from './accounts';

export const useRootStore = defineStore('root', () => {
  const isAppInitialized = ref(false);

  const fetchInitialData = async () => {
    const { loadCurrencies } = useCurrenciesStore();
    const { loadAccountTypes } = useAccountTypesStore();
    const { loadPaymentTypes } = usePaymentTypesStore();
    const { loadTransactionTypes } = useTransactionTypesStore();

    isAppInitialized.value = false;

    await Promise.all([
      loadCurrencies(),
      loadAccountTypes(),
      loadPaymentTypes(),
      loadTransactionTypes(),
      useAccountsStore(),
    ]);

    isAppInitialized.value = true;
  };

  return {
    fetchInitialData,
    isAppInitialized,
  };
});
