<template>
  <label class="account-name">
    <h4 class="account-name__title">
      Account name:
    </h4>

    <InputField
      v-model="form.name"
      class="account-name__field"
      type="text"
      placeholder="No name set..."
    />
  </label>
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
import InputField from '@/components/fields/InputField.vue';

export default defineComponent({
  components: { InputField },
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
  flex-direction: column;
  gap: 4px;
}
.account-name__title {
  color: var(--app-on-surface-color);
}
.account-name__field {
  background-color: transparent;
  font-size: 18px;
  outline: none;
  color: var(--app-on-bg-color);
}
</style>
