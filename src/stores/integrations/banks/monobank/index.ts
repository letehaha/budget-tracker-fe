import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import {
  ACCOUNT_TYPES, MonobankUserModel, endpointsTypes, API_ERROR_CODES,
} from 'shared-types';
import {
  loadMonoUser,
  refreshMonoAccounts,
  loadMonoTransactions,
  updateMonoWebhook,
  pairMonoAccount,
  updateMonoUser,
  loadTransactions,
} from '@/api';
import { getHoursInMilliseconds } from '@/js/helpers';
import { TooManyRequestsError } from '@/js/errors';
import { useAccountsStore } from '@/stores/accounts';

export const useBanksMonobankStore = defineStore('banks-monobank', () => {
  const accountsStore = useAccountsStore();
  const user = ref<MonobankUserModel>();
  const isUserExist = ref(false);
  const isMonoAccountPaired = ref(false);
  const { enabledAccounts } = storeToRefs(accountsStore);

  const isTokenPresent = computed(() => !!user.value?.apiToken);

  const loadUserData = async () => {
    try {
      isUserExist.value = false;

      const result = await loadMonoUser();

      if (result) {
        isUserExist.value = true;
        user.value = result;
        isMonoAccountPaired.value = true;
      }
    } catch (e) {
      if (e?.data?.code === API_ERROR_CODES.monobankUserNotPaired) {
        isMonoAccountPaired.value = false;
      }
    }
  };

  const updateWebhook = async ({ clientId }: { clientId: string }) => {
    if (!isMonoAccountPaired.value) {
      return;
    }
    try {
      await updateMonoWebhook({ clientId });
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  };

  const refreshAccounts = async () => {
    if (!isMonoAccountPaired.value) {
      return;
    }

    const latestAccountRefreshDate = new Date(+localStorage.getItem('latest-account-refresh-date')).getTime();
    const diff = new Date().getTime() - latestAccountRefreshDate;

    if (diff <= getHoursInMilliseconds(1)) return;

    try {
      await refreshMonoAccounts();

      localStorage.setItem('latest-account-refresh-date', `${new Date().getTime()}`);
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  };

  const loadTransactionsForPeriod = async (
    { accountId, from, to }: endpointsTypes.LoadMonoTransactionsQuery,
  ) => {
    if (!isMonoAccountPaired.value) {
      return undefined;
    }
    try {
      return loadMonoTransactions({ accountId, from, to });
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  };

  const loadTransactionsFromLatest = async ({ accountId }: { accountId: number }) => {
    if (!isMonoAccountPaired.value) {
      return undefined;
    }

    try {
      const txs = await loadTransactions({
        from: 1,
        limit: 1,
        accountType: ACCOUNT_TYPES.monobank,
      });

      if (txs?.length) {
        return loadTransactionsForPeriod({
          accountId,
          from: new Date(txs[0].time).getTime(),
          to: new Date().getTime(),
        });
      }
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw e;
    }
    return undefined;
  };

  const loadTransactionsForEnabledAccounts = async () => {
    try {
      await Promise.allSettled(
        enabledAccounts.value
          .filter(acc => acc.type === ACCOUNT_TYPES.monobank)
          .map(acc => loadTransactionsFromLatest({ accountId: acc.id })),
      );
    } catch (e) {
      throw e;
    }
  };

  const pairAccount = async ({ token }: { token: string; }) => {
    if (isMonoAccountPaired.value) return;

    try {
      await pairMonoAccount({ token });
      await accountsStore.loadAccounts();
    } catch (e) {
      throw new Error(e);
    }
  };

  const updateUser = async (
    { token, name }: { token: string, name?: string },
  ) => {
    try {
      const response = await updateMonoUser({ apiToken: token, name });

      user.value = response;
    } catch (e) {
      throw new Error(e);
    }
  };

  return {
    user,
    isUserExist,
    isMonoAccountPaired,

    isTokenPresent,

    loadUserData,
    updateWebhook,
    refreshAccounts,
    loadTransactionsForEnabledAccounts,
    loadTransactionsFromLatest,
    loadTransactionsForPeriod,
    pairAccount,
    updateUser,
  };
});
