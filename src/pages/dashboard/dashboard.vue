<template>
  <section class="dashboard">
    <accounts-list class="dashboard__accounts" />

    <div class="dashboard__info">
      <div class="dashboard__charts">
        <BalanceTrendWidget />
      </div>
      <div class="dashboard__records">
        <LatestRecordsWidget />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BalanceTrendWidget from '@/components/widgets/balance-trend.vue';
import LatestRecordsWidget from '@/components/widgets/latest-records.vue';
import AccountsList from './accounts-list/accounts-list.vue';

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
  grid-template-columns: minmax(0, 1fr) 420px;
  margin-top: 24px;
  grid-gap: 24px;
}
.dashboard__charts {
  color: var(--app-on-surface-color);
}
</style>
