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
    <button
      :disabled="isRefreshDisabled"
      @click="loadLatestTransactionsHandler"
    >
      {{ isRefreshDisabled ? 'Loading...' : 'Refresh' }}
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
  defineComponent, reactive, computed, ref, watchEffect,
} from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBanksMonobankStore } from '@/stores';
import { useLocalStorage } from '@/composable';

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
    const { addLSItem, removeLSItem, getLSItem } = useLocalStorage();
    const monobankStore = useBanksMonobankStore();

    const { getAccountById } = storeToRefs(monobankStore);

    const form = reactive({
      name: '',
      isEnabled: false,
      period: null,
    });

    const isRefreshDisabled = ref(false);

    const account = computed(
      () => getAccountById.value(route.query.id as string),
    );
    const accountLSKey = computed(() => `monobank-${account.value.accountId}-txs-loading-end`);

    const setLoadingTimer = (wait: number) => {
      isRefreshDisabled.value = true;

      addLSItem(accountLSKey.value, String(new Date().getTime() + wait));

      setTimeout(() => {
        removeLSItem(accountLSKey.value);

        isRefreshDisabled.value = false;
      }, wait);
    };

    const loadLatestTransactionsHandler = async () => {
      try {
        const response = await monobankStore.loadTransactionsFromLatest({
          accountId: account.value.accountId,
        });

        const isUserNeedToWait = response.minutesToFinish >= 1;

        if (isUserNeedToWait) {
          setLoadingTimer(response.minutesToFinish * 60 * 1000);
        }

        addNotification({
          text: isUserNeedToWait
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
        await monobankStore.loadTransactionsForPeriod({
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

    const debouncedUpdateMonoAccHandler = _debounce(
      monobankStore.updateAccountById,
      1000,
    );

    watchEffect(() => {
      if (account.value) {
        form.name = account.value.name;
        form.isEnabled = account.value.isEnabled;

        const curr = new Date().getTime();
        const timestamp = Number(getLSItem(accountLSKey.value)) || curr;
        if (curr < timestamp) {
          setLoadingTimer(timestamp - curr);
        }
      }
    });

    watchEffect(() => {
      if (account.value) {
        if (form.name !== account.value.name) {
          debouncedUpdateMonoAccHandler({
            id: account.value.accountId,
            name: form.name,
          });
        }

        if (form.isEnabled !== account.value.isEnabled) {
          debouncedUpdateMonoAccHandler({
            id: account.value.accountId,
            isEnabled: form.isEnabled,
          });
        }
      }
    });

    return {
      form,
      account,
      isRefreshDisabled,
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
