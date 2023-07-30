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
import { AccountModel } from 'shared-types';
import { defineComponent, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { ROUTES_NAMES } from '@/routes/constants';
import { useAccountsStore } from '@/stores';
import { eventBus, BUS_EVENTS } from '@/js/utils';
import AccountCard from './account-card.vue';

export default defineComponent({
  components: {
    AccountCard,
  },
  setup() {
    const router = useRouter();
    const accountsStore = useAccountsStore();
    const { enabledAccounts } = storeToRefs(accountsStore);

    eventBus.on(BUS_EVENTS.transactionChange, accountsStore.loadAccounts);

    onBeforeUnmount(() => {
      eventBus.off(BUS_EVENTS.transactionChange, accountsStore.loadAccounts);
    });

    const allAccounts = computed(
      () => [...enabledAccounts.value].sort((a, b) => b.currentBalance - a.currentBalance),
    );

    const redirectToAccount = (account: AccountModel) => {
      router.push({ name: ROUTES_NAMES.account, params: { id: account.id } });
    };

    return {
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
