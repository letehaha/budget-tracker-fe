<template>
  <div>
    <p>Total: {{ fiatTotalBalance }}</p>
    <template v-if="balances">
      <div class="crypto__balances">
        <div class="crypto__balance">
          <p>Asset</p>
          <p>Total</p>
          <p>Price</p>
          <p>Holdings</p>
        </div>
        <template
          v-for="balance in balances"
          :key="balance.asset"
        >
          <div class="crypto__balance">
            <p>{{ balance.asset }}</p>
            <p>{{ balance.total }}</p>
            <p>{{ formatFiat(balance.price ?? balance.total) }}</p>
            <p>{{ formatFiat(getPrice(balance)) }}</p>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { formatFiat } from '@/js/helpers';
import { useCryptoBinanceInfo } from '@/composable';

export default defineComponent({
  setup() {
    const { balances, totalBalance } = useCryptoBinanceInfo();

    const fiatTotalBalance = computed(() => formatFiat(totalBalance.value));

    const getPrice = balance => (
      balance.price ? balance.price * balance.total : balance.total
    );

    return {
      balances,
      fiatTotalBalance,
      getPrice,
      formatFiat,
    };
  },
});
</script>
