import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCurrenciesStore } from './currencies';
import { useAccountTypesStore } from './account-types';
import { usePaymentTypesStore } from './payment-types';
import { useTransactionTypesStore } from './transaction-types';
import { useAccountsStore } from './accounts';
import { useBanksMonobankStore } from './integrations/banks/monobank';

export const useRootStore = defineStore('root', () => {
  const isAppInitialized = ref(false);

  const fetchInitialData = async () => {
    const { loadCurrencies } = useCurrenciesStore();
    const { loadAccountTypes } = useAccountTypesStore();
    const { loadPaymentTypes } = usePaymentTypesStore();
    const { loadTransactionTypes } = useTransactionTypesStore();
    const { loadUserData } = useBanksMonobankStore();

    isAppInitialized.value = false;

    await Promise.all([
      loadCurrencies(),
      loadAccountTypes(),
      loadPaymentTypes(),
      loadTransactionTypes(),
      useAccountsStore(),
      loadUserData(),
    ]);

    isAppInitialized.value = true;
  };

  return {
    fetchInitialData,
    isAppInitialized,
  };
});
