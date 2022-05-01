<template>
  <div class="transactions-list">
    <TransactionsList :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRootStore } from '@/stores';
import { loadTransactions } from '@/api/transactions';

import TransactionsList from '@/components/TransactionsList/TransactionsList.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const rootStore = useRootStore();

    const { isAppInitialized } = storeToRefs(rootStore);
    const transactions = ref([]);

    watch(
      isAppInitialized,
      async (value) => {
        if (value) {
          const result = await loadTransactions({ limit: 8 });

          transactions.value = result;
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
