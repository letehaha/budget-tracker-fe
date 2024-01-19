<template>
  <div class="record-list" data-cy="record-list-modal">
    <template v-if="isFetched && transactionsPages">
      <div
        v-for="item in transactionsPages?.pages?.flat()"
        :key="item.id"
      >
        <TransactionRecrod :tx="item" @record-click="handlerRecordClick" />
      </div>
    </template>
    <template v-if="hasNextPage">
      <button
        class="record-list__load-more"
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

<script setup lang=ts>
import { loadTransactions } from '@/api/transactions';
import { VUE_QUERY_CACHE_KEYS } from '@/common/const';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { TRANSACTION_TYPES, TransactionModel } from 'shared-types';
import { EVENTS as MODAL_EVENTS } from '@/components/modal-center/ui-modal.vue';
import TransactionRecrod from '@/components/transactions-list/transaction-record.vue';

export interface RecordListModalProps {
  transactionType: TRANSACTION_TYPES;
  onSelect:(item: TransactionModel) => void;
}

const props = defineProps<RecordListModalProps>();

const emit = defineEmits([MODAL_EVENTS.closeModal]);

const limit = 15;
const fetchTransactions = ({ pageParam = 0 }) => {
  const type = props.transactionType;
  const from = pageParam * limit;
  return loadTransactions({ limit, from, type });
};

const {
  data: transactionsPages,
  fetchNextPage,
  hasNextPage,
  isFetched,
} = useInfiniteQuery({
  queryKey: [VUE_QUERY_CACHE_KEYS.recordsPageTransactionList, props.transactionType],
  queryFn: fetchTransactions,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => {
    // No more pages to load
    if (lastPage.length < limit) return undefined;
    // returns the number of pages fetched so far as the next page param
    return pages.length;
  },
  staleTime: Infinity,
});

const handlerRecordClick = (transaction) => {
  props.onSelect(transaction);
  emit(MODAL_EVENTS.closeModal);
};
</script>

<style lang="scss" scoped>
  .record-list {
    max-width: 420px;
    max-height: 100%;
    padding: 20px;
    overflow-x: hidden;
    background-color: var(--app-surface-color);
  }
  .record-list__load-more {
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
