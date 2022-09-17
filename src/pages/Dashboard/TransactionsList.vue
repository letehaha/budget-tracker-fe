<template>
  <div class="transactions-list">
    <TransactionsList :transactions="transactions" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  watch,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useRootStore } from '@/stores';
import { loadTransactions as apiLoadTransactions } from '@/api/transactions';
import { eventBus, BUS_EVENTS } from '@/js/utils';

import TransactionsList from '@/components/TransactionsList/TransactionsList.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const rootStore = useRootStore();

    const { isAppInitialized } = storeToRefs(rootStore);
    const transactions = ref([]);

    const loadTransactions = async () => {
      const result = await apiLoadTransactions({ limit: 8 });

      transactions.value = result;
    };

    eventBus.on(BUS_EVENTS.transactionChange, loadTransactions);

    onBeforeUnmount(() => {
      eventBus.off(BUS_EVENTS.transactionChange, loadTransactions);
    });

    watch(
      isAppInitialized,
      async (value) => {
        if (value) {
          loadTransactions();
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
