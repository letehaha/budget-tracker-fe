<template>
  <div class="accounts">
    <h1 class="accounts__title">
      Accounts
    </h1>
    <h2 class="accounts__subtitle">
      System

      <router-link
        class="accounts__action-link"
        :to="{
          name: 'create-account',
        }"
        tag="h4"
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
          <div class="accounts__item">
            <div class="accounts__item-name">
              {{ account.name }}
            </div>
          </div>
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
        <button @click="() => setMonobankToken()">
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
    <template v-if="!monoAccounts.length">
      <div class="accounts__list">
        <template
          v-for="account in monoAccounts"
          :key="account.id"
        >
          <div
            class="accounts__item"
            :class="{ 'accounts__item--disabled': !account.isEnabled }"
            @click="redirectToAccount(account)"
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
          </div>
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
import {
  defineComponent, watch, onMounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import {
  useRootStore,
  useBanksMonobankStore,
  useAccountsStore,
} from '@/stores';
import { formatAmount } from '@/js/helpers';
import { eventBus } from '@/js/utils';
import { MODAL_TYPES } from '@/components/Modal.vue';
import { ACCOUNT_TYPES } from '@/js/const';

export default defineComponent({
  setup() {
    const router = useRouter();
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

    watch(
      isAppInitialized,
      (value) => {
        if (value) {
          monobankStore.loadAccounts();
        }
      },
      { immediate: true },
    );

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
      eventBus.emit(eventBus.eventsList.modalOpen, {
        type: MODAL_TYPES.monobankSetToken,
        data: {
          isUpdate,
        },
      });
    };

    const redirectToAccount = account => {
      router.push({
        name: 'account',
        query: { id: account.accountId, type: ACCOUNT_TYPES.mono },
      });
    };

    const formatBalance = account => (
      formatAmount(account.balance - account.creditLimit)
    );

    return {
      setMonobankToken,
      monoAccounts,
      accounts,
      isPaired,
      isTokenPresent,
      refreshMonoAccounts,
      formatBalance,
      redirectToAccount,
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
