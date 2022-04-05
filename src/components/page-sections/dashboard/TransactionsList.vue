<template>
  <div class="transactions-list">
    <TransactionsList :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRootStore, useTransactionsStore } from '@/stores';

import TransactionsList from '@/components/TransactionsList/TransactionsList.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const rootStore = useRootStore();
    const transactionsStore = useTransactionsStore();

    const { isAppInitialized } = storeToRefs(rootStore);
    const { transactions } = storeToRefs(transactionsStore);

    watch(
      isAppInitialized,
      (value) => {
        if (value) {
          transactionsStore.loadTransactions({ limit: 8 });
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
