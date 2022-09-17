<template>
  <template v-if="accounts.length">
    <template v-if="isTransferTransaction">
      <form-row>
        <SelectField
          label="From account"
          placeholder="Select account"
          :values="accounts"
          label-key="name"
          is-value-preselected
          :model-value="formAccount"
          @update:model-value="emit('update:form-account', $event)"
        />
      </form-row>

      <form-row>
        <SelectField
          label="To account"
          placeholder="Select account"
          :values="filteredAccounts"
          label-key="name"
          :model-value="formToAccount"
          @update:model-value="emit('update:form-to-account', $event)"
        />
      </form-row>
    </template>
    <template v-else>
      <form-row>
        <SelectField
          label="Account"
          placeholder="Select account"
          :values="filteredAccounts"
          label-key="name"
          is-value-preselected
          :model-value="formAccount"
          @update:model-value="emit('update:form-account', $event)"
        />
      </form-row>
    </template>
  </template>
  <template v-else>
    <form-row>
      <InputField
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
      </InputField>
    </form-row>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

import { AccountRecord } from '@/js/records';
import SelectField from '@/components/fields/SelectField.vue';
import InputField from '@/components/fields/InputField.vue';

import FormRow from './form-row.vue';

export default defineComponent({
  components: { InputField, SelectField, FormRow },
  props: {
    formAccount: {
      type: Object as PropType<AccountRecord>,
      default: null,
    },
    formToAccount: {
      type: Object as PropType<AccountRecord>,
      default: null,
    },
    isTransferTransaction: {
      type: Boolean,
      required: true,
    },
    accounts: {
      type: Array as PropType<AccountRecord[]>,
      required: true,
    },
    filteredAccounts: {
      type: Array as PropType<AccountRecord[]>,
      required: true,
    },
  },
  emits: {
    'close-modal': null,
    'update:form-account': function (account: AccountRecord) {
      return account instanceof AccountRecord;
    },
    'update:form-to-account': function (account: AccountRecord) {
      return account instanceof AccountRecord;
    },
  },
  setup(props, { emit }) {
    const router = useRouter();

    const redirectToCreateAccountPage = async () => {
      await router.push({ name: 'create-account' });

      emit('close-modal');
    };

    return {
      emit,
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
