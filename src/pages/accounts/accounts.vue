<template>
  <div class="accounts">
    <h1 class="accounts__title">
      Accounts

      <router-link
        :to="{ name: ROUTES_NAMES.createAccount }"
        class="accounts__action-link"
      >
        Create account
      </router-link>

      <template v-if="!isPaired">
        <button
          data-cy="pair-monobank-account"
          type="button"
          @click="() => setMonobankToken()"
        >
          Pair Monobank account
        </button>
      </template>
      <template v-else-if="isPaired && isTokenPresent">
        <button type="button" @click="refreshMonoAccounts">
          Refresh Monobank balances
        </button>
      </template>
      <template v-else-if="isPaired && !isTokenPresent">
        <button type="button" @click="setMonobankToken({ isUpdate: true })">
          Update Monobank token
        </button>
      </template>
    </h1>

    <template v-if="formattedAccounts.length">
      <div class="accounts__list">
        <template
          v-for="account in formattedAccounts"
          :key="account.id"
        >
          <router-link
            :to="{
              name: ROUTES_NAMES.account,
              params: { id: account.id },
            }"
            class="accounts__item"
            :class="{ 'accounts__item--disabled': !account.isEnabled }"
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
            <div class="accounts__item-balance">
              {{ formatBalance(account) }}
            </div>
          </router-link>
        </template>
      </div>
    </template>

    <template v-else>
      <p class="accounts__no-data">
        System accounts do not exist.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { AccountModel } from 'shared-types';

import { ROUTES_NAMES } from '@/routes/constants';
import { useFormatCurrency } from '@/composable';
import { useBanksMonobankStore, useAccountsStore } from '@/stores';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';

const monobankStore = useBanksMonobankStore();
const { accounts } = storeToRefs(useAccountsStore());
const {
  isMonoAccountPaired: isPaired,
  isTokenPresent,
} = storeToRefs(monobankStore);

const { formatAmountByCurrencyId } = useFormatCurrency();
const { addModal } = useModalCenter();

const refreshMonoAccounts = () => {
  monobankStore.refreshAccounts();
};

const formattedAccounts = computed(
  () => [...accounts.value].sort((a, b) => +b.isEnabled - +a.isEnabled),
);

const setMonobankToken = ({ isUpdate = false } = {}) => {
  addModal({
    type: MODAL_TYPES.monobankSetToken,
    data: {
      isUpdate,
    },
  });
};

const formatBalance = (account: AccountModel) => (
  formatAmountByCurrencyId(account.currentBalance - account.creditLimit, account.currencyId)
);
</script>

<style lang="scss" scoped>
.accounts {
  padding: 24px;
}
.accounts__title {
  margin-bottom: 16px;
  color: var(--app-on-bg-color);

  display: flex;
  align-items: center;
  gap: 24px;
}
.accounts__list {
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fit, 240px);
  margin-bottom: 24px;
}
.accounts__item {
  padding: 16px;
  background-color: var(--app-surface-color);
  color: var(--app-on-surface-color);
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
  background-color: var(--app-bg-color);
  padding: 2px 4px;
  font-size: 12px;
  border-radius: 4px;
}
.accounts__action-link {
  @extend %heading-h4;

  color: var(--primary-500);
  text-decoration: underline;
}
.accounts__no-data {
  color: var(--app-on-surface-color);
  margin: 0 0 24px;
}
</style>
