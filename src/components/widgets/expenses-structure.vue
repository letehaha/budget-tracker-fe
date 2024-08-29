<template>
  <WidgetWrapper title="Expenses Structure" :is-fetching="isWidgetDataFetching">
    <template v-if="isDataEmpty">
      <EmptyState>
        <ChartPieIcon class="size-32" />
      </EmptyState>
    </template>
    <template v-else>
      <div>
        <div class="flex items-center justify-between mb-1 text-xs">
          <div class="font-medium tracking-tight uppercase">Today</div>
          <div class="tracking-tight">vs previous period</div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-lg font-bold tracking-wider">
            {{ formatBaseCurrency(-(currentMonthExpense || 0)) }}
          </div>

          <div
            :class="{
              'text-[var(--app-error)]': expensesDiff < 0,
              'text-[var(--app-success)]': expensesDiff > 0,
            }"
          >
            {{ `${expensesDiff}%` }}
          </div>
        </div>
      </div>

      <highcharts :options="chartOptions" />
    </template>
  </WidgetWrapper>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useQuery } from "@tanstack/vue-query";
import { Chart as Highcharts } from "highcharts-vue";
import { ChartPieIcon } from "lucide-vue-next";
import { useFormatCurrency, useHighcharts } from "@/composable";
import { calculatePercentageDifference } from "@/js/helpers";
import { getSpendingsByCategories, getExpensesAmountForPeriod } from "@/api";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import WidgetWrapper from "./components/widget-wrapper.vue";
import EmptyState from "./components/empty-state.vue";

defineOptions({
  name: "expenses-structure-widget",
});

const props = defineProps<{
  selectedPeriod: { from: Date; to: Date };
}>();

const { formatBaseCurrency } = useFormatCurrency();
const periodFrom = ref(new Date().getTime());

watch(
  () => props.selectedPeriod.from,
  () => {
    periodFrom.value = props.selectedPeriod.from.getTime();
  },
);

const { data: spendingsByCategories, isFetching: isSpendingsByCategoriesFetching } = useQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.widgetExpensesStructureTotal, periodFrom],
  queryFn: () =>
    getSpendingsByCategories({
      from: props.selectedPeriod.from,
      to: props.selectedPeriod.to,
    }),
  staleTime: Infinity,
  placeholderData: (previousData) => previousData || {},
});

const { data: currentMonthExpense, isFetching: isCurrentMonthExpenseFetching } = useQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.widgetExpensesStructureCurrentAmount, periodFrom],
  queryFn: () =>
    getExpensesAmountForPeriod({
      from: props.selectedPeriod.from,
      to: props.selectedPeriod.to,
    }),
  staleTime: Infinity,
  placeholderData: (previousData) => previousData || 0,
});

const { data: prevMonthExpense, isFetching: isPrevMonthExpenseFetching } = useQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.widgetExpensesStructurePrevAmount, periodFrom],
  queryFn: () =>
    getExpensesAmountForPeriod({
      from: startOfMonth(subMonths(props.selectedPeriod.from, 1)),
      to: endOfMonth(subMonths(props.selectedPeriod.to, 1)),
    }),
  staleTime: Infinity,
  placeholderData: (previousData) => previousData || 0,
});

const isWidgetDataFetching = computed(
  () =>
    isSpendingsByCategoriesFetching.value ||
    isCurrentMonthExpenseFetching.value ||
    isPrevMonthExpenseFetching.value,
);

const expensesDiff = computed(() => {
  const percentage = Number(
    calculatePercentageDifference(currentMonthExpense.value || 0, prevMonthExpense.value || 0),
  ).toFixed(2);
  return Number(percentage);
});

const { buildDonutChartConfig } = useHighcharts();

const chartSeries = computed(() =>
  Object.values(spendingsByCategories.value || {}).map((value) => ({
    name: value.name,
    color: value.color,
    y: value.amount,
  })),
);

const isDataEmpty = computed(() => chartSeries.value.length === 0);

const chartOptions = computed(() =>
  buildDonutChartConfig({
    chart: { height: 220 },
    series: [
      {
        type: "pie",
        data: chartSeries.value,
      },
    ],
  }),
);
</script>
