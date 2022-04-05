import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { AccountRecord } from '@/js/records';

export const useAccountsStore = defineStore('accounts', () => {
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

  return {
    accounts,
    loadAccounts,
  };
});
