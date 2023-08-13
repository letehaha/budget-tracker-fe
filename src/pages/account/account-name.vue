<template>
  <label class="account-name">
    <h4 class="account-name__title">
      Account name:
    </h4>

    <input-field
      v-model="form.name"
      class="account-name__field"
      type="text"
      placeholder="No name set..."
    />
  </label>
</template>

<script lang="ts">
import { debounce } from 'lodash-es';
import {
  defineComponent, reactive, watchEffect, watch, PropType,
} from 'vue';
import { AccountModel } from 'shared-types';

import { useAccountsStore } from '@/stores';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';
import InputField from '@/components/fields/input-field.vue';

export default defineComponent({
  components: { InputField },
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
      name: '',
    });

    const updateName = debounce(async ({ id, name }) => {
      if (name) {
        await accountsStore.editAccount({ id, name });

        addNotification({
          text: 'Account name changed successfully',
          type: NotificationType.success,
        });
      }
    }, 2000);

    watchEffect(() => {
      if (props.account) {
        form.name = props.account.name;
      }
    });

    watch(
      () => form.name,
      (value) => {
        if (value !== props.account.name) {
          updateName({ id: props.account.id, name: value });
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
  color: var(--app-on-bg-color);
}
</style>
