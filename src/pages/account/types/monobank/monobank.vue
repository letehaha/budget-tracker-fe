<template>
  <div class="mono-account">
    <div class="mono-account__form">
      <input-field
        v-model="editingForm.name"
        label="Account name"
        placeholder="Account name"
        :error-message="getFieldErrorMessage('form.name')"
      />

      <ui-button @click="updateAccount">
        Save
      </ui-button>
    </div>

    <template v-if="account.type === ACCOUNT_TYPES.monobank">
      <LoadLatestTransactions
        class="mono-account__load-latest-tx"
        :account="account"
      />
    </template>

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
import { useFormValidation } from '@/composable';
import { required, minLength } from '@/js/helpers/validators';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';
import UiButton from '@/components/common/ui-button.vue';
import InputField from '@/components/fields/input-field.vue';

import LoadLatestTransactions from './load-latest-transactions.vue';
import LoadTransactions from './load-transactions.vue';

export default defineComponent({
  components: {
    UiButton,
    InputField,
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
    const {
      addNotification,
      addSuccessNotification,
      addErrorNotification,
    } = useNotificationCenter();
    const accountsStore = useAccountsStore();

    const editingForm = reactive<{ name: string }>({
      name: props.account.name,
    });

    const {
      isFormValid,
      getFieldErrorMessage,
    } = useFormValidation(
      { form: editingForm },
      {
        form: {
          name: {
            required,
            minLength: minLength(2),
          },
        },
      },
    );

    const updateAccount = async () => {
      if (!isFormValid()) return;

      try {
        await accountsStore.editAccount({
          id: props.account.id,
          name: editingForm.name,
        });

        addSuccessNotification('Account data changed successfully');
      } catch (e) {
        addErrorNotification('An error occured while trying to update account');
      }
    };

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
      getFieldErrorMessage,
      updateAccount,
      form,
      editingForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.mono-account {
  padding: 24px;
}
.mono-account__form {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: flex-end;
  gap: 16px;
}
.mono-account__visibility {
  color: var(--app-on-surface-color);
  margin: 24px 0;
  display: block;
}
.mono-account__load-latest-tx {
  margin-top: 32px;
}
.mono-account__load-tx {
  margin-top: 48px;
}
</style>
