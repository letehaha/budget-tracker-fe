<template>
  <section class="dashboard">
    <AccountsList class="dashboard__accounts" />
    <div class="dashboard__info">
      <div class="dashboard__charts">
        Charts
      </div>
      <div class="dashboard__records">
        <TransactionsList />
        <router-link
          class="dashboard__show-all"
          :to="{ name: 'records' }"
        >
          Show all records
        </router-link>
      </div>
    </div>
    <!-- <div class="dashboard__header">
      <Button @click="updateWebhookHandler">
        Update monobank webhook
      </Button>
    </div> -->
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRootStore, useBanksMonobankStore, useAccountsStore } from '@/stores';
import { TooManyRequestsError } from '@/js/errors';
import { ErrorHandler } from '@/js/utils';

import TransactionsList from './TransactionsList.vue';
import AccountsList from './AccountsList/AccountsList.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    TransactionsList,
    AccountsList,
  },
  setup() {
    const rootStore = useRootStore();
    const monobankStore = useBanksMonobankStore();
    const accountsStore = useAccountsStore();

    const { isAppInitialized } = storeToRefs(rootStore);

    const {
      sortedAccounts: accounts,
      user: monoUser,
    } = storeToRefs(monobankStore);

    onMounted(async () => {
      if (!isAppInitialized.value) {
        await rootStore.fetchInitialData();
      }
      monobankStore.loadAccounts();
      accountsStore.loadAccounts();
    });

    const updateWebhookHandler = async () => {
      try {
        await monobankStore.updateWebhook({
          clientId: monoUser.value.clientId,
        });
      } catch (e) {
        if (e instanceof TooManyRequestsError) {
          ErrorHandler.process(e, e.data.message);
          return;
        }
        ErrorHandler.processWithoutFeedback(e);
      }
    };

    return {
      isAppInitialized,
      accounts,
      monoUser,
      updateWebhookHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 24px;
}
.dashboard__info {
  display: grid;
  grid-template-columns: 1fr 420px;
  margin-top: 24px;
  grid-gap: 24px;
}
.dashboard__records {
  padding: 24px;
  background-color: var(--app-surface-color);
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
.dashboard__charts {
  color: var(--app-on-surface-color);
}
.dashboard__show-all {
  display: block;
  color: var(--primary-500);
  text-align: center;
}
</style>
