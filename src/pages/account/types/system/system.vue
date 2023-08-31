<template>
  <div class="account">
    <template v-if="account">
      <div class="account__form">
        <input-field
          v-model="form.name"
          label="Account name"
          placeholder="Account name"
          :error-message="getFieldErrorMessage('form.name')"
        />

        <input-field
          v-model="form.currentBalance"
          label="Balance"
          type="number"
          placeholder="Balance"
          :error-message="getFieldErrorMessage('form.currentBalance')"
        />

        <input-field
          v-model="form.creditLimit"
          label="Credit limit"
          type="number"
          placeholder="Credit limit"
          :error-message="getFieldErrorMessage('form.creditLimit')"
        />
      </div>
    </template>

    <div class="account__actions">
      <ui-button
        class="account__delete-action"
        @click="deleteAccount"
      >
        Delete
      </ui-button>
      <ui-button
        class="account__delete-action"
        @click="updateAccount"
      >
        Save
      </ui-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AccountModel } from 'shared-types';

import { ROUTES_NAMES } from '@/routes';
import { useAccountsStore } from '@/stores';
import { useFormValidation } from '@/composable';
import {
  required, minLength, decimal, minValue,
} from '@/js/helpers/validators';

import { useNotificationCenter } from '@/components/notification-center';

import UiButton from '@/components/common/ui-button.vue';
import InputField from '@/components/fields/input-field.vue';

export default defineComponent({
  components: {
    UiButton,
    InputField,
  },
  props: {
    account: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const {
      addSuccessNotification,
      addErrorNotification,
    } = useNotificationCenter();
    const accountsStore = useAccountsStore();

    const form = reactive<{
      name: string;
      currentBalance: number;
      creditLimit: number;
    }>({
      name: props.account.name,
      currentBalance: props.account.currentBalance,
      creditLimit: props.account.creditLimit,
    });

    const {
      isFormValid,
      getFieldErrorMessage,
    } = useFormValidation(
      { form },
      {
        form: {
          name: {
            required,
            minLength: minLength(2),
          },
          currentBalance: {
            required,
            decimal,
          },
          creditLimit: {
            required,
            decimal,
            minValue: minValue(0),
          },
        },
      },
    );

    const deleteAccount = async () => {
      const accountName = props.account.name;

      try {
        await accountsStore.deleteAccount({
          id: props.account.id,
        });

        addSuccessNotification(`Account ${accountName} removed successfully`);

        router.push({ name: ROUTES_NAMES.accounts });
      } catch (e) {
        addErrorNotification('An error occured while trying to delete account');
      }
    };

    const updateAccount = async () => {
      if (!isFormValid()) return;

      try {
        await accountsStore.editAccount({
          id: props.account.id,
          name: form.name,
          creditLimit: form.creditLimit,
          currentBalance: form.currentBalance,
        });

        addSuccessNotification('Account data changed successfully');
      } catch (e) {
        addErrorNotification('An error occured while trying to update account');
      }
    };

    return {
      deleteAccount,
      updateAccount,
      getFieldErrorMessage,
      form,
    };
  },
});
</script>

<style lang="scss" scoped>
.account {
  padding: 24px;
}
.account__form {
  display: grid;
  gap: 24px;
}
.account__actions {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
}
</style>
