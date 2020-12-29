<template>
  <div class="transactions-list">
    <template
      v-for="item in allTransactions"
      :key="item.id"
    >
      <template v-if="item.type === TRANSACTION_TYPES.system">
        <Transaction :tx="item.tx" />
      </template>
      <template v-else-if="item.type === TRANSACTION_TYPES.monobank">
        <MonoTransaction :tx="item.tx" />
      </template>
    </template>
  </div>
</template>

<script>
import { compareDesc } from 'date-fns';
import { mapActions, mapGetters } from 'vuex';
import { TRANSACTION_TYPES } from '@/js/const';
import {
  indexVuexTypes,
  transactionsVuexTypes,
  bankMonobankVuexTypes,
} from '@/store';
import Transaction from './Transaction';
import MonoTransaction from './MonoTransaction';

export default {
  components: {
    Transaction,
    MonoTransaction,
  },
  data: () => ({
    TRANSACTION_TYPES,
  }),
  computed: {
    ...mapGetters({
      isAppInitialized: indexVuexTypes.GET_APP_INIT_STATUS,
    }),
    ...mapGetters('transactions', {
      transactions: transactionsVuexTypes.GET_TRANSACTIONS,
    }),
    ...mapGetters('bankMonobank', {
      isMonoUserExist: bankMonobankVuexTypes.IS_USER_EXIST,
      monoTransactions: bankMonobankVuexTypes.GET_TRANSACTIONS,
    }),
    allTransactions() {
      return [...this.monoTransactions, ...this.transactions]
        .sort((a, b) => compareDesc(new Date(a.time), new Date(b.time)));
    },
  },
  watch: {
    isAppInitialized(value) {
      if (value) {
        this.fetchTransactions();

        if (this.isMonoUserExist) {
          this.fetchMonoTransactions();
        }
      }
    },
  },
  methods: {
    ...mapActions('transactions', {
      fetchTransactions: transactionsVuexTypes.FETCH_TRANSACTIONS,
    }),
    ...mapActions('bankMonobank', {
      fetchMonoTransactions: bankMonobankVuexTypes.FETCH_TRANSACTIONS,
    }),
  },
};
</script>

<style lang="scss" scoped>
.transactions-list {
  max-width: 560px;
  margin: 60px auto 0;
}
</style>
