import { ref, shallowRef } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useQueryClient } from '@tanstack/vue-query';

import { getHoursInMilliseconds } from '@/js/helpers';
import { VUE_QUERY_TX_CHANGE_QUERY } from '@/common/const';

import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useCurrenciesStore } from '@/stores/currencies';
import { useBanksMonobankStore } from '@/stores/integrations/banks/monobank';
import { useCategoriesStore } from '@/stores/categories/categories';

export const useRootStore = defineStore('root', () => {
  const authStore = useAuthStore();
  const currenciesStore = useCurrenciesStore();
  const monobankStore = useBanksMonobankStore();
  const userStore = useUserStore();
  const categoriesStore = useCategoriesStore();
  const queryClient = useQueryClient();

  const isAppInitialized = ref(false);
  const isFinancialDataSyncingError = shallowRef<null | Error>(null);
  const isFinancialDataSyncing = ref(false);

  const { isLoggedIn } = storeToRefs(authStore);
  const { user } = storeToRefs(userStore);

  const isAllowedToSyncFinancialData = ref(false);

  const checkSyncFinancialDataPossibility = () => {
    const latestAccountRefreshDate = new Date(
      Number(localStorage.getItem('latest-account-refresh-date')),
    ).getTime();
    const diff = new Date().getTime() - latestAccountRefreshDate;

    isAllowedToSyncFinancialData.value = diff > getHoursInMilliseconds(0.5);
  };

  checkSyncFinancialDataPossibility();
  setInterval(checkSyncFinancialDataPossibility, 5000);

  const fetchInitialData = async () => {
    if (isLoggedIn.value) {
      isAppInitialized.value = false;

      if (!user.value) {
        await userStore.loadUser();
      }

      await Promise.all([
        categoriesStore.loadCategories(),
        currenciesStore.loadCurrencies(),
        currenciesStore.loadBaseCurrency(),
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

        queryClient.invalidateQueries([VUE_QUERY_TX_CHANGE_QUERY]);
      }
    } catch (e) {
      isFinancialDataSyncingError.value = e as Error;
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
