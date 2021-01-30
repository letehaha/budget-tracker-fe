<template>
  <div class="accounts">
    <h1 class="accounts__title">
      Accounts
    </h1>
    <h2 class="accounts__subtitle">
      System
    </h2>
    <div class="accounts__list">
      <template
        v-for="account in accounts"
        :key="account.id"
      >
        <div class="accounts__item">
          <div class="accounts__item-name">
            {{ account.name }}
          </div>
        </div>
      </template>
    </div>
    <h2 class="accounts__subtitle">
      Monobank
      <template v-if="!isPaired">
        <button @click="setMonobankToken">
          Pair account
        </button>
      </template>
      <template v-else-if="isPaired && isTokenPresent">
        <button @click="refreshMonoAccouns">
          Refresh
        </button>
      </template>
      <template v-else-if="isPaired && !isTokenPresent">
        <button @click="setMonobankToken({ isUpdate: true })">
          Update token
        </button>
      </template>
    </h2>
    <div class="accounts__list">
      <template
        v-for="account in monoAccounts"
        :key="account.id"
      >
        <div
          class="accounts__item"
          :class="{ 'accounts__item--disabled': !account.isEnabled }"
          @click="$router.push({ path: '/account', query: { id: account.accountId, type: 'mono' } })"
        >
          <div
            v-if="!account.isEnabled"
            class="accounts__state"
          >
            Disabled
          </div>
          <div class="accounts__item-name">
            {{ account.name || 'No name set...' }}
          </div>
          <div class="accounts__item-code">
            {{ account.maskedPan[0] || account.iban }}
          </div>
          <div class="accounts__item-balance">
            {{ formatAmount(account.balance) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  indexVuexTypes,
  bankMonobankVuexTypes,
  accountsVuexTypes,
} from '@/store';
import { formatAmount } from '@/js/helpers';
import { MODAL_TYPES } from '@/components/Modal';

export default {
  computed: {
    ...mapGetters({
      isAppInitialized: indexVuexTypes.GET_APP_INIT_STATUS,
    }),
    ...mapGetters('bankMonobank', {
      monoAccounts: bankMonobankVuexTypes.GET_ACCOUNTS,
      isPaired: bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS,
      isTokenPresent: bankMonobankVuexTypes.IS_TOKEN_PRESENT,
    }),
    ...mapGetters('accounts', {
      accounts: accountsVuexTypes.GET_ACCOUNTS,
    }),
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
  async mounted() {
    if (!this.isAppInitialized) {
      await this.fetchInitialData();
    }
    this.fetchAccounts();
  },
  methods: {
    formatAmount,
    ...mapActions({
      fetchInitialData: indexVuexTypes.FETCH_INITIAL_DATA,
    }),
    ...mapActions('bankMonobank', {
      fetchAccounts: bankMonobankVuexTypes.FETCH_ACCOUNTS,
      refreshMonoAccouns: bankMonobankVuexTypes.REFRESH_ACCOUNTS,
    }),
    setMonobankToken({ isUpdate }) {
      this.$bus.emit(this.$bus.eventsList.modalOpen, {
        type: MODAL_TYPES.monobankSetToken,
        data: {
          isUpdate,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.accounts {
  padding: 24px;
}
.accounts__title {
  margin-bottom: 16px;
}
.accounts__subtitle {
  margin-bottom: 16px;
}
.accounts__list {
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fit, 240px);
}
.accounts__item {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
  transition: box-shadow .2s ease-out;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.15);
  }
}
.accounts__item--disabled {
  opacity: 0.5;
}
.accounts__item-name {
  font-size: 18px;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: calc(100% - 60px);
}
.accounts__item-code {
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 10px;
}
.accounts__state {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ccc;
  padding: 2px 4px;
  font-size: 12px;
  border-radius: 4px;
}
</style>
