<template>
  <div class="accounts-list">
    <template
      v-for="account in allAccounts"
      :key="account.id"
    >
      <Account
        :account="account"
        @click="redirectToAccount(account)"
      />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ACCOUNT_TYPES } from '@/js/const';
import {
  indexVuexTypes,
  bankMonobankVuexTypes,
  accountsVuexTypes,
} from '@/store';
import Account from './Account';

export default {
  components: {
    Account,
  },
  computed: {
    ...mapGetters({
      isAppInitialized: indexVuexTypes.GET_APP_INIT_STATUS,
    }),
    ...mapGetters('bankMonobank', {
      monoAccounts: bankMonobankVuexTypes.GET_ACTIVE_ACCOUNTS,
    }),
    ...mapGetters('accounts', {
      accounts: accountsVuexTypes.GET_ACCOUNTS,
    }),
    allAccounts() {
      return [...this.monoAccounts, ...this.accounts];
    },
  },
  watch: {
    isAppInitialized: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchAccounts();
        }
      },
    },
  },
  methods: {
    ...mapActions('bankMonobank', {
      fetchAccounts: bankMonobankVuexTypes.FETCH_ACCOUNTS,
    }),
    redirectToAccount(account) {
      this.$router.push({ path: '/account', query: { id: account.accountId, type: ACCOUNT_TYPES.mono } });
    },
  },
};
</script>

<style lang="scss" scoped>
.accounts-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, 180px);
  grid-gap: 8px;
}
</style>
