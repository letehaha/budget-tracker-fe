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
      <ui-button @click="updateWebhookHandler">
        Update monobank webhook
      </ui-button>
    </div> -->
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useBanksMonobankStore } from '@/stores';
import { TooManyRequestsError } from '@/js/errors';
import { ErrorHandler } from '@/js/utils';

import TransactionsList from './transactions-list.vue';
import AccountsList from './accounts-list/accounts-list.vue';

export default defineComponent({
  name: 'dashboard',
  components: {
    TransactionsList,
    AccountsList,
  },
  setup() {
    const monobankStore = useBanksMonobankStore();

    const {
      sortedAccounts: accounts,
      user: monoUser,
    } = storeToRefs(monobankStore);

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