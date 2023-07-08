import { ref, computed, WritableComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { MonobankAccountModel, MonobankTrasnactionModel, MonobankUserModel } from 'shared-types';
import { loadMonoUser, updateMonoTransactionById, api } from '@/api';
import { API_ERROR_CODES } from '@/js/const';
import { TooManyRequestsError } from '@/js/errors';

export const useBanksMonobankStore = defineStore('banks-monobank', () => {
  const transactions = ref<MonobankTrasnactionModel[]>([]);
  const accounts = ref<MonobankAccountModel[]>([]);
  const user = ref<MonobankUserModel>();
  const isUserExist = ref(false);
  const isMonoAccountPaired = ref(false);

  const isTokenPresent = computed(() => !!user.value?.apiToken);

  const sortedAccounts = computed(() => {
    const temp = [...accounts.value];

    return temp.sort((a, b) => (b.accountId).localeCompare(a.accountId));
  });
  const enabledAccounts = computed(() => sortedAccounts.value.filter(item => item.isEnabled));

  const getAccountById: WritableComputedRef<(id: string) => MonobankAccountModel> = computed(
    () => (id: string) => accounts.value.find(i => i.accountId === id),
  );

  const activeAccounts = computed(
    () => accounts.value.filter(item => item.isEnabled),
  );

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

  const replaceTransaction = (tx: MonobankTrasnactionModel) => {
    const oldTx = transactions.value.findIndex(item => tx.id === item.id);

    transactions.value[oldTx] = tx;
  };

  const replaceAccount = (account) => {
    const oldAccount = accounts.value
      .findIndex(item => account.accountId === item.accountId);

    accounts.value[oldAccount] = account;
  };

  const updateTransactionById = async ({ id, note, categoryId }) => {
    if (!isMonoAccountPaired.value) {
      return;
    }
    try {
      const result: MonobankTrasnactionModel = await updateMonoTransactionById({
        id,
        note,
        categoryId,
      });

      replaceTransaction(result);
    } catch (e) {
      if (e?.data?.code === API_ERROR_CODES.monobankUserNotPaired) {
        isMonoAccountPaired.value = false;
        return;
      }
      throw new Error(e);
    }
  };

  const loadAccounts = async () => {
    if (!isMonoAccountPaired.value) {
      return;
    }
    try {
      const result = await api.get('/banks/monobank/accounts');

      accounts.value = result;
      isMonoAccountPaired.value = true;
    } catch (e) {
      if (e?.data?.code === API_ERROR_CODES.monobankUserNotPaired) {
        isMonoAccountPaired.value = false;
      }
    }
  };

  const updateAccountById = async (
    { id, name, isEnabled }: { id: string, name?: string, isEnabled?: boolean },
  ) => {
    if (!isMonoAccountPaired.value) {
      return;
    }
    try {
      const result = await api.post('/banks/monobank/account', {
        accountId: id,
        name,
        isEnabled,
      });

      replaceAccount(result);
    } catch (e) {
      if (e?.data?.code === API_ERROR_CODES.monobankUserNotPaired) {
        isMonoAccountPaired.value = false;
        return;
      }
      throw new Error(e);
    }
  };

  const updateWebhook = async ({ clientId }) => {
    if (!isMonoAccountPaired.value) {
      return;
    }
    try {
      await api.post('/banks/monobank/update-webhook', { clientId });
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
    try {
      const result = await api.get('/banks/monobank/refresh-accounts');

      accounts.value = result;
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  };

  const loadTransactionsForPeriod = async ({ accountId, from, to }) => {
    if (!isMonoAccountPaired.value) {
      return undefined;
    }
    try {
      return api.get('/banks/monobank/load-transactions', {
        from,
        to,
        accountId,
      });
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  };

  const loadTransactionsFromLatest = async ({ accountId }) => {
    if (!isMonoAccountPaired.value) {
      return undefined;
    }
    try {
      let latestTx = await api.get('/banks/monobank/transactions', {
        from: 1,
        limit: 1,
      });
      if (latestTx ?? latestTx.length) {
        latestTx = latestTx[0];

        return loadTransactionsForPeriod({
          accountId,
          from: new Date(latestTx.time).getTime(),
          to: new Date().getTime(),
        });
      }
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
    return undefined;
  };

  const loadTransactionsForEnabledAccounts = async () => {
    try {
      await Promise.allSettled(
        enabledAccounts.value.map(acc => loadTransactionsFromLatest({ accountId: acc.accountId })),
      );
    } catch (e) {
      throw e;
    }
  };

  const pairAccount = async ({ token }) => {
    if (isMonoAccountPaired.value) return;

    try {
      await api.post('/banks/monobank/pair-user', { token });
    } catch (e) {
      throw new Error(e);
    }
  };

  const updateUser = async (
    { token, name }: { token: string, name?: string },
  ) => {
    try {
      const response = await api.post('/banks/monobank/user', { apiToken: token, name });

      user.value = response;
    } catch (e) {
      throw new Error(e);
    }
  };

  const setTransactions = (txs: MonobankTrasnactionModel[]) => {
    const txsIds = txs.map(item => item.id);
    transactions.value = [
      ...txs,
      ...transactions.value.filter(tx => !txsIds.includes(tx.id)),
    ];
  };

  return {
    transactions,
    accounts,
    user,
    isUserExist,
    isMonoAccountPaired,

    isTokenPresent,
    sortedAccounts,
    getAccountById,
    activeAccounts,
    enabledAccounts,

    loadUserData,
    updateTransactionById,
    loadAccounts,
    updateAccountById,
    updateWebhook,
    refreshAccounts,
    loadTransactionsForEnabledAccounts,
    loadTransactionsFromLatest,
    loadTransactionsForPeriod,
    pairAccount,
    updateUser,
    setTransactions,
  };
});
