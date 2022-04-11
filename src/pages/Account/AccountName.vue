<template>
  <div class="account-name">
    <h4 class="account-name__title">
      Account name:
    </h4>
    <input
      v-model="form.name"
      class="account-name__field"
      type="text"
      placeholder="No name set..."
    >
  </div>
</template>

<script lang="ts">
import _debounce from 'lodash/debounce';
import {
  defineComponent, reactive, watchEffect, watch, PropType,
} from 'vue';
import { useBanksMonobankStore } from '@/stores';
import { MONOAccountRecord } from '@/js/records';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

export default defineComponent({
  props: {
    account: {
      type: Object as PropType<MONOAccountRecord>,
      required: true,
    },
  },
  setup(props) {
    const { addNotification } = useNotificationCenter();
    const monobankStore = useBanksMonobankStore();

    const form = reactive({
      name: '',
    });

    const updateAccount = async ({ id, name }) => {
      await monobankStore.updateAccountById({ id, name });

      addNotification({
        text: 'Account name changed successfully',
        type: NotificationType.success,
      });
    };

    const debouncedUpdateMonoAccHandler = _debounce(
      updateAccount,
      2000,
    );

    watchEffect(() => {
      if (props.account) {
        form.name = props.account.name;
      }
    });

    watch(
      () => form.name,
      (value) => {
        if (value !== props.account.name) {
          debouncedUpdateMonoAccHandler({
            id: props.account.accountId,
            name: value,
          });
        }
      },
      { immediate: true },
    );

    return {
      form,
    };
  },
});
</script>

<style lang="scss" scoped>
.account-name {
  display: flex;
  align-items: center;
  gap: 4px;
}
.account-name__title {
  color: var(--app-on-surface-color);
}
.account-name__field {
  border: none;
  background-color: transparent;
  font-size: 18px;
  padding: 8px;
  outline: none;
  color: var(--app-on-bg-color);
}
</style>
