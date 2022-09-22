import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useAuthStore } from './auth';
import { useCurrenciesStore } from './currencies';
import { useAccountsStore } from './accounts';
import { useBanksMonobankStore } from './integrations/banks/monobank';

export const useRootStore = defineStore('root', () => {
  const isAppInitialized = ref(false);

  const fetchInitialData = async () => {
    const authStore = useAuthStore();
    const { loadCurrencies } = useCurrenciesStore();
    const { loadUserData } = useBanksMonobankStore();
    const { loadAccounts } = useAccountsStore();

    const { isLoggedIn } = storeToRefs(authStore);

    if (isLoggedIn.value) {
      isAppInitialized.value = false;

      await Promise.all([
        loadCurrencies(),
        loadAccounts(),
        loadUserData(),
      ]);

      isAppInitialized.value = true;
    }
  };

  return {
    fetchInitialData,
    isAppInitialized,
  };
});
