import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { AccountRecord } from '@/js/records';

export const useAccountsStore = defineStore('system-accounts', () => {
  const accounts = ref([]);

  const loadAccounts = async () => {
    try {
      const result = await api.get('/accounts');

      accounts.value = result.map(i => new AccountRecord(i));
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

      accounts.value.push(new AccountRecord(result));
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

      accounts.value = accounts.value.map(item => {
        if (item.id === id) {
          return new AccountRecord(result);
        }
        return item;
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const delteAccount = async ({ id }: { id: number }) => {
    try {
      await api.delete(`/accounts/${id}`);

      accounts.value = accounts.value.filter(item => item.id !== id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  return {
    accounts,
    createAccount,
    loadAccounts,
    editAccount,
    delteAccount,
  };
});
