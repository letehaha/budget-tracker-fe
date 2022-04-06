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

    <load-latest-tranactions :account="account" />

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
import _debounce from 'lodash/debounce';
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

import DateField from '@/components/fields/DateField.vue';

import LoadLatestTranactions from './LoadLatestTranactions.vue';

export default defineComponent({
  components: {
    DateField,
    LoadLatestTranactions,
  },
  setup() {
    const route = useRoute();
    const { addNotification } = useNotificationCenter();
    const monobankStore = useBanksMonobankStore();

    const { getAccountById } = storeToRefs(monobankStore);

    const form = reactive({
      name: '',
      isEnabled: false,
      period: null,
    });

    const account = computed(
      () => getAccountById.value(route.query.id as string),
    );

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
      }
    });

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
      { immediate: true },
    );
    watch(
      () => form.isEnabled,
      (value) => {
        if (value !== account.value.isEnabled) {
          debouncedUpdateMonoAccHandler({
            id: account.value.accountId,
            name: value,
          });
        }
      },
      { immediate: true },
    );

    return {
      form,
      account,
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
