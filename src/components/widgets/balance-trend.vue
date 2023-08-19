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

<script lang="ts">
import {
  defineComponent, onMounted, ref, computed,
} from 'vue';
import { Chart } from 'highcharts-vue';
import {
  format, subDays, getDaysInMonth, addDays,
  startOfMonth, endOfMonth, startOfDay, subMonths,
} from 'date-fns';
import { storeToRefs } from 'pinia';
import { getBalanceHistory, getTotalBalance } from '@/api';
import { fromSystemAmount, toLocalFiatCurrency, calculatePercentageDifference } from '@/js/helpers';
import { useCurrenciesStore } from '@/stores';
import { useFormatCurrency } from '@/composable';

import { aggregateData } from './helpers';

const currentDayInMonth = new Date().getDate();

const loadBalanceData = async ({ from }: { from: Date }) => {
  const result = await getBalanceHistory({ from });

  if (!result?.length) return [];

  return aggregateData(result);
};

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

export default defineComponent({
  name: 'balance-trend-widget',
  components: {
    Highcharts: Chart,
  },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const { baseCurrency } = storeToRefs(currenciesStore);
    const balanceHistory = ref<{ amount: number; date: string }[]>([]);
    const currentChartWidth = ref(null);
    const { formatBaseCurrency } = useFormatCurrency();
    const chartOptions = computed(() => {
      const pixelsPerTick = 120;
      const ticksAmount = currentChartWidth.value
        ? Math.round(currentChartWidth.value / pixelsPerTick)
        : 5;

      return {
        chart: {
          type: 'area',
          backgroundColor: 'transparent',
          height: 220,
        },
        // So xAxis will be rendered correctly but not as hours
        time: {
          useUTC: false,
        },
        title: null,
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            day: '%d %b',
          },
          // Show fullheight crosshair for the selected point
          // crosshair: true
          tickPositions: generateDateSteps(ticksAmount),
          gridLineWidth: 0,
          labels: {
            style: {
              color: 'var(--app-text-base)',
            },
          },
        },
        yAxis: {
          title: null,
          labels: {
            style: {
              color: 'var(--app-text-base)',
            },
          },
          gridLineColor: 'rgba(var(--app-primary-rgb), 0.1)',
        },
        plotOptions: {
          area: {
            fillOpacity: 0.5,
            lineColor: 'var(--app-primary)',
            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 3,
              },
            },
            threshold: null,
            fillColor: {
              linearGradient: {
                x1: 0, x2: 0, y1: 0, y2: 1,
              },
              stops: [
                [0, 'rgba(var(--app-primary-rgb), 0.3)'],
                [1, 'rgba(var(--app-primary-rgb), 0)'],
              ],
            },
            marker: {
              // Disable markers so the line will be smoother
              enabled: false,
              states: {
                hover: {
                  enabled: true,
                  fillColor: 'var(--app-primary)',
                  lineColor: 'var(--app-primary)',
                  lineWidth: 0,
                },
              },
            },
          },
        },
        tooltip: {
          useHTML: true,
          backgroundColor: 'var(--app-bg-box)',
          borderColor: 'transparent',
          formatter() {
            return `
              <div class="balance-trend-widget__tooltip">
                <div class="balance-trend-widget__tooltip-date">
                  ${format(this.x, 'MMMM d, yyyy')}
                </div>
                <div class="balance-trend-widget__tooltip-value">
                  Balance: <span>${toLocalFiatCurrency(this.y, { currency: baseCurrency.value.currency.code })}</span>
                </div>
              </div>
            `;
          },
          shadow: false,
          borderRadius: 8,
          style: {
            color: 'var(--app-text-base)',
          },
        },
        series: [
          {
            showInLegend: false,
            data: [
              ...balanceHistory.value.map((point) => [
                new Date(point.date).getTime(),
                fromSystemAmount(point.amount),
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
        credits: false,
      };
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
      balanceHistory.value = await loadBalanceData({
        from: subDays(new Date(), currentDayInMonth - 1),
      });
      todayBalance.value = await getTotalBalance({ date: new Date() });
      previousBalance.value = await getTotalBalance({
        date: subMonths(new Date(), 1),
      });
    });

    return {
      balanceHistory,
      formatBaseCurrency,
      chartOptions,
      baseCurrency,
      todayBalance,
      previousBalance,
      balancesDiff,
      onChartResize,
    };
  },
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
