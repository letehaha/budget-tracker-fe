import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { getHoursInMilliseconds } from '@/js/helpers';

import { useUserStore } from '@/stores/user';
import { useCategoriesStore } from '@/stores/categories/categories';
import { useAuthStore } from '@/stores/auth';
import { useCurrenciesStore } from '@/stores/currencies';
import { useAccountsStore } from '@/stores/accounts';
import { useBanksMonobankStore } from '@/stores/integrations/banks/monobank';

export const useRootStore = defineStore('root', () => {
  const authStore = useAuthStore();
  const currenciesStore = useCurrenciesStore();
  const monobankStore = useBanksMonobankStore();
  const accountsStore = useAccountsStore();
  const userStore = useUserStore();
  const categoriesStore = useCategoriesStore();

  const isAppInitialized = ref(false);
  const isFinancialDataSyncingError = ref<null | Error>(null);
  const isFinancialDataSyncing = ref(false);

  const { isLoggedIn } = storeToRefs(authStore);
  const { user } = storeToRefs(userStore);

  const fetchInitialData = async () => {
    if (isLoggedIn.value) {
      isAppInitialized.value = false;

      if (!user) {
        await userStore.loadUser();
        await categoriesStore.loadCategories();
      }

      await Promise.all([
        currenciesStore.loadCurrencies(),
        currenciesStore.loadBaseCurrency(),
        accountsStore.loadAccounts(),
        monobankStore.loadUserData(),
      ]);

      await monobankStore.loadAccounts();

      isAppInitialized.value = true;
    }
  };

  const syncFinancialData = async () => {
    try {
      isFinancialDataSyncingError.value = null;
      isFinancialDataSyncing.value = true;

      const latestAccountRefreshDate = new Date(+localStorage.getItem('latest-account-refresh-date')).getTime();

      if (new Date().getTime() - latestAccountRefreshDate > getHoursInMilliseconds(24)) {
        // refresh balances of all monobank accounts
        await Promise.allSettled([
          monobankStore.refreshAccounts(),
          monobankStore.loadTransactionsForEnabledAccounts(),
        ]);

        localStorage.setItem('latest-account-refresh-date', `${new Date().getTime()}`);
      }
    } catch (e) {
      isFinancialDataSyncingError.value = e;
    } finally {
      isFinancialDataSyncing.value = false;
    }
  };

  return {
    fetchInitialData,
    syncFinancialData,

    isAppInitialized,
    isFinancialDataSyncingError,
    isFinancialDataSyncing,
  };
});
