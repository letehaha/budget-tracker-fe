<template>
  <div class="accounts-list">
    <template
      v-for="account in allAccounts"
      :key="account.id"
    >
      <account-card
        :account="account"
        @click="redirectToAccount(account)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { ACCOUNT_TYPES, AccountModel, MonobankAccountModel } from 'shared-types';
import { defineComponent, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  useAccountsStore,
  useBanksMonobankStore,
} from '@/stores';
import { getBalanceFromAccount } from '@/js/helpers';
import { eventBus, BUS_EVENTS } from '@/js/utils';
import AccountCard from './account-card.vue';

export default defineComponent({
  components: {
    AccountCard,
  },
  setup() {
    const router = useRouter();
    const accountsStore = useAccountsStore();
    const monobankStore = useBanksMonobankStore();
    const { activeAccounts: monoAccounts } = storeToRefs(monobankStore);
    const { accounts } = storeToRefs(accountsStore);

    eventBus.on(BUS_EVENTS.transactionChange, accountsStore.loadAccounts);

    onBeforeUnmount(() => {
      eventBus.off(BUS_EVENTS.transactionChange, accountsStore.loadAccounts);
    });

    const allAccounts = computed(
      () => [...monoAccounts.value, ...accounts.value]
        .sort((a, b) => getBalanceFromAccount(b) - getBalanceFromAccount(a)),
    );

    const redirectToAccount = (account: AccountModel | MonobankAccountModel) => {
      let query = {};

      if (account.systemType === ACCOUNT_TYPES.system) {
        query = { id: account.id, type: ACCOUNT_TYPES.system };
      } else if (account.systemType === ACCOUNT_TYPES.monobank) {
        query = { id: account.accountId, type: ACCOUNT_TYPES.monobank };
      }

      router.push({ name: 'account', query });
    };

    return {
      accounts,
      allAccounts,
      redirectToAccount,
    };
  },
});
</script>

<style lang="scss" scoped>
.accounts-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, 180px);
  grid-gap: 8px;
}
</style>
