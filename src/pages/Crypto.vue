<template>
  <div class="crypto">
    <h1>Crypto</h1>
    <p>Total: {{ totalBalance }}</p>
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
            <p>{{ balance.price ?? balance.total }}</p>
            <p>{{ formatFiat(getPrice(balance)) }}</p>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { cryptoBinanceVuexTypes } from '@/store';
import { formatFiat } from '@/js/helpers';

export default {
  setup() {
    const store = useStore();
    const binanceNamespace = 'cryptoBinance';

    const balances = computed(() => store.getters[`${binanceNamespace}/${cryptoBinanceVuexTypes.GET_EXISTING_BALANCES}`]);
    const totalBalance = computed(() => formatFiat(store.getters[`${binanceNamespace}/${cryptoBinanceVuexTypes.GET_TOTAL_USD_BALANCE}`]));

    store.dispatch(`${binanceNamespace}/${cryptoBinanceVuexTypes.FETCH_ACCOUNT_DATA}`);

    const getPrice = balance => (
      balance.price ? balance.price * balance.total : balance.total
    );

    return {
      balances,
      totalBalance,
      getPrice,
      formatFiat,
    };
  },
};
</script>

<style lang="scss">
.crypto {
  padding: 24px;
}
.crypto__balance {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
</style>
