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

<script lang="ts">
import { ACCOUNT_TYPES } from 'shared-types';
import { defineComponent, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  useRootStore,
  useAccountsStore,
  useBanksMonobankStore,
} from '@/stores';
import { AccountRecord, MONOAccountRecord } from '@/js/records';
import Account from './Account.vue';

export default defineComponent({
  components: {
    Account,
  },
  setup() {
    const router = useRouter();
    const rootStore = useRootStore();
    const accountsStore = useAccountsStore();
    const monobankStore = useBanksMonobankStore();
    const { activeAccounts: monoAccounts } = storeToRefs(monobankStore);
    const { accounts } = storeToRefs(accountsStore);
    const { isAppInitialized } = storeToRefs(rootStore);

    watch(
      isAppInitialized,
      (value) => {
        if (value) {
          monobankStore.loadAccounts();
        }
      },
      { immediate: true },
    );

    const allAccounts = computed(
      () => [...monoAccounts.value, ...accounts.value],
    );

    const redirectToAccount = (account: AccountRecord | MONOAccountRecord) => {
      let query = {};

      if (account instanceof AccountRecord) {
        query = { id: account.id, type: ACCOUNT_TYPES.system };
      } else if (account instanceof MONOAccountRecord) {
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
