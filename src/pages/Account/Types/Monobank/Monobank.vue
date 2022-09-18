<template>
  <div class="account">
    <div class="mono-account__container">
      <AccountName :account="account" />

      <LoadLatestTransactions :account="account" />
    </div>

    <label class="mono-account__visibility">
      Make this account visible on the Dashboard:
      <input
        v-model="form.isEnabled"
        type="checkbox"
      >
    </label>

    <LoadTransactions
      class="mono-account__load-tx"
      :account="account"
    />
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash-es';
import {
  defineComponent, reactive, computed, watchEffect, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBanksMonobankStore } from '@/stores';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

import AccountName from '@/pages/account/account-name.vue';
import LoadLatestTransactions from './load-latest-transactions.vue';
import LoadTransactions from './load-transactions.vue';

export default defineComponent({
  components: {
    AccountName,
    LoadTransactions,
    LoadLatestTransactions,
  },
  setup() {
    const route = useRoute();
    const { addNotification } = useNotificationCenter();
    const monobankStore = useBanksMonobankStore();

    const { getAccountById } = storeToRefs(monobankStore);

    const form = reactive({
      isEnabled: false,
      period: null,
    });

    const account = computed(
      () => getAccountById.value(route.query.id as string),
    );

    const updateVisibility = async (
      { id, isEnabled }:
      { id: string; isEnabled: boolean },
    ) => {
      await monobankStore.updateAccountById({ id, isEnabled });

      addNotification({
        text: 'Updated successfully',
        type: NotificationType.success,
      });
    };

    const debouncedUpdateMonoAccHandler = debounce(
      updateVisibility,
      1000,
    );

    watchEffect(() => {
      if (account.value) {
        form.isEnabled = account.value.isEnabled;
      }
    });

    watch(
      () => form.isEnabled,
      (value) => {
        if (value !== account.value.isEnabled) {
          debouncedUpdateMonoAccHandler({
            id: account.value.accountId,
            isEnabled: value,
          });
        }
      },
      { immediate: true },
    );

    return {
      form,
      account,
    };
  },
});
</script>

<style lang="scss" scoped>
.account {
  padding: 24px;
}
.mono-account__container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.mono-account__visibility {
  color: var(--app-on-surface-color);
  margin: 24px 0;
  display: block;
}
.mono-account__load-tx {
  margin-top: 48px;
}
</style>
