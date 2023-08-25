<template>
  <WidgetWrapper
    class="latest-records-widget"
    title="Latest records"
    higher
  >
    <template #action>
      <router-link
        class="latest-records-widget__show-all"
        :to="{ name: ROUTES_NAMES.records }"
      >
        Show all
      </router-link>
    </template>
    <TransactionsList :transactions="transactions" />
  </WidgetWrapper>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';
import { ROUTES_NAMES } from '@/routes/constants';
import { useRootStore } from '@/stores';
import { loadTransactions as apiLoadTransactions } from '@/api/transactions';

import TransactionsList from '@/components/transactions-list/transactions-list.vue';
import WidgetWrapper from './components/widget-wrapper.vue';

const { isAppInitialized } = storeToRefs(useRootStore());

const { data: transactions } = useQuery({
  queryKey: ['widget-latest-records'],
  queryFn: () => apiLoadTransactions({ limit: 8 }),
  staleTime: Infinity,
  placeholderData: [],
  enabled: isAppInitialized,
});
</script>

<style lang="scss">
.latest-records-widget__show-all {
  display: block;
  color: var(--ac-link-primary-base);
  text-align: center;
}
</style>
