<template>
  <WidgetWrapper
    class="expenses-structure-widget"
    title="Expenses Structure"
  >
    <div class="expenses-structure-widget__details">
      <div class="expenses-structure-widget__details-titles">
        <div
          class="
            expenses-structure-widget__details-title
            expenses-structure-widget__details-title--today
          "
        >
          Today
        </div>
        <div class="expenses-structure-widget__details-title">
          vs previous period
        </div>
      </div>
      <div class="expenses-structure-widget__details-values">
        <div class="expenses-structure-widget__today-balance">
          {{ formatBaseCurrency(-currentMonthExpense) }}
        </div>
        <div
          class="expenses-structure-widget__diff"
          :class="{
            'expenses-structure-widget__diff--positive': expensesDiff > 0,
            'expenses-structure-widget__diff--negative': expensesDiff < 0,
          }"
        >
          {{ `${expensesDiff}%` }}
        </div>
      </div>
    </div>

    <highcharts
      class="expenses-structure-widget__chart"
      :options="chartOptions"
    />
  </WidgetWrapper>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { subDays, subMonths } from 'date-fns';
import { useQuery } from '@tanstack/vue-query';
import { Chart as Highcharts } from 'highcharts-vue';
import { useFormatCurrency, useHighcharts } from '@/composable';
import { calculatePercentageDifference, fromSystemAmount } from '@/js/helpers';
import { useCategoriesStore } from '@/stores/categories/categories';
import { getSpendingsByCategories, getExpensesAmountForPeriod } from '@/api';

import WidgetWrapper from './components/widget-wrapper.vue';

const currentDayInMonth = new Date().getDate();

defineOptions({
  name: 'expenses-structure-widget',
});

const { formatBaseCurrency } = useFormatCurrency();

const { data: spendingsByCategories } = useQuery({
  queryKey: ['widget-expenses-structure-total'],
  queryFn: () => getSpendingsByCategories({
    from: subDays(new Date(), currentDayInMonth - 1),
  }),
  staleTime: Infinity,
  placeholderData: {},
});

const { data: currentMonthExpense } = useQuery({
  queryKey: ['widget-expenses-structure-current-amount'],
  queryFn: () => getExpensesAmountForPeriod({
    from: subDays(new Date(), currentDayInMonth - 1),
  }),
  staleTime: Infinity,
  placeholderData: 0,
});

const { data: prevMonthExpense } = useQuery({
  queryKey: ['widget-expenses-structure-prev-amount'],
  queryFn: () => getExpensesAmountForPeriod({
    from: subMonths(subDays(new Date(), currentDayInMonth - 1), 1),
    to: subDays(new Date(), currentDayInMonth - 1),
  }),
  staleTime: Infinity,
  placeholderData: 0,
});

const expensesDiff = computed(() => {
  const percentage = Number(calculatePercentageDifference(
    currentMonthExpense.value,
    prevMonthExpense.value,
  )).toFixed(2);
  return Number(percentage);
});

function computeTotalAmount(group): number {
  // Sum amounts from the current group's transactions
  let total = group.transactions.reduce(
    (sum, transaction) => sum + fromSystemAmount(transaction.amount),
    0,
  );

  // Recursively sum amounts from nested categories
  for (const nestedGroup of Object.values(group.nestedCategories)) {
    total += computeTotalAmount(nestedGroup);
  }

  return total;
}

const { categoriesMap } = storeToRefs(useCategoriesStore());
const { buildDonutChartConfig } = useHighcharts();
const chartOptions = computed(() => buildDonutChartConfig({
  chart: { height: 220 },
  series: [{
    type: 'pie',
    data: Object.entries(spendingsByCategories.value).reduce((acc, curr) => {
      const [categoryId, value] = curr;
      const totalTransactionsValue = computeTotalAmount(value);

      acc.push({
        name: categoriesMap.value[Number(categoryId)].name,
        color: categoriesMap.value[Number(categoryId)].color,
        y: totalTransactionsValue,
      });
      return acc;
    }, []),
  }],
}));

</script>

<style lang="scss">
.expenses-structure-widget__details-titles,
.expenses-structure-widget__details-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.expenses-structure-widget__details-titles {
  font-size: 12px;
  margin-bottom: 4px;
}
.expenses-structure-widget__details-title {
  letter-spacing: -0.3px;
}
.expenses-structure-widget__details-title--today {
  text-transform: uppercase;
  font-weight: 500;
}
.expenses-structure-widget__today-balance {
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 700;
}
.expenses-structure-widget__diff--positive {
  color: var(--app-success)
}
.expenses-structure-widget__diff--negative {
  color: var(--app-error)
}
</style>
