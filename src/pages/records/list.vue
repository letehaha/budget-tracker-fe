<template>
  <div class="transactions-list">
    <div class="transactions-list__list">
      <template v-if="isFetched && transactionsPages">
        <TransactionsList :transactions="transactionsPages.pages.flat()" />
      </template>
    </div>
    <template v-if="hasNextPage">
      <button
        class="transactions-list__load-more"
        type="button"
        @click="() => fetchNextPage()"
      >
        Load more
      </button>
    </template>
    <template v-else>
      <p>No more data to load</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { loadTransactions } from '@/api/transactions';

import TransactionsList from '@/components/transactions-list/transactions-list.vue';
import { VUE_QUERY_CACHE_KEYS } from '@/common/const';

const limit = 20;

const fetchTransactions = ({ pageParam = 0 }) => {
  const from = pageParam * limit;
  return loadTransactions({ limit, from });
};

const {
  data: transactionsPages,
  fetchNextPage,
  hasNextPage,
  isFetched,
} = useInfiniteQuery({
  queryKey: [VUE_QUERY_CACHE_KEYS.recordsPageRecordsList],
  queryFn: fetchTransactions,
  getNextPageParam: (lastPage, pages) => {
    // No more pages to load
    if (lastPage.length < limit) return undefined;
    // returns the number of pages fetched so far as the next page param
    return pages.length;
  },
  staleTime: Infinity,
});
</script>

<style lang="scss" scoped>
.transactions-list__load-more {
  background-color: transparent;
  border: none;
  cursor: pointer;

  color: var(--app-primary);

  display: block;
  margin: auto;

  font-size: 16px;

  margin-top: 32px;
}
</style>
