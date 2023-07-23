<template>
  <div class="account">
    <div class="mono-account__container">
      <AccountName :account="account" />

      <template v-if="account.type === ACCOUNT_TYPES.monobank">
        <LoadLatestTransactions :account="account" />
      </template>
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
import { ACCOUNT_TYPES, AccountModel } from 'shared-types';
import { debounce } from 'lodash-es';
import {
  defineComponent, reactive, watchEffect, watch, PropType,
} from 'vue';
import { useAccountsStore } from '@/stores';

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
  props: {
    account: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  },
  setup(props) {
    const { addNotification } = useNotificationCenter();
    const accountsStore = useAccountsStore();

    const form = reactive({
      isEnabled: false,
      period: null,
    });

    const updateVisibility = async (
      { id, isEnabled }:
      { id: number; isEnabled: boolean },
    ) => {
      try {
        await accountsStore.editAccount({ id, isEnabled });

        addNotification({
          text: 'Updated successfully',
          type: NotificationType.success,
        });
      } catch (err) {
        addNotification({
          text: 'Unexpected error',
          type: NotificationType.error,
        });
        form.isEnabled = !form.isEnabled;
      }
    };

    const debouncedUpdateMonoAccHandler = debounce(
      updateVisibility,
      1000,
    );

    watchEffect(() => {
      if (props.account) {
        form.isEnabled = props.account.isEnabled;
      }
    });

    watch(
      () => form.isEnabled,
      (value) => {
        if (value !== props.account.isEnabled) {
          debouncedUpdateMonoAccHandler({
            id: props.account.id,
            isEnabled: value,
          });
        }
      },
      { immediate: true },
    );

    return {
      ACCOUNT_TYPES,
      form,
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
