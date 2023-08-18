<template>
  <div class="current-balance-widget">
    <h3 class="current-balance-widget__title">
      Total balance (last month)
    </h3>
    <highcharts class="current-balance-widget__chart" :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, computed,
} from 'vue';
import { Chart } from 'highcharts-vue';
import { format, subDays } from 'date-fns';
import { getBalanceHistory } from '@/api';
import { fromSystemAmount, toLocalFiatCurrency } from '@/js/helpers';
import { aggregateData } from './helpers';

const loadBalanceData = async () => {
  const loadDataForDays = 30;
  const result = await getBalanceHistory({
    from: subDays(new Date(), loadDataForDays),
  });

  if (!result?.length) return [];

  return aggregateData(result);
};

export default defineComponent({
  name: 'current-balance-widget',
  components: {
    Highcharts: Chart,
  },
  setup() {
    const balanceHistory = ref([]);
    const chartOptions = computed(() => ({
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        height: 270,
      },
      title: null,
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%d %b',
        },
        // Show fullheight crosshair for the selected point
        // crosshair: true,
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
                Balance: <span>${toLocalFiatCurrency(this.y)}</span>
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
          name: 'Total balance',
          showInLegend: false,
          data: balanceHistory.value.map((point) => [
            new Date(point.date).getTime(),
            fromSystemAmount(point.amount),
          ]),
        },
      ],
      credits: false,
    }));

    onMounted(async () => {
      balanceHistory.value = await loadBalanceData();
    });

    return {
      balanceHistory,
      chartOptions,
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
