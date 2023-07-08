<template>
  <ui-button
    :disabled="isRefreshDisabled"
    @click="loadLatestTransactionsHandler"
  >
    {{ isRefreshDisabled ? 'Loading...' : 'Load latest transactions' }}
  </ui-button>
</template>

<script lang="ts">
import { API_ERROR_CODES, MonobankAccountModel } from 'shared-types';
import {
  defineComponent, computed, ref, watchEffect, PropType,
} from 'vue';
import { useBanksMonobankStore } from '@/stores';
import { useLocalStorage } from '@/composable';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';
import UiButton from '@/components/common/ui-button.vue';

export default defineComponent({
  components: {
    UiButton,
  },
  props: {
    account: {
      type: Object as PropType<MonobankAccountModel>,
      required: true,
    },
  },
  setup(props) {
    const { addNotification } = useNotificationCenter();
    const { addLSItem, removeLSItem, getLSItem } = useLocalStorage();
    const monobankStore = useBanksMonobankStore();

    const isRefreshDisabled = ref(false);

    const accountLSKey = computed(() => `monobank-${props.account.accountId}-txs-loading-end`);

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
          accountId: props.account.accountId,
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
        if (e.data.code === API_ERROR_CODES.forbidden) {
          addNotification({
            text: e.data.message,
            type: NotificationType.error,
          });
        }
      }
    };

    watchEffect(() => {
      if (props.account) {
        const curr = new Date().getTime();
        const timestamp = Number(getLSItem(accountLSKey.value)) || curr;
        if (curr < timestamp) {
          setLoadingTimer(timestamp - curr);
        }
      }
    });

    return {
      isRefreshDisabled,
      loadLatestTransactionsHandler,
    };
  },
});
</script>
