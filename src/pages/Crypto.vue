<template>
  <div class="crypto">
    <h1>Crypto</h1>
    <template v-if="balances">
      <div class="crypto__balances">
        <div class="crypto__balance">
          <p>Asset</p>
          <p>Free</p>
          <p>Locked</p>
          <p>Total</p>
        </div>
        <template
          v-for="balance in balances"
          :key="balance.asset"
        >
          <div class="crypto__balance">
            <p>{{ balance.asset }}</p>
            <p>{{ balance.free }}</p>
            <p>{{ balance.locked }}</p>
            <p>{{ balance.total }}</p>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { cryptoBinanceVuexTypes } from '@/store';

export default {
  computed: {
    ...mapGetters('cryptoBinance', {
      balances: cryptoBinanceVuexTypes.GET_EXISTING_BALANCES,
    }),
  },
  created() {
    this.fetchCryptoBalances();
  },
  methods: {
    ...mapActions('cryptoBinance', {
      fetchCryptoBalances: cryptoBinanceVuexTypes.FETCH_ACCOUNT_DATA,
    }),
  },
};
</script>

<style lang="scss">
.crypto {
  padding: 24px;
}
.crypto__balance {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
</style>
