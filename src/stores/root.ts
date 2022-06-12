import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCurrenciesStore } from './currencies';
import { useAccountsStore } from './accounts';
import { useBanksMonobankStore } from './integrations/banks/monobank';

export const useRootStore = defineStore('root', () => {
  const isAppInitialized = ref(false);

  const fetchInitialData = async () => {
    const { loadCurrencies } = useCurrenciesStore();
    const { loadUserData } = useBanksMonobankStore();
    const { loadAccounts } = useAccountsStore();

    isAppInitialized.value = false;

    await Promise.all([
      loadCurrencies(),
      loadAccounts(),
      loadUserData(),
    ]);

    isAppInitialized.value = true;
  };

  return {
    fetchInitialData,
    isAppInitialized,
  };
});
