<template>
  <div class="transactions-list">
    <TransactionsList :transactions="transactions" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';
import { useRootStore } from '@/stores';
import { loadTransactions as apiLoadTransactions } from '@/api/transactions';

import TransactionsList from '@/components/transactions-list/transactions-list.vue';

const { isAppInitialized } = storeToRefs(useRootStore());

const { data: transactions } = useQuery({
  queryKey: ['dashboard-records-list'],
  queryFn: () => apiLoadTransactions({ limit: 8 }),
  staleTime: Infinity,
  placeholderData: [],
  enabled: isAppInitialized,
});
</script>
