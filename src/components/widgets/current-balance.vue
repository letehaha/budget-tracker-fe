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

const loadBalanceData = async () => {
  const loadDataForDays = 30;
  const result = await getBalanceHistory({
    from: subDays(new Date(), loadDataForDays),
  });

  const interpolatedData: { date: string; amount: number }[] = [];

  let lastValue: number | null = null;
  const mostLatestValue = result.at(-1).amount;

  for (let i = 0; i < loadDataForDays; i++) {
    const currentDateObj = new Date();
    currentDateObj.setDate(currentDateObj.getDate() - i);

    const dateString = currentDateObj.toISOString().split('T')[0];
    const existingDataPoint = result.find(({ date }) => date === dateString);

    if (existingDataPoint) {
      interpolatedData.unshift(existingDataPoint);
      lastValue = existingDataPoint.amount;
    } else {
      interpolatedData.unshift({
        date: dateString,
        amount: lastValue ?? mostLatestValue,
      });
    }
  }

  return interpolatedData;
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
          (point) => [new Date(point.date).getTime(), point.amount],
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
