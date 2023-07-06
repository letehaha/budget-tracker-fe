import { ref, WritableComputedRef, computed } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api/_api';
import * as types from '@/common/types';

export const useAccountsStore = defineStore('system-accounts', () => {
  const accounts = ref<types.AccountRecord[]>([]);
  const accountsRecord = ref<Record<number, types.AccountRecord>>({});

  const getAccountById: WritableComputedRef<
    (id: number) => types.AccountRecord
  > = computed(
    () => (id: number) => accounts.value.find(i => i.id === id),
  );

  const accountsCurrencyIds = computed(
    () => [...new Set(accounts.value.map(item => item.currencyId))],
  );

  const loadAccounts = async () => {
    try {
      const result = await api.get('/accounts');

      accounts.value = [];

      for (const acc of result) {
        const formatted = acc;

        accounts.value.push(formatted);
        accountsRecord.value[formatted.id] = formatted;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const createAccount = async ({
    name,
    currencyId,
    accountTypeId,
    currentBalance,
    creditLimit,
  }: {
    name: string;
    currencyId: number;
    accountTypeId: number;
    currentBalance?: number;
    creditLimit?: number;
  }) => {
    try {
      const result = await api.post('/accounts', {
        accountTypeId,
        currencyId,
        name,
        currentBalance,
        creditLimit,
      });

      const formatted = result;
      accounts.value.push(formatted);
      accountsRecord.value[formatted.id] = formatted;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const editAccount = async ({
    id,
    accountTypeId,
    currencyId,
    name,
    currentBalance,
    creditLimit,
  }: {
    id: number;
    accountTypeId?: number;
    currencyId?: number;
    name?: string;
    currentBalance?: number;
    creditLimit?: number;
  }) => {
    try {
      const result = await api.put(`/accounts/${id}`, {
        accountTypeId,
        currencyId,
        name,
        currentBalance,
        creditLimit,
      });

      const temp = result;

      accounts.value = accounts.value.map(item => {
        if (item.id === id) {
          return temp;
        }
        return item;
      });
      accounts.value[id] = temp;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const deleteAccount = async ({ id }: { id: number }) => {
    try {
      await api.delete(`/accounts/${id}`);

      accounts.value = accounts.value.filter(item => item.id !== id);
      delete accountsRecord.value[id];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  return {
    accounts,
    accountsRecord,
    accountsCurrencyIds,

    getAccountById,

    createAccount,
    loadAccounts,
    editAccount,
    deleteAccount,
  };
});
