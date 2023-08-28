<template>
  <section class="dashboard">
    <accounts-list class="dashboard__accounts" />

    <div class="dashboard__info">
      <BalanceTrendWidget class="dashboard__balance-trend" />
      <SpendingCategoriesWidget class="dashboard__spending-categories" />
      <LatestRecordsWidget class="dashboard__latest-records" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import AccountsList from './accounts-list/accounts-list.vue';

const BalanceTrendWidget = defineAsyncComponent(() => import('@/components/widgets/balance-trend.vue'));
const LatestRecordsWidget = defineAsyncComponent(() => import('@/components/widgets/latest-records.vue'));
const SpendingCategoriesWidget = defineAsyncComponent(() => import('@/components/widgets/expenses-structure.vue'));

defineOptions({
  name: 'page-dashboard',
});
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 24px;
}
.dashboard__info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) 420px;
  grid-template-areas: 'balance-trend spending-categories latest-records';
  margin-top: 24px;
  grid-gap: 24px;
}
.dashboard__charts {
  color: var(--app-on-surface-color);
}
.dashboard__balance-trend {
  grid-area: balance-trend;
}
.dashboard__latest-records {
  grid-area: latest-records;
}
.dashboard__spending-categories {
  grid-area: spending-categories;
}
</style>
