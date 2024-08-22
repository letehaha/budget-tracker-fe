<script setup lang="ts">
import { TRANSACTION_TYPES, TransactionModel } from "shared-types";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { CircleAlert } from "lucide-vue-next";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { loadTransactions } from "@/api/transactions";
import { EVENTS as MODAL_EVENTS } from "@/components/modal-center/ui-modal.vue";
import TransactionRecrod from "@/components/transactions-list/transaction-record.vue";
import Button from "@/components/lib/ui/button/Button.vue";

export interface RecordListModalProps {
  transactionType: TRANSACTION_TYPES;
  onSelect: (item: TransactionModel) => void;
}

const props = defineProps<RecordListModalProps>();

const emit = defineEmits([MODAL_EVENTS.closeModal]);

const limit = 15;
const fetchTransactions = ({ pageParam = 0 }) => {
  const type = props.transactionType;
  const from = pageParam * limit;
  return loadTransactions({ limit, from, type, excludeTransfer: true, excludeRefunds: true });
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

const handlerRecordClick = (transaction: TransactionModel) => {
  props.onSelect(transaction);
  emit(MODAL_EVENTS.closeModal);
};
</script>

<template>
  <div class="grid gap-4 grid-rows-[minmax(0,1fr)_max-content]">
    <div class="overflow-y-auto">
      <template v-if="isFetched && transactionsPages">
        <template v-for="item in transactionsPages?.pages?.flat()" :key="item.id">
          <TransactionRecrod
            :tx="item"
            @record-click="(payload) => handlerRecordClick(payload[0])"
          />
        </template>
      </template>
    </div>

    <template v-if="hasNextPage">
      <Button variant="secondary" @click="() => fetchNextPage()"> Load more </Button>
    </template>
    <template v-else-if="!hasNextPage && transactionsPages?.pages?.flat().length">
      <p class="mt-4 text-center text-sm">No more transactions to load</p>
    </template>
    <template v-else>
      <p class="text-center text-sm text-white/80 max-w-[80%] mx-auto">
        <CircleAlert :size="48" class="m-auto mb-4" />
        <template v-if="transactionType === TRANSACTION_TYPES.income">
          There's no income transactions in the system. Create some to proceed
        </template>
        <template v-else-if="transactionType === TRANSACTION_TYPES.expense">
          There's no expense transactions in the system. Create some to proceed
        </template>
        <template v-else> There's no transactions to select. Create some to proceed </template>
      </p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.record-list {
  max-width: 420px;
  width: 100%;
  max-height: 100%;
  padding: 16px;
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

