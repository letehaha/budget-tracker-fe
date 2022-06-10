import { ref, WritableComputedRef, computed } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { AccountRecord } from '@/js/records';

export const useAccountsStore = defineStore('system-accounts', () => {
  const accounts = ref<AccountRecord[]>([]);
  const accountsRecord = ref<Record<number, AccountRecord>>({});

  const getAccountById: WritableComputedRef<
    (id: number) => AccountRecord
  > = computed(
    () => (id: number) => accounts.value.find(i => i.id === id),
  );

  const loadAccounts = async () => {
    try {
      const result = await api.get('/accounts');

      accounts.value = [];

      for (const acc of result) {
        const formatted = new AccountRecord(acc);

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

      const formatted = new AccountRecord(result);
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

      const temp = new AccountRecord(result);

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

  const delteAccount = async ({ id }: { id: number }) => {
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

    getAccountById,

    createAccount,
    loadAccounts,
    editAccount,
    delteAccount,
  };
});
