<template>
  <section class="dashboard-page">
    <accounts-list class="dashboard-page__accounts" />

    <div class="dashboard-page__period-selector">
      <button
        type="button"
        @click="selectPrevPeriod"
      >
        {{ '<' }}
      </button>
      <div class="dashboard-page__period">
        {{ periodSelectorText }}
      </div>
      <button
        type="button"
        :disabled="isCurrentPeriodSameMonth"
        @click="selectNextPeriod"
      >
        {{ '>' }}
      </button>
    </div>
    <div class="dashboard-page__info">
      <BalanceTrendWidget
        :selected-period="currentPeriod"
        class="dashboard-page__balance-trend"
      />
      <SpendingCategoriesWidget
        :selected-period="currentPeriod"
        class="dashboard-page__spending-categories"
      />
      <LatestRecordsWidget
        :selected-period="currentPeriod"
        lass="dashboard-page__latest-records"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import {
  subDays, isSameMonth, addMonths, startOfMonth, endOfMonth, subMonths, format,
} from 'date-fns';
import AccountsList from './accounts-list/accounts-list.vue';

const BalanceTrendWidget = defineAsyncComponent(() => import('@/components/widgets/balance-trend.vue'));
const LatestRecordsWidget = defineAsyncComponent(() => import('@/components/widgets/latest-records.vue'));
const SpendingCategoriesWidget = defineAsyncComponent(() => import('@/components/widgets/expenses-structure.vue'));

defineOptions({
  name: 'page-dashboard',
});

const currentDayInMonth = new Date().getDate();

const currentPeriod = ref({
  from: subDays(new Date(), currentDayInMonth - 1),
  to: new Date(),
});

const isCurrentPeriodSameMonth = computed(() => isSameMonth(new Date(), currentPeriod.value.to));
const periodSelectorText = computed(() => {
  if (isCurrentPeriodSameMonth.value) return 'Current Month';

  const from = format(currentPeriod.value.from, 'dd MMM');
  const to = format(currentPeriod.value.to, 'dd MMM');

  return `${from} - ${to}`;
});

const selectPrevPeriod = () => {
  const from = startOfMonth(subMonths(currentPeriod.value.from, 1));
  const to = endOfMonth(subMonths(currentPeriod.value.to, 1));
  currentPeriod.value = { from, to };
};
const selectNextPeriod = () => {
  const from = startOfMonth(addMonths(currentPeriod.value.from, 1));
  let to = endOfMonth(addMonths(currentPeriod.value.to, 1));

  if (isSameMonth(new Date(), to)) to = new Date();

  currentPeriod.value = { from, to };
};
</script>

<style lang="scss">
.dashboard-page {
  padding: 24px;
}
.dashboard-page__info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) 420px;
  grid-template-areas: 'balance-trend spending-categories latest-records';
  grid-gap: 24px;
}
.dashboard-page__charts {
  color: var(--app-on-surface-color);
}
.dashboard-page__balance-trend {
  grid-area: balance-trend;
}
.dashboard-page__latest-records {
  grid-area: latest-records;
}
.dashboard-page__spending-categories {
  grid-area: spending-categories;
}
.dashboard-page__period-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 24px 0;

  button {
    padding: 8px;

    &[disabled] {
      opacity: .4;
    }
  }
}
.dashboard-page__period {
  width: 150px;
  text-align: center;
}
</style>
