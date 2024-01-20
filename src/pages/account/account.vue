<template>
  <div class="account-page">
    <div class="account-page__block">
      <h3 class="account-page__block-title">Account info</h3>
      <template v-if="account.type === ACCOUNT_TYPES.monobank">
        <MonobankAccount :account="account" />
      </template>
      <template v-else-if="account.type === ACCOUNT_TYPES.system">
        <SystemAccount :account="account" />
      </template>
    </div>

    <div class="account-page__block">
      <h3 class="account-page__block-title">Records</h3>

      <template v-if="isFetched">
        <TransactionsList
          class="account-page__records-list"
          :transactions="rawTransactionsList"
        />
      </template>
      <template v-if="hasNextPage">
        <button
          class="account-page__load-more"
          type="button"
          @click="() => fetchNextPage()"
        >
          Load more
        </button>
      </template>
      <template v-else>
        <p class="account-page__no-more-data">
          {{ rawTransactionsList.length ? "No more data to load" : "No data" }}
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useInfiniteQuery } from "@tanstack/vue-query";
import { useAccountsStore, useRootStore } from "@/stores";
import { ACCOUNT_TYPES } from "shared-types";
import { loadTransactions } from "@/api";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";

import TransactionsList from "@/components/transactions-list/transactions-list.vue";
import SystemAccount from "./types/system/system.vue";
import MonobankAccount from "./types/monobank/monobank.vue";

const route = useRoute();
const accountsStore = useAccountsStore();
const { accountsRecord } = storeToRefs(accountsStore);
const account = computed(() => accountsRecord.value[+route.params.id]);

const { isAppInitialized } = storeToRefs(useRootStore());

const limit = 10;

const fetchTransactions = ({ pageParam }: { pageParam: number }) => {
  const from = pageParam * limit;
  return loadTransactions({ limit, from, accountId: account.value.id });
};

const {
  data: transactionsPages,
  fetchNextPage,
  hasNextPage,
  isFetched,
} = useInfiniteQuery({
  queryKey: [
    ...VUE_QUERY_CACHE_KEYS.accountSpecificTransactions,
    account.value.id,
  ],
  queryFn: fetchTransactions,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => {
    // No more pages to load
    if (lastPage.length < limit) return undefined;
    // returns the number of pages fetched so far as the next page param
    return pages.length;
  },
  enabled: isAppInitialized,
  staleTime: Infinity,
});

const rawTransactionsList = computed(
  () => transactionsPages.value?.pages?.flat() || [],
);
</script>

<style lang="scss">
.account-page {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}
.account-page__block-title {
  margin-bottom: 24px;
}
.account-page__block-no-data {
  margin-top: 24px;
}
.account-page__records-list {
  max-height: 600px;
  overflow: auto;
  padding: 4px;
}
.account-page__load-more {
  background-color: transparent;
  border: none;
  cursor: pointer;

  color: var(--app-primary);

  display: block;
  margin: auto;

  font-size: 16px;

  margin-top: 32px;
}
.account-page__no-more-data {
  margin-top: 32px;
  text-align: center;
}
</style>
