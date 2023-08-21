<template>
  <template v-if="accounts.length">
    <template v-if="isTransferTransaction">
      <form-row>
        <select-field
          label="From account"
          placeholder="Select account"
          :values="accounts"
          label-key="name"
          :disabled="disabled"
          is-value-preselected
          :model-value="formAccount"
          @update:model-value="updateFormAccount"
        />
      </form-row>

      <form-row>
        <select-field
          label="To account"
          placeholder="Select account"
          :values="filteredAccounts"
          label-key="name"
          :disabled="disabled"
          :model-value="formToAccount"
          @update:model-value="emit('update:form-to-account', $event)"
        />
      </form-row>
    </template>
    <template v-else>
      <form-row>
        <select-field
          label="Account"
          placeholder="Select account"
          :values="accounts"
          label-key="name"
          :disabled="disabled"
          is-value-preselected
          :model-value="formAccount"
          @update:model-value="updateFormAccount"
        />
      </form-row>
    </template>
  </template>
  <template v-else>
    <form-row>
      <input-field
        model-value="No account exists"
        label="Account"
        readonly
      >
        <template #label-right>
          <div
            class="account-field__create-account"
            @click="redirectToCreateAccountPage"
          >
            Create account
          </div>
        </template>
      </input-field>
    </form-row>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { AccountModel } from 'shared-types';

import { ROUTES_NAMES } from '@/routes';

import SelectField from '@/components/fields/select-field.vue';
import InputField from '@/components/fields/input-field.vue';

import FormRow from './form-row.vue';

export default defineComponent({
  components: {
    InputField,
    SelectField,
    FormRow,
  },
  props: {
    formAccount: {
      type: Object as PropType<AccountModel>,
      default: null,
    },
    formToAccount: {
      type: Object as PropType<AccountModel>,
      default: null,
    },
    isTransferTransaction: {
      type: Boolean,
      required: true,
    },
    accounts: {
      type: Array as PropType<AccountModel[]>,
      required: true,
    },
    filteredAccounts: {
      type: Array as PropType<AccountModel[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close-modal', 'update:form-account', 'update:form-to-account'],
  setup(props, { emit }) {
    const router = useRouter();

    const redirectToCreateAccountPage = async () => {
      await router.push({ name: ROUTES_NAMES.createAccount });

      emit('close-modal');
    };

    const updateFormAccount = (account: AccountModel) => {
      emit('update:form-account', account);
    };

    return {
      emit,
      updateFormAccount,
      redirectToCreateAccountPage,
    };
  },
});
</script>

<style lang="scss" scoped>
.account-field__create-account {
  color: var(--primary-500);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
