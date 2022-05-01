<template>
  <div class="transactions-list">
    <div class="transactions-list__list">
      <TransactionsList :transactions="transactions" />
    </div>
    <button
      class="transactions-list__load-more"
      @click="loadNext"
    >
      Load more
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionsStore } from '@/stores';

import TransactionsList from '@/components/TransactionsList/TransactionsList.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const transactionsStore = useTransactionsStore();
    const { transactions } = storeToRefs(transactionsStore);

    const limit = 20;
    const from = ref(0);

    const loadNext = () => {
      transactionsStore.loadTransactions({ limit, from: from.value });
      from.value += limit;
    };

    loadNext();

    return {
      transactions,
      loadNext,
    };
  },
});
</script>

<style lang="scss" scoped>
.transactions-list__load-more {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;

  color: var(--primary-500);

  display: block;
  margin: auto;

  font-size: 16px;

  margin-top: 32px;
}
</style>
