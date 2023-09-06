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
            'expenses-structure-widget__diff--positive': expensesDiff < 0,
            'expenses-structure-widget__diff--negative': expensesDiff > 0,
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
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/vue-query';
import { Chart as Highcharts } from 'highcharts-vue';
import { useFormatCurrency, useHighcharts } from '@/composable';
import { calculatePercentageDifference } from '@/js/helpers';
import { fromSystemAmount } from '@/api/helpers';
import { useCategoriesStore } from '@/stores/categories/categories';
import { getSpendingsByCategories, getExpensesAmountForPeriod } from '@/api';
import { VUE_QUERY_CACHE_KEYS } from '@/common/const';
import WidgetWrapper from './components/widget-wrapper.vue';

defineOptions({
  name: 'expenses-structure-widget',
});

const props = withDefaults(defineProps<{
  selectedPeriod?: { from: Date; to: Date };
}>(), {
  selectedPeriod: () => ({
    from: startOfMonth(new Date()),
    to: new Date(),
  }),
});

const { formatBaseCurrency } = useFormatCurrency();
const periodFrom = ref(new Date().getTime());

watch(() => props.selectedPeriod.from, () => {
  periodFrom.value = props.selectedPeriod.from.getTime();
});

const { data: spendingsByCategories } = useQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.widgetExpensesStructureTotal, periodFrom],
  queryFn: () => getSpendingsByCategories({
    from: props.selectedPeriod.from,
    to: props.selectedPeriod.to,
  }),
  staleTime: Infinity,
  placeholderData: {},
});

const { data: currentMonthExpense } = useQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.widgetExpensesStructureCurrentAmount, periodFrom],
  queryFn: () => getExpensesAmountForPeriod({
    from: props.selectedPeriod.from,
    to: props.selectedPeriod.to,
  }),
  staleTime: Infinity,
  placeholderData: 0,
});

const { data: prevMonthExpense } = useQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.widgetExpensesStructurePrevAmount, periodFrom],
  queryFn: () => getExpensesAmountForPeriod({
    from: startOfMonth(subMonths(props.selectedPeriod.from, 1)),
    to: endOfMonth(subMonths(props.selectedPeriod.to, 1)),
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
    (sum, transaction) => sum + fromSystemAmount(transaction.refAmount),
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
