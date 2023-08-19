<template>
  <div class="current-balance-widget">
    <h3 class="current-balance-widget__title">
      Balance trend
    </h3>
    <highcharts
      v-node-resize-observer="{ callback: onChartResize }"
      class="current-balance-widget__chart"
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
  format, subDays, getDaysInMonth, addDays, startOfMonth, endOfMonth, startOfDay,
} from 'date-fns';
import { storeToRefs } from 'pinia';
import { getBalanceHistory } from '@/api';
import { fromSystemAmount, toLocalFiatCurrency } from '@/js/helpers';
import { useCurrenciesStore } from '@/stores';
import { aggregateData } from './helpers';

const currentDayInMonth = new Date().getDate();

const loadBalanceData = async () => {
  const result = await getBalanceHistory({
    from: subDays(new Date(), currentDayInMonth - 1),
  });

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
  name: 'current-balance-widget',
  components: {
    Highcharts: Chart,
  },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const { baseCurrency } = storeToRefs(currenciesStore);
    const balanceHistory = ref<{ amount: number; date: string }[]>([]);
    const currentChartWidth = ref(null);
    const chartOptions = computed(() => {
      const pixelsPerTick = 120;
      const ticksAmount = currentChartWidth.value
        ? Math.round(currentChartWidth.value / pixelsPerTick)
        : 5;

      return {
        chart: {
          type: 'area',
          backgroundColor: 'transparent',
          height: 270,
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
              <div class="current-balance-widget__tooltip">
                <div class="current-balance-widget__tooltip-date">
                  ${format(this.x, 'MMMM d, yyyy')}
                </div>
                <div class="current-balance-widget__tooltip-value">
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

    const onChartResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      currentChartWidth.value = entry.contentRect.width;
    };

    onMounted(async () => {
      balanceHistory.value = await loadBalanceData();
    });

    return {
      balanceHistory,
      chartOptions,
      baseCurrency,
      onChartResize,
    };
  },
});
</script>

<style lang="scss">
.current-balance-widget {
  background-color: var(--app-surface-color);
  padding: 24px;
  border-radius: 12px;
  max-height: 350px;
}
.current-balance-widget__title {
  margin-bottom: 24px;
}
.current-balance-widget__tooltip {
  padding: 4px;
}
.current-balance-widget__tooltip-date {
  font-size: 14px;
  margin-bottom: 8px;
}
.current-balance-widget__tooltip-value {
  font-size: 18px;

  span {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
  }
}
</style>
