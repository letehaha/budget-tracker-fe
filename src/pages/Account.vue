<template>
  <div class="account">
    <input
      v-model="form.name"
      class="account__name"
      type="text"
      placeholder="No name set..."
    >
    <label>
      Is enabled:
      <input
        v-model="form.isEnabled"
        type="checkbox"
      >
    </label>
    <button @click="loadLatestTransactionsHandler">
      Refresh
    </button>
    <DateField
      v-model="form.period"
      :disable-after="new Date()"
      mode="range"
    />
    <button @click="loadTransactionsForPeriod">
      Load transactions
    </button>
  </div>
</template>

<script>
import _debounce from 'lodash/debounce';
import { mapActions, mapGetters } from 'vuex';
import { bankMonobankVuexTypes } from '@/store';
import { formatAmount } from '@/js/helpers';
import DateField from '@/components/fields/DateField';

export default {
  components: {
    DateField,
  },
  data() {
    return {
      form: {
        name: '',
        isEnabled: false,
        period: null,
      },
      debouncedUpdateMonoAccHandler: _debounce(this.updateMonoAccount, 1000),
    };
  },
  computed: {
    ...mapGetters('bankMonobank', {
      getMonoAccount: bankMonobankVuexTypes.GET_ACCOUNT_BY_ID,
    }),
    account() {
      return this.getMonoAccount(this.$route.query.id);
    },
  },
  watch: {
    account: {
      immediate: true,
      handler(value) {
        if (value) {
          this.form.name = value.name;
          this.form.isEnabled = value.isEnabled;
        }
      },
    },
    'form.name': function (value) {
      if (value !== this.account.name) {
        this.debouncedUpdateMonoAccHandler({
          id: this.account.accountId,
          name: value,
        });
      }
    },
    'form.isEnabled': function (value) {
      if (value !== this.account.isEnabled) {
        this.debouncedUpdateMonoAccHandler({
          id: this.account.accountId,
          isEnabled: value,
        });
      }
    },
  },
  methods: {
    formatAmount,
    ...mapActions('bankMonobank', {
      fetchAccounts: bankMonobankVuexTypes.FETCH_ACCOUNTS,
      updateMonoAccount: bankMonobankVuexTypes.UPDATE_ACCOUNT_BY_ID,
      loadLatestTransactions:
        bankMonobankVuexTypes.LOAD_TRANSACTIONS_FROM_LATEST,
      loadTxsForPeriod: bankMonobankVuexTypes.LOAD_TRANSACTIONS_FOR_PERIOD,
    }),
    loadLatestTransactionsHandler() {
      this.loadLatestTransactions({ accountId: this.account.accountId });
    },
    async loadTransactionsForPeriod() {
      if (this.form.period) {
        const dates = this.form.period.split(' to ');
        const from = new Date(dates[0]).getTime();
        const to = new Date(dates[1]).getTime();
        await this.loadTxsForPeriod({
          accountId: this.account.accountId,
          from,
          to,
        });
        this.form.period = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  padding: 24px;
}
.account__name {
  border: none;
  background-color: transparent;
  font-size: 18px;
  padding: 8px;
  outline: none;
  color: #333;
}
</style>
