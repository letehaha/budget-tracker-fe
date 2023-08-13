<template>
  <div class="transactions-list">
    <div class="transactions-list__list">
      <TransactionsList :transactions="transactions" />
    </div>
    <button
      class="transactions-list__load-more"
      type="button"
      @click="loadNext"
    >
      Load more
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { loadTransactions } from '@/api/transactions';

import TransactionsList from '@/components/transactions-list/transactions-list.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const limit = 20;
    const from = ref(0);
    const transactions = ref([]);

    const loadNext = async () => {
      const result = await loadTransactions({ limit, from: from.value });

      transactions.value.push(...result);

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

  color: var(--primary-500);

  display: block;
  margin: auto;

  font-size: 16px;

  margin-top: 32px;
}
</style>
