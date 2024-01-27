<template>
  <WidgetWrapper class="latest-records-widget" title="Latest records" higher>
    <template #action>
      <router-link
        class="latest-records-widget__show-all"
        :to="{ name: ROUTES_NAMES.records }"
      >
        <ui-button variant="link" as="span" size="sm"> Show all </ui-button>
      </router-link>
    </template>
    <TransactionsList
      class="latest-records-widget__list"
      :transactions="transactions || []"
    />
  </WidgetWrapper>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useQuery } from "@tanstack/vue-query";
import { ROUTES_NAMES } from "@/routes/constants";
import { useRootStore } from "@/stores";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { loadTransactions as apiLoadTransactions } from "@/api/transactions";
import UiButton from "@/components/lib/ui/button/Button.vue";

import TransactionsList from "@/components/transactions-list/transactions-list.vue";
import WidgetWrapper from "./components/widget-wrapper.vue";

const { isAppInitialized } = storeToRefs(useRootStore());

const { data: transactions } = useQuery({
  queryKey: VUE_QUERY_CACHE_KEYS.widgetLatestRecords,
  queryFn: () => apiLoadTransactions({ limit: 9 }),
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
.latest-records-widget__list {
  gap: 5px;
}
</style>
