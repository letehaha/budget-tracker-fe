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
        <button @click="() => setMonobankToken()">
          Pair account
        </button>
      </template>
      <template v-else-if="isPaired && isTokenPresent">
        <button @click="refreshMonoAccouns">
          Refresh balances
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed, watch, onMounted,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  indexVuexTypes,
  bankMonobankVuexTypes,
} from '@/store';
import { formatAmount } from '@/js/helpers';
import { eventBus } from '@/js/utils';
import { MODAL_TYPES } from '@/components/Modal.vue';
import { ACCOUNT_TYPES } from '@/js/const';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAppInitialized = computed(
      () => store.getters[indexVuexTypes.GET_APP_INIT_STATUS],
    );
    const monoAccounts = computed(() => store.getters[`bankMonobank/${bankMonobankVuexTypes.GET_ACCOUNTS}`]);
    const isPaired = computed(() => store.getters[`bankMonobank/${bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS}`]);
    const isTokenPresent = computed(() => store.getters[`bankMonobank/${bankMonobankVuexTypes.IS_TOKEN_PRESENT}`]);
    const accounts = computed(() => store.getters[`accounts/${bankMonobankVuexTypes.GET_ACCOUNTS}`]);

    watch(
      isAppInitialized,
      (value) => {
        if (value) {
          store.dispatch(`bankMonobank/${bankMonobankVuexTypes.FETCH_ACCOUNTS}`);
        }
      },
      { immediate: true },
    );

    onMounted(async () => {
      if (!isAppInitialized.value) {
        await store.dispatch(indexVuexTypes.FETCH_INITIAL_DATA);
      }
      store.dispatch(`bankMonobank/${bankMonobankVuexTypes.FETCH_ACCOUNTS}`);
    });

    const refreshMonoAccouns = () => {
      store.dispatch(`bankMonobank/${bankMonobankVuexTypes.REFRESH_ACCOUNTS}`);
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
        path: '/account',
        query: { id: account.accountId, type: ACCOUNT_TYPES.mono },
      });
    };

    const formatBalance = account => (
      formatAmount(account.balance - account.creditLimit)
    );

    return {
      setMonobankToken,
      isAppInitialized,
      monoAccounts,
      isPaired,
      isTokenPresent,
      accounts,
      refreshMonoAccouns,
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
</style>
