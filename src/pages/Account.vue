<template>
  <div class="account">
    <input
      v-model="form.name"
      class="account__name"
      type="text"
      placeholder="No name set..."
    >
    <label>
      Is enabled:
      <input
        v-model="form.isEnabled"
        type="checkbox"
      >
    </label>
    <button @click="loadLatestTransactionsHandler">
      Refresh
    </button>
    <DateField
      v-model="form.period"
      :disable-after="new Date()"
      mode="range"
    />
    <button @click="loadTransactionsForPeriod">
      Load transactions
    </button>
  </div>
</template>

<script lang="ts">
import { ERROR_CODES } from 'shared-types';
import _debounce from 'lodash/debounce';
import {
  defineComponent, reactive, computed, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useBankMonobankStore } from '@/store';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

import DateField from '@/components/fields/DateField.vue';

export default defineComponent({
  components: {
    DateField,
  },
  setup() {
    const route = useRoute();
    const { addNotification } = useNotificationCenter();
    const {
      getMonoAccountById,
      updateMonoAccount,
      loadLatestTransactions,
      loadTxsForPeriod,
    } = useBankMonobankStore();

    const form = reactive({
      name: '',
      isEnabled: false,
      period: null,
    });

    const account = computed(
      () => getMonoAccountById.value(route.query.id as string),
    );

    const loadLatestTransactionsHandler = async () => {
      try {
        const response = await loadLatestTransactions({
          accountId: account.value.accountId,
        });

        addNotification({
          text: response.minutesToFinish >= 1
            ? `Loading started. Estimated loading time is ${response.minutesToFinish} minute(s).`
            : 'Loaded successfully',
          type: NotificationType.success,
        });
      } catch (e) {
        if (e.data.code === ERROR_CODES.forbidden) {
          addNotification({
            text: e.data.message,
            type: NotificationType.error,
          });
        }
      }
    };

    const loadTransactionsForPeriod = async () => {
      if (form.period) {
        const dates = form.period.split(' to ');
        const from = new Date(dates[0]).getTime();
        const to = new Date(dates[1]).getTime();
        await loadTxsForPeriod({
          accountId: account.value.accountId,
          from,
          to,
        });
        addNotification({
          text: 'Loaded successfully',
          type: NotificationType.success,
        });
        form.period = null;
      }
    };

    const debouncedUpdateMonoAccHandler = _debounce(updateMonoAccount, 1000);

    watch(
      () => account.value,
      (value) => {
        if (value) {
          form.name = value.name;
          form.isEnabled = value.isEnabled;
        }
      },
      { immediate: true },
    );

    watch(
      () => form.name,
      (value) => {
        if (value !== account.value.name) {
          debouncedUpdateMonoAccHandler({
            id: account.value.accountId,
            name: value,
          });
        }
      },
    );

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
    );

    return {
      form,
      account,
      loadLatestTransactionsHandler,
      loadTransactionsForPeriod,
    };
  },
});
</script>

<style lang="scss" scoped>
.account {
  padding: 24px;
}
.account__name {
  border: none;
  background-color: transparent;
  font-size: 18px;
  padding: 8px;
  outline: none;
  color: var(--app-on-bg-color);
}
</style>
