<template>
  <div class="flex justify-start gap-4 p-6">
    <Card.Card class="max-w-[600px] w-full">
      <Header :account="account" />

      <Separator />
      <Card.CardContent>
        <template v-if="account.type === ACCOUNT_TYPES.monobank">
          <MonobankAccount :account="account" />
        </template>
        <template v-else-if="account.type === ACCOUNT_TYPES.system">
          <SystemAccount :account="account" />
        </template>
      </Card.CardContent>
    </Card.Card>

    <Card.Card class="max-w-[600px] w-full pt-6">
      <Card.CardContent>
        <Tabs.Tabs default-value="records">
          <Tabs.TabsList class="justify-start w-full">
            <Tabs.TabsTrigger value="records"> Transactions </Tabs.TabsTrigger>
            <Tabs.TabsTrigger disabled value="analytics"> Analytics (soon) </Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value="records">
            <template v-if="isFetched">
              <TransactionsList
                class="account-page__records-list"
                :transactions="rawTransactionsList"
              />
            </template>
            <template v-if="hasNextPage">
              <button class="account-page__load-more" type="button" @click="() => fetchNextPage()">
                Load more
              </button>
            </template>
            <template v-else>
              <p class="account-page__no-more-data">
                {{ rawTransactionsList.length ? "No more data to load" : "No data" }}
              </p>
            </template>
          </Tabs.TabsContent>
        </Tabs.Tabs>
      </Card.CardContent>
    </Card.Card>
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

import * as Card from "@/components/lib/ui/card";
import { Separator } from "@/components/lib/ui/separator";
import TransactionsList from "@/components/transactions-list/transactions-list.vue";
import * as Tabs from "@/components/lib/ui/tabs";
import SystemAccount from "./types/system/system.vue";
import MonobankAccount from "./types/monobank/monobank.vue";
import Header from "./components/header.vue";

const route = useRoute();
const accountsStore = useAccountsStore();
const { accountsRecord } = storeToRefs(accountsStore);
const account = computed(() => accountsRecord.value[+route.params.id]);

const { isAppInitialized } = storeToRefs(useRootStore());

const limit = 10;

const fetchTransactions = ({ pageParam }: { pageParam: number }) => {
  const from = pageParam * limit;
  return loadTransactions({ limit, from, accountIds: [account.value.id] });
};

const {
  data: transactionsPages,
  fetchNextPage,
  hasNextPage,
  isFetched,
} = useInfiniteQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.accountSpecificTransactions, account],
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

const rawTransactionsList = computed(() => transactionsPages.value?.pages?.flat() || []);
</script>

<style lang="scss">
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
