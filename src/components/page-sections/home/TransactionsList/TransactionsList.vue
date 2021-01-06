<template>
  <div class="transactions-list">
    <template
      v-for="item in allTransactions"
      :key="item?.tx.id"
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
import { indexVuexTypes, transactionsVuexTypes } from '@/store';
import Transaction from './SystemTransaction';
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
    allTransactions() {
      const data = [...this.transactions]
        .sort((a, b) => compareDesc(new Date(a.time), new Date(b.time)));

      return data.slice(0, 8);
    },
  },
  watch: {
    isAppInitialized: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchTransactions({ limit: 8 });
        }
      },
    },
  },
  methods: {
    ...mapActions('transactions', {
      fetchTransactions: transactionsVuexTypes.FETCH_TRANSACTIONS,
    }),
  },
};
</script>
