import { ref, WritableComputedRef, computed, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useQuery } from "@tanstack/vue-query";
import { ACCOUNT_TYPES, AccountModel } from "shared-types";
import {
  loadAccounts as apiLoadAccounts,
  createAccount as apiCreateAccount,
  editAccount as apiEditAccount,
  deleteAccount as apiDeleteAccount,
  DeleteAccountPayload,
} from "@/api";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { useUserStore } from "./user";

export const useAccountsStore = defineStore("accounts", () => {
  const { isUserExists } = storeToRefs(useUserStore());

  const accountsRecord = ref<Record<number, AccountModel>>({});

  const { data: accounts } = useQuery({
    queryKey: VUE_QUERY_CACHE_KEYS.allAccounts,
    queryFn: apiLoadAccounts,
    staleTime: Infinity,
    placeholderData: [],
    enabled: isUserExists,
  });

  watch(accounts, (value) => {
    for (const acc of value) {
      accountsRecord.value[acc.id] = acc;
    }
  });

  const getAccountById: WritableComputedRef<
    (id: number) => AccountModel | undefined
  > = computed(() => (id: number) => accounts.value.find((i) => i.id === id));

  const accountsCurrencyIds = computed(() => [
    ...new Set(accounts.value.map((item) => item.currencyId)),
  ]);

  const systemAccounts = computed(() =>
    accounts.value.filter((item) => item.type === ACCOUNT_TYPES.system),
  );
  const enabledAccounts = computed(() =>
    accounts.value.filter((item) => item.isEnabled),
  );

  const createAccount = async (
    payload: Parameters<typeof apiCreateAccount>[0],
  ) => {
    try {
      const result = await apiCreateAccount(payload);

      accounts.value.push(result);
      accountsRecord.value[result.id] = result;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const editAccount = async ({
    id,
    ...data
  }: Parameters<typeof apiEditAccount>[0]) => {
    try {
      const result = await apiEditAccount({ id, ...data });

      accounts.value = accounts.value.map((item) => {
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

      accounts.value = accounts.value.filter((item) => item.id !== id);
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
    editAccount,
    deleteAccount,
  };
});
