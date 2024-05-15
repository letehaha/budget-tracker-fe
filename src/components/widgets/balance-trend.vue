<template>
  <WidgetWrapper title="Balance trend" :is-fetching="isWidgetDataFetching">
    <div>
      <div class="flex items-center justify-between mb-1 text-xs">
        <div class="font-medium tracking-tight uppercase">Today</div>
        <div class="tracking-tight">vs previous period</div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-lg font-bold tracking-wider">
          {{ formatBaseCurrency(todayBalance) }}
        </div>
        <div
          :class="{
            'text-[var(--app-success)]': balancesDiff < 0,
            'text-[var(--app-error)]': balancesDiff > 0,
          }"
        >
          {{ `${balancesDiff}%` }}
        </div>
      </div>
    </div>

    <highcharts
      v-node-resize-observer="{ callback: onChartResize }"
      :options="chartOptions"
    />
  </WidgetWrapper>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Chart as Highcharts } from "highcharts-vue";
import {
  getDaysInMonth,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfDay,
  subMonths,
} from "date-fns";
import { storeToRefs } from "pinia";
import { getTotalBalance } from "@/api";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { calculatePercentageDifference, formatLargeNumber } from "@/js/helpers";
import { useFormatCurrency, useHighcharts } from "@/composable";
import { loadBalanceTrendData } from "@/services";

import { useCurrenciesStore } from "@/stores";
import WidgetWrapper from "./components/widget-wrapper.vue";

// Calculate it manually so shart will always have first and last ticks (dates)
function generateDateSteps(datesToShow = 5, date = new Date()) {
  const step = Math.round(getDaysInMonth(date) / datesToShow);
  const start = startOfMonth(date).getTime();
  const end = startOfDay(endOfMonth(date)).getTime();

  const dates = [start];
  while (dates[dates.length - 1] < end) {
    const nextDate = addDays(dates[dates.length - 1], step).getTime();
    dates.push(nextDate <= end ? nextDate : end);
  }

  return dates;
}

defineOptions({
  name: "balance-trend-widget",
});

const props = withDefaults(
  defineProps<{
    selectedPeriod?: { from: Date; to: Date };
  }>(),
  {
    selectedPeriod: () => ({
      from: startOfMonth(new Date()),
      to: new Date(),
    }),
  },
);

const periodFrom = ref(new Date().getTime());
const currentChartWidth = ref(0);
const { formatBaseCurrency } = useFormatCurrency();
const { baseCurrency } = storeToRefs(useCurrenciesStore());
const { buildAreaChartConfig } = useHighcharts();

watch(
  () => props.selectedPeriod.from,
  () => {
    periodFrom.value = props.selectedPeriod.from.getTime();
  },
);

const { data: _balanceHistory, isFetching: isBalanceHistoryFetching } =
  useQuery({
    queryKey: [...VUE_QUERY_CACHE_KEYS.widgetBalanceTrend, periodFrom],
    queryFn: () => loadBalanceTrendData(props.selectedPeriod),
    staleTime: Infinity,
  });
const { data: _todayBalance, isFetching: isTodayBalanceFetching } = useQuery({
  queryKey: [...VUE_QUERY_CACHE_KEYS.widgetBalanceTotalBalance, periodFrom],
  queryFn: () => getTotalBalance({ date: props.selectedPeriod.to }),
  placeholderData: 0,
  staleTime: Infinity,
});
const { data: _previousBalance, isFetching: isPreviousBalanceFetching } =
  useQuery({
    queryKey: [
      ...VUE_QUERY_CACHE_KEYS.widgetBalancePreviousBalance,
      periodFrom,
    ],
    queryFn: () =>
      getTotalBalance({
        date: endOfMonth(subMonths(props.selectedPeriod.to, 1)),
      }),
    placeholderData: 0,
    staleTime: Infinity,
  });

const isWidgetDataFetching = computed(
  () =>
    isBalanceHistoryFetching.value ||
    isTodayBalanceFetching.value ||
    isPreviousBalanceFetching.value,
);

// We store actual data separately, so when new data is loading, we can still show
// the old data, to avoid UI flickering
const balanceHistory = ref([]);
const todayBalance = ref(0);
const previousBalance = ref(0);
const actualDataPeriod = ref(props.selectedPeriod);

watch(
  isWidgetDataFetching,
  (value) => {
    // When full data is loaded,
    if (value === false) {
      balanceHistory.value = _balanceHistory.value;
      todayBalance.value = _todayBalance.value;
      previousBalance.value = _previousBalance.value;
      actualDataPeriod.value = props.selectedPeriod;
    }
  },
  { immediate: true },
);

const chartOptions = computed(() => {
  const pixelsPerTick = 120;
  const ticksAmount = currentChartWidth.value
    ? Math.round(currentChartWidth.value / pixelsPerTick)
    : 5;

  const fromDate = actualDataPeriod.value.from;
  const toDate = actualDataPeriod.value.to;

  const config = buildAreaChartConfig({
    chart: {
      height: 220,
      marginTop: 20,
    },
    xAxis: {
      tickPositions: generateDateSteps(ticksAmount, fromDate),
    },
    yAxis: {
      tickAmount: 5,
      labels: {
        formatter() {
          return formatLargeNumber(this.value, {
            isFiat: true,
            currency: baseCurrency.value?.currency?.code,
          });
        },
      },
    },
    series: [
      {
        type: "area",
        showInLegend: false,
        data: [
          ...(balanceHistory.value || []).map((point) => [
            new Date(point.date).getTime(),
            point.amount,
          ]),
          // fill remaining days with `null` so chart will be rendered for all
          // days in the month
          ...Array(getDaysInMonth(toDate) - toDate.getDate())
            .fill([])
            .map((_, i) => [addDays(toDate, i + 1).getTime(), null]),
        ],
      },
    ],
  });

  return config;
});
const balancesDiff = computed<number>(() => {
  if (!todayBalance.value || !previousBalance.value) return 0;

  const percentage = Number(
    calculatePercentageDifference(todayBalance.value, previousBalance.value),
  ).toFixed(2);
  return Number(percentage);
});

const onChartResize = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0];
  currentChartWidth.value = entry.contentRect.width;
};
</script>
