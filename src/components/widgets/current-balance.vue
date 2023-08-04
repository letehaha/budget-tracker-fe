<template>
  <div class="current-balance-widget">
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
      },
      title: {
        text: null,
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'Amount',
        },
      },
      series: [{
        showInLegend: false,
        data: balanceHistory.value.map(
          (point) => [new Date(point.date).getTime(), fromSystemAmount(point.amount)],
        ),
      }],
      credits: false,
      plotOptions: {
        area: {
          dataLabels: {
            enabled: false, // Disable data labels
          },
        },
      },
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

</style>
