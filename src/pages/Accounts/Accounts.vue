<template>
  <div class="accounts">
    <h1 class="accounts__title">
      Accounts
    </h1>
    <h2 class="accounts__subtitle">
      System

      <router-link
        :to="{ name: 'create-account' }"
        class="accounts__action-link"
      >
        Create account
      </router-link>
    </h2>
    <template v-if="accounts.length">
      <div class="accounts__list">
        <template
          v-for="account in accounts"
          :key="account.id"
        >
          <router-link
            :to="{
              name: 'account',
              query: { id: account.id, type: ACCOUNT_TYPES.system },
            }"
            class="accounts__item"
          >
            <div class="accounts__item-name">
              {{ account.name }}
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
    <h2 class="accounts__subtitle">
      Monobank

      <template v-if="!isPaired">
        <button
          data-cy="pair-monobank-account"
          @click="() => setMonobankToken()"
        >
          Pair account
        </button>
      </template>
      <template v-else-if="isPaired && isTokenPresent">
        <button @click="refreshMonoAccounts">
          Refresh balances
        </button>
      </template>
      <template v-else-if="isPaired && !isTokenPresent">
        <button @click="setMonobankToken({ isUpdate: true })">
          Update token
        </button>
      </template>
    </h2>
    <template v-if="monoAccounts.length">
      <div class="accounts__list">
        <template
          v-for="account in monoAccounts"
          :key="account.id"
        >
          <router-link
            :to="{
              name: 'account',
              query: { id: account.accountId, type: ACCOUNT_TYPES.monobank },
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
            <div class="accounts__item-code">
              {{ account.maskedPan[0] || account.iban }}
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
        Monobank accounts do not exist.
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import { ACCOUNT_TYPES } from 'shared-types';
import {
  defineComponent, watch, onMounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  useRootStore,
  useBanksMonobankStore,
  useAccountsStore,
} from '@/stores';
import { formatAmount } from '@/js/helpers';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';
import { AccountRecord, MONOAccountRecord } from '@/js/records';

export default defineComponent({
  setup() {
    const rootStore = useRootStore();
    const monobankStore = useBanksMonobankStore();
    const accountsStore = useAccountsStore();

    const { isAppInitialized } = storeToRefs(rootStore);
    const { accounts } = storeToRefs(accountsStore);
    const {
      isMonoAccountPaired: isPaired,
      isTokenPresent,
      sortedAccounts: monoAccounts,
    } = storeToRefs(monobankStore);

    const { addModal } = useModalCenter();

    watch(isAppInitialized, (value) => {
      if (value) {
        monobankStore.loadAccounts();
      }
    });

    onMounted(async () => {
      if (!isAppInitialized.value) {
        await rootStore.fetchInitialData();
      }
      monobankStore.loadAccounts();
    });

    const refreshMonoAccounts = () => {
      monobankStore.refreshAccounts();
    };

    const setMonobankToken = ({ isUpdate = false } = {}) => {
      addModal({
        type: MODAL_TYPES.monobankSetToken,
        data: {
          isUpdate,
        },
      });
    };

    const formatBalance = (account: MONOAccountRecord | AccountRecord) => (
      formatAmount(account.balance - account.creditLimit)
    );

    return {
      ACCOUNT_TYPES,
      setMonobankToken,
      monoAccounts,
      accounts,
      isPaired,
      isTokenPresent,
      refreshMonoAccounts,
      formatBalance,
    };
  },
});
</script>

<style lang="scss" scoped>
.accounts {
  padding: 24px;
}
.accounts__title {
  margin-bottom: 16px;
  color: var(--app-on-bg-color);
}
.accounts__subtitle {
  margin-bottom: 16px;
  color: var(--app-on-bg-color);
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
  margin-left: 16px;
}
.accounts__no-data {
  color: var(--app-on-surface-color);
  margin: 0 0 24px;
}
</style>
