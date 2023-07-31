import { ref, WritableComputedRef, computed } from 'vue';
import { defineStore } from 'pinia';
import { ACCOUNT_TYPES, AccountModel } from 'shared-types';
import {
  loadAccounts as apiLoadAccounts,
  createAccount as apiCreateAccount,
  CreateAccountPayload,
  editAccount as apiEditAccount,
  deleteAccount as apiDeleteAccount,
  DeleteAccountPayload,
} from '@/api';

export const useAccountsStore = defineStore('system-accounts', () => {
  const accounts = ref<AccountModel[]>([]);
  const accountsRecord = ref<Record<number, AccountModel>>({});

  const getAccountById: WritableComputedRef<(id: number) => AccountModel> = computed(
    () => (id: number) => accounts.value.find(i => i.id === id),
  );

  const accountsCurrencyIds = computed(
    () => [...new Set(accounts.value.map(item => item.currencyId))],
  );

  const systemAccounts = computed(
    () => accounts.value.filter(item => item.type === ACCOUNT_TYPES.system),
  );
  const enabledAccounts = computed(() => accounts.value.filter(item => item.isEnabled));

  const loadAccounts = async () => {
    try {
      const result = await apiLoadAccounts();

      accounts.value = [];

      for (const acc of result) {
        accounts.value.push(acc);
        accountsRecord.value[acc.id] = acc;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const createAccount = async (payload: CreateAccountPayload) => {
    try {
      const result = await apiCreateAccount(payload);

      accounts.value.push(result);
      accountsRecord.value[result.id] = result;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const editAccount = async ({ id, ...data }) => {
    try {
      const result = await apiEditAccount({ id, ...data });

      accounts.value = accounts.value.map(item => {
        if (item.id === id) {
          return result;
        }
        return item;
      });
      accountsRecord.value[id] = result;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      throw e;
    }
  };

  const deleteAccount = async ({ id }: DeleteAccountPayload) => {
    try {
      await apiDeleteAccount({ id });

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
    enabledAccounts,
    systemAccounts,
    accountsCurrencyIds,

    getAccountById,

    createAccount,
    loadAccounts,
    editAccount,
    deleteAccount,
  };
});
