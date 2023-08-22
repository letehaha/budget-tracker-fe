<template>
  <div class="balance-trend-widget">
    <h3 class="balance-trend-widget__title">
      Balance trend
    </h3>
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { Chart as Highcharts } from 'highcharts-vue';
import {
  subDays, getDaysInMonth, addDays,
  startOfMonth, endOfMonth, startOfDay, subMonths,
} from 'date-fns';
import { getTotalBalance } from '@/api';
import { calculatePercentageDifference } from '@/js/helpers';
import { useFormatCurrency, useHighcharts } from '@/composable';
import { loadBalanceTrendData } from '@/services';

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

const balanceHistory = ref<{ amount: number; date: string }[]>([]);
const currentChartWidth = ref(null);
const { formatBaseCurrency } = useFormatCurrency();
const { buildAreaChartConfig } = useHighcharts();
const chartOptions = computed(() => {
  const pixelsPerTick = 120;
  const ticksAmount = currentChartWidth.value
    ? Math.round(currentChartWidth.value / pixelsPerTick)
    : 5;

  return buildAreaChartConfig({
    chart: { height: 220 },
    xAxis: {
      tickPositions: generateDateSteps(ticksAmount),
    },
    series: [
      {
        type: 'area',
        showInLegend: false,
        data: [
          ...balanceHistory.value.map((point) => [
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
});
const todayBalance = ref(null);
const previousBalance = ref(null);
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

onMounted(async () => {
  balanceHistory.value = await loadBalanceTrendData({
    from: subDays(new Date(), currentDayInMonth - 1),
  });
  todayBalance.value = await getTotalBalance({ date: new Date() });
  previousBalance.value = await getTotalBalance({
    date: subMonths(new Date(), 1),
  });
});
</script>

<style lang="scss">
.balance-trend-widget {
  background-color: var(--app-surface-color);
  padding: 24px;
  border-radius: 12px;
  max-height: 350px;
}
.balance-trend-widget__title {
  margin-bottom: 12px;
}
.balance-trend-widget__tooltip {
  padding: 4px;
}
.balance-trend-widget__tooltip-date {
  font-size: 14px;
  margin-bottom: 8px;
}
.balance-trend-widget__tooltip-value {
  font-size: 18px;

  span {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
  }
}
.balance-trend-widget__details {
  margin-bottom: 12px;
}
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
