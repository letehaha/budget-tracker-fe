<template>
  <div class="transactions-list">
    <TransactionsList :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionsStore } from '@/newStore';
import { useRootStore } from '@/store';

import TransactionsList from '@/components/TransactionsList/TransactionsList.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const { isAppInitialized } = useRootStore();
    const transactionsStore = useTransactionsStore();
    const { transactions } = storeToRefs(transactionsStore);

    watch(
      () => isAppInitialized.value,
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
