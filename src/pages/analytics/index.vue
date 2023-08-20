<template>
  <div class="analytics">
    Analytics

    <div class="analytics__block">
      <div class="analytics__block-dropdown">
        <button
          type="button"
          @click="isDropdownVisible = !isDropdownVisible"
        >
          {{ currentTimePeriod.label }}
        </button>
        <dropdown
          :is-visible="isDropdownVisible"
          :values="timePeriods"
          :selected-value="currentTimePeriod"
          @select="selectPeriod"
        />
      </div>

      <highcharts
        v-node-resize-observer="{ callback: onChartResize }"
        class="balance-trend-widget__chart"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, watchEffect, defineAsyncComponent,
} from 'vue';
import { Chart } from 'highcharts-vue';
import { format, subDays } from 'date-fns';
import { storeToRefs } from 'pinia';
import { getBalanceHistory } from '@/api';
import { fromSystemAmount, toLocalFiatCurrency } from '@/js/helpers';
import { useCurrenciesStore } from '@/stores';
import { useFormatCurrency } from '@/composable';

import { aggregateData } from '@/components/widgets/helpers';

const loadBalanceData = async ({ from }: { from: Date }) => {
  const result = await getBalanceHistory({ from });

  if (!result?.length) return [];

  return aggregateData(result);
};

export default defineComponent({
  name: 'balance-trend-widget',
  components: {
    Highcharts: Chart,
    Dropdown: defineAsyncComponent(() => import('@/components/common/dropdown.vue')),
  },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const { baseCurrency } = storeToRefs(currenciesStore);
    const balanceHistory = ref<{ amount: number; date: string }[]>([]);
    const currentChartWidth = ref(null);
    const { formatBaseCurrency } = useFormatCurrency();
    const timePeriods = [
      { value: 7, label: '7 days' },
      { value: 30, label: '30 days' },
      { value: 90, label: '90 days' },
    ];
    const isDropdownVisible = ref(false);
    const currentTimePeriod = ref<typeof timePeriods[0]>(timePeriods[0]);

    watchEffect(async () => {
      balanceHistory.value = await loadBalanceData({
        from: subDays(new Date(), currentTimePeriod.value.value),
      });
    });

    const chartOptions = computed(() => ({
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        height: 350,
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
          data: balanceHistory.value.map((point) => [
            new Date(point.date).getTime(),
            fromSystemAmount(point.amount),
          ]),
        },
      ],
      credits: false,
    }));

    const onChartResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      currentChartWidth.value = entry.contentRect.width;
    };

    const selectPeriod = ({ item }) => {
      currentTimePeriod.value = item;
      isDropdownVisible.value = false;
    };

    return {
      balanceHistory,
      formatBaseCurrency,
      chartOptions,
      isDropdownVisible,
      currentTimePeriod,
      timePeriods,
      baseCurrency,
      selectPeriod,
      onChartResize,
    };
  },
});
</script>

<style lang="scss">
.analytics {
  padding: 24px;
}
.analytics__block {
  background-color: var(--app-surface-color);
  padding: 24px;
  border-radius: 12px;
}
.analytics__block-dropdown {
  position: relative;
}
</style>
