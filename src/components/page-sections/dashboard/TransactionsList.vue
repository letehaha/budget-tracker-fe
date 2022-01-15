<template>
  <div class="transactions-list">
    <TransactionsList :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useTransactionsStore, useRootStore } from '@/store';

import TransactionsList from '@/components/TransactionsList/TransactionsList.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const { isAppInitialized } = useRootStore();
    const { transactions, fetchTransactions } = useTransactionsStore();

    watch(
      () => isAppInitialized.value,
      (value) => {
        if (value) {
          fetchTransactions({ limit: 8 });
        }
      },
      { immediate: true },
    );

    return {
      transactions,
    };
  },
});
</script>
