<script setup lang="ts">
import { useAccountsStore } from "@/stores";
import { storeToRefs } from "pinia";
import { useQuery } from "@tanstack/vue-query";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { loadAccountGroups } from "@/api/account-groups";
import { computed, provide } from "vue";
import { AccountGroups } from "@/common/types/models";
import { AccountModel } from "shared-types";
import AccountsList from "./accounts-list.vue";
import AccountGroupsList from "./account-groups-list.vue";
import { useActiveAccountGroups } from "./helpers/use-active-account-groups";

const { enabledAccounts } = storeToRefs(useAccountsStore());
const { data: accountGroups, isLoading } = useQuery({
  queryFn: () => loadAccountGroups(),
  queryKey: VUE_QUERY_CACHE_KEYS.accountGroups,
  staleTime: Infinity,
  placeholderData: [],
});

const accountGroupsContext = useActiveAccountGroups(accountGroups);
provide("accountGroupsContext", accountGroupsContext);

const accountsInGroups = computed(() => {
  const flattenAccounts = (groups: AccountGroups[]): Record<number, AccountModel> =>
    groups.reduce(
      (acc, group) => {
        group.accounts.forEach((account) => {
          acc[account.id] = account;
        });
        if (group.childGroups.length) {
          Object.assign(acc, flattenAccounts(group.childGroups));
        }
        return acc;
      },
      {} as Record<number, AccountModel>,
    );

  return flattenAccounts(accountGroups.value);
});
const accountsWithoutGroups = computed(() =>
  enabledAccounts.value.filter((i) => !accountsInGroups.value[i.id]),
);
</script>

<template>
  <div class="my-6 min-w-[300px] overflow-y-hidden -ml-3 grid gap-4">
    <p class="text-xs uppercase ml-3">Accounts</p>

    <div class="grid overflow-auto max-h-full">
      <template v-if="isLoading">
        <div>Loading</div>
      </template>
      <template v-else>
        <AccountGroupsList :groups="accountGroups" />
        <AccountsList :accounts="accountsWithoutGroups" />
      </template>
      <!-- <template v-for="account in accountsWithoutGroups" :key="account.id">
        <router-link
          v-slot="{ isActive }"
          :to="{ name: ROUTES_NAMES.account, params: { id: account.id } }"
          class="flex w-full"
        >
          <ui-button
            :variant="isActive ? 'secondary' : 'ghost'"
            as="div"
            size="default"
            class="w-full h-auto"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex flex-col gap-1">
                <span class="text-sm">{{ account.name }}</span>
                <span class="text-xs">
                  {{ account.accountCategory }}
                </span>
              </div>
              <div class="text-sm">
                {{ formatAmountByCurrencyId(account.currentBalance, account.currencyId) }}
              </div>
            </div>
          </ui-button>
        </router-link>
      </template> -->
    </div>
  </div>
</template>
