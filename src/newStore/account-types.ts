import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { AccountTypeRecord } from '@/js/records';

export const useAccountTypesStore = defineStore('account-types', () => {
  const accountTypes: Ref<AccountTypeRecord[]> = ref([]);

  const loadAccountTypes = async () => {
    const result = await api.get('/models/account-types');

    accountTypes.value = result.map(item => new AccountTypeRecord(item));
  };

  return {
    accountTypes,
    loadAccountTypes,
  };
});
