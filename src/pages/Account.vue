<template>
  <div class="account">
    <input
      v-model="name"
      class="account__name"
      type="text"
      placeholder="No name set..."
    >
    <label>
      Is enabled:
      <input
        v-model="isEnabled"
        type="checkbox"
      >
    </label>
    <button @click="loadLatestTransactionsHandler">
      Refresh
    </button>
  </div>
</template>

<script>
import _debounce from 'lodash/debounce';
import { mapActions, mapGetters } from 'vuex';
import { bankMonobankVuexTypes } from '@/store';
import { formatAmount } from '@/js/helpers';

export default {
  data: () => ({
    name: '',
    isEnabled: false,
    debouncedUpdateMonoAccHandler: () => {},
  }),
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
          this.name = value.name;
          this.isEnabled = value.isEnabled;
        }
      },
    },
    name(value) {
      if (value !== this.account.name) {
        this.debouncedUpdateMonoAccHandler({
          id: this.account.accountId,
          name: value,
        });
      }
    },
    isEnabled(value) {
      if (value !== this.account.isEnabled) {
        this.debouncedUpdateMonoAccHandler({
          id: this.account.accountId,
          isEnabled: value,
        });
      }
    },
  },
  mounted() {
    this.debouncedUpdateMonoAccHandler = _debounce(
      this.updateMonoAccount,
      1000,
    );
  },
  methods: {
    formatAmount,
    ...mapActions('bankMonobank', {
      fetchAccounts: bankMonobankVuexTypes.FETCH_ACCOUNTS,
      updateMonoAccount: bankMonobankVuexTypes.UPDATE_BY_ID,
      loadLatestTransactions:
        bankMonobankVuexTypes.LOAD_TRANSACTIONS_FROM_LATEST,
    }),
    loadLatestTransactionsHandler() {
      this.loadLatestTransactions({ accountId: this.account.accountId });
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
