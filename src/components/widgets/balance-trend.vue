<template>
  <WidgetWrapper
    class="balance-trend-widget"
    title="Balance trend"
  >
    <div class="balance-trend-widget__details">
      <div class="balance-trend-widget__details-titles">
        <div class="balance-trend-widget__details-title balance-trend-widget__details-title--today">
          Today
        </div>
        <div class="balance-trend-widget__details-title">
          vs previous period
        </div>
      </div>
      <div class="balance-trend-widget__details-values">
        <div class="balance-trend-widget__today-balance">
          {{ formatBaseCurrency(todayBalance) }}
        </div>
        <div
          class="balance-trend-widget__diff"
          :class="{
            'balance-trend-widget__diff--positive': balancesDiff > 0,
            'balance-trend-widget__diff--negative': balancesDiff < 0,
          }"
        >
          {{ `${balancesDiff}%` }}
        </div>
      </div>
    </div>

    <highcharts
      v-node-resize-observer="{ callback: onChartResize }"
      class="balance-trend-widget__chart"
      :options="chartOptions"
    />
  </WidgetWrapper>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Chart as Highcharts } from 'highcharts-vue';
import {
  subDays, getDaysInMonth, addDays,
  startOfMonth, endOfMonth, startOfDay, subMonths,
} from 'date-fns';
import { storeToRefs } from 'pinia';
import { getTotalBalance } from '@/api';
import { VUE_QUERY_CACHE_KEYS } from '@/common/const';
import { calculatePercentageDifference, formatLargeNumber } from '@/js/helpers';
import { useFormatCurrency, useHighcharts } from '@/composable';
import { loadBalanceTrendData } from '@/services';

import { useCurrenciesStore } from '@/stores';
import WidgetWrapper from './components/widget-wrapper.vue';

const currentDayInMonth = new Date().getDate();

// Calculate it manually so shart will always have first and last ticks (dates)
function generateDateSteps(datesToShow = 5) {
  const step = Math.round(getDaysInMonth(new Date()) / datesToShow);
  const start = startOfMonth(new Date()).getTime();
  const end = startOfDay(endOfMonth(new Date())).getTime();

  const dates = [start];
  while (dates[dates.length - 1] < end) {
    const nextDate = addDays(dates[dates.length - 1], step).getTime();
    dates.push(nextDate <= end ? nextDate : end);
  }

  return dates;
}

defineOptions({
  name: 'balance-trend-widget',
});

const currentChartWidth = ref(null);
const { formatBaseCurrency } = useFormatCurrency();
const { baseCurrency } = storeToRefs(useCurrenciesStore());
const { buildAreaChartConfig } = useHighcharts();

const { data: balanceHistory } = useQuery({
  queryKey: VUE_QUERY_CACHE_KEYS.widgetBalanceTrend,
  queryFn: () => loadBalanceTrendData({
    from: subDays(new Date(), currentDayInMonth - 1),
  }),
  staleTime: Infinity,
});
const { data: todayBalance } = useQuery({
  queryKey: VUE_QUERY_CACHE_KEYS.widgetBalanceTotalBalance,
  queryFn: () => getTotalBalance({ date: new Date() }),
  staleTime: Infinity,
});
const { data: previousBalance } = useQuery({
  queryKey: VUE_QUERY_CACHE_KEYS.widgetBalancePreviousBalance,
  queryFn: () => getTotalBalance({
    date: subMonths(new Date(), 1),
  }),
  staleTime: Infinity,
});

const chartOptions = computed(() => {
  const pixelsPerTick = 120;
  const ticksAmount = currentChartWidth.value
    ? Math.round(currentChartWidth.value / pixelsPerTick)
    : 5;

  const config = buildAreaChartConfig({
    chart: {
      height: 220,
      marginTop: 20,
    },
    xAxis: {
      tickPositions: generateDateSteps(ticksAmount),
    },
    yAxis: {
      tickAmount: 5,
      labels: {
        formatter() {
          return formatLargeNumber(this.value, {
            isFiat: true,
            currency: baseCurrency.value.currency.code,
          });
        },
      },
    },
    series: [
      {
        type: 'area',
        showInLegend: false,
        data: [
          ...(balanceHistory.value || []).map((point) => [
            new Date(point.date).getTime(),
            point.amount,
          ]),
          // fill remaining days with `null` so chart will be rendered for all
          // days in the month
          ...Array(getDaysInMonth(new Date()) - currentDayInMonth)
            .fill([])
            .map((_, i) => [
              addDays(new Date(), i + 1).getTime(),
              null,
            ]),
        ],
      },
    ],
  });

  return config;
});
const balancesDiff = computed<number>(() => {
  if (!todayBalance.value || !previousBalance.value) return 0;

  const percentage = Number(calculatePercentageDifference(
    todayBalance.value,
    previousBalance.value,
  )).toFixed(2);
  return Number(percentage);
});

const onChartResize = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0];
  currentChartWidth.value = entry.contentRect.width;
};
</script>

<style lang="scss">
.balance-trend-widget__details-titles,
.balance-trend-widget__details-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.balance-trend-widget__details-titles {
  font-size: 12px;
  margin-bottom: 4px;
}
.balance-trend-widget__details-title {
  letter-spacing: -0.3px;
}
.balance-trend-widget__details-title--today {
  text-transform: uppercase;
  font-weight: 500;
}
.balance-trend-widget__today-balance {
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 700;
}
.balance-trend-widget__diff--positive {
  color: var(--app-success)
}
.balance-trend-widget__diff--negative {
  color: var(--app-error)
}
</style>
