<template>
  <template v-if="accounts.length || account">
    <template v-if="isTransferTransaction && !isTransactionLinking">
      <form-row>
        <select-field
          label="From account"
          placeholder="Select account"
          :values="accounts"
          label-key="name"
          :disabled="fromAccountDisabled"
          is-value-preselected
          :model-value="account"
          @update:model-value="updateFormAccount"
        />
      </form-row>

      <form-row>
        <select-field
          label="To account"
          placeholder="Select account"
          :values="filteredAccounts"
          label-key="name"
          :disabled="toAccountDisabled"
          :model-value="toAccount"
          @update:model-value="emit('update:to-account', $event)"
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
          :disabled="fromAccountDisabled"
          is-value-preselected
          :model-value="account"
          @update:model-value="updateFormAccount"
        />
      </form-row>
    </template>
  </template>
  <template v-else>
    <form-row>
      <input-field model-value="No account exists" label="Account" readonly>
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

<script setup lang="ts">
import { useRouter } from "vue-router";
import { AccountModel, TRANSACTION_TYPES } from "shared-types";

import { ROUTES_NAMES } from "@/routes";

import SelectField from "@/components/fields/select-field.vue";
import InputField from "@/components/fields/input-field.vue";

import FormRow from "./form-row.vue";

withDefaults(
  defineProps<{
    account?: AccountModel | null;
    toAccount?: AccountModel | null;
    isTransferTransaction: boolean;
    accounts: AccountModel[];
    filteredAccounts: AccountModel[];
    isTransactionLinking: boolean;
    transactionType: TRANSACTION_TYPES;
    fromAccountDisabled?: boolean;
    toAccountDisabled?: boolean;
  }>(),
  {
    account: null,
    toAccount: null,
    isTransactionLinking: false,
    fromAccountDisabled: false,
    toAccountDisabled: false,
  },
);

const emit = defineEmits([
  "close-modal",
  "update:account",
  "update:to-account",
]);

const router = useRouter();

const redirectToCreateAccountPage = async () => {
  await router.push({ name: ROUTES_NAMES.createAccount });

  emit("close-modal");
};

const updateFormAccount = (account: AccountModel) => {
  emit("update:account", account);
};
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
