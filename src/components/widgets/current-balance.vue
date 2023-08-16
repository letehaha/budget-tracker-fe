<template>
  <div class="current-balance-widget">
    <h3 class="current-balance-widget__title">
      Total balance (last month)
    </h3>
    <highcharts
      :options="chartOptions"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
} from 'vue';
import { Chart } from 'highcharts-vue';
import { subDays } from 'date-fns';
import { getBalanceHistory } from '@/api';
import { fromSystemAmount } from '@/js/helpers';
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
        headerFormat: '<span style="font-size: 14px">{point.key}</span><br>',
        pointFormat: '<span> <span>Total balance:</span> <b>{point.y}</b><br/>',
        backgroundColor: 'var(--app-bg-box)',
        borderColor: 'transparent',
        shadow: false,
        borderRadius: 8,
        style: {
          color: 'var(--app-text-base)',
        },
      },
      series: [{
        name: 'Total balance',
        showInLegend: false,
        data: balanceHistory.value.map(
          (point) => [new Date(point.date).getTime(), fromSystemAmount(point.amount)],
        ),
      }],
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
}
.current-balance-widget__title {
  margin-bottom: 24px;
}
</style>
