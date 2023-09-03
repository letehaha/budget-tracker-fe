import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { getHoursInMilliseconds } from '@/js/helpers';
import { eventBus, BUS_EVENTS } from '@/js/utils';

import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useCurrenciesStore } from '@/stores/currencies';
import { useAccountsStore } from '@/stores/accounts';
import { useBanksMonobankStore } from '@/stores/integrations/banks/monobank';
import { useCategoriesStore } from '@/stores/categories/categories';

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

  const isAllowedToSyncFinancialData = ref(false);

  const checkSyncFinancialDataPossibility = () => {
    const latestAccountRefreshDate = new Date(+localStorage.getItem('latest-account-refresh-date')).getTime();
    const diff = new Date().getTime() - latestAccountRefreshDate;

    isAllowedToSyncFinancialData.value = diff > getHoursInMilliseconds(0.5);
  };

  checkSyncFinancialDataPossibility();
  setInterval(checkSyncFinancialDataPossibility, 5000);

  const fetchInitialData = async () => {
    if (isLoggedIn.value) {
      isAppInitialized.value = false;

      if (!user) {
        await userStore.loadUser();
      }

      await Promise.all([
        categoriesStore.loadCategories(),
        currenciesStore.loadCurrencies(),
        currenciesStore.loadBaseCurrency(),
        accountsStore.loadAccounts(),
        monobankStore.loadUserData(),
      ]);

      isAppInitialized.value = true;
    }
  };

  const syncFinancialData = async () => {
    try {
      isFinancialDataSyncingError.value = null;
      isFinancialDataSyncing.value = true;

      if (isAllowedToSyncFinancialData.value) {
        // refresh balances of all monobank accounts
        await Promise.allSettled([
          monobankStore.refreshAccounts(),
          monobankStore.loadTransactionsForEnabledAccounts(),
        ]);

        eventBus.emit(BUS_EVENTS.transactionChange);
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
    isAllowedToSyncFinancialData,
    isFinancialDataSyncingError,
    isFinancialDataSyncing,
  };
});
