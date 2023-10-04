<template>
  <div class="record-list" data-cy="record-list-modal">
    <TransactionsList :transactions="transactionsPages.pages.flat()" />
    <!-- <h2>{{ props.transaction }}</h2> -->
    <!-- {{ getTransactionsList }} -->
  </div>
</template>

<script setup lang=ts>
// import { TransactionModel } from 'shared-types';
import TransactionsList from '@/components/transactions-list/transactions-list.vue';
import { loadTransactions } from '@/api/transactions';
import { VUE_QUERY_CACHE_KEYS } from '@/common/const';
import { computed } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
// import TransactionsList from './list.vue';

const props = defineProps<{
  transactionType: string;
}>();

const limit = 10;

const fetchTransactions = ({ pageParam = 0 }) => {
  const type = props.transactionType;
  const from = pageParam * limit;
  return loadTransactions({ limit, from, type });
};

const {
  data: transactionsPages,
  // fetchNextPage,
  // hasNextPage,
  // isFetched,
} = useInfiniteQuery({
  queryKey: VUE_QUERY_CACHE_KEYS.recordsPageRecordsList,
  queryFn: fetchTransactions,
  getNextPageParam: (lastPage, pages) => {
    // No more pages to load
    if (lastPage.length < limit) return undefined;
    // returns the number of pages fetched so far as the next page param
    return pages.length;
  },
  staleTime: Infinity,
});

const sortTransactions = computed(
  () => transactionsPages.value.pages.flat()
    .filter(item => item.transactionType === props.transactionType),
);
</script>

<style lang="scss" scoped>
  .record-list {
    max-width: 420px;
    max-height: 100%;
    padding: 20px;
    background-color: var(--app-surface-color);
  }
</style>
