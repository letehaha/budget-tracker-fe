<template>
  <div class="account">
    <AccountName
      :account="account"
      class="account__field"
    />

    <InputField
      :model-value="account.balance / 100"
      class="account__field"
      label="Balance"
      type="number"
      placeholder="Balance"
      @[MODEL_EVENTS.input]="updateBalance"
    />

    <InputField
      :model-value="account.creditLimit / 100"
      class="account__field"
      label="Credit limit"
      type="number"
      placeholder="Credit limit"
      @[MODEL_EVENTS.input]="updateCreditLimit"
    />
  </div>
</template>

<script lang="ts">
import _debounce from 'lodash/debounce';
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAccountsStore } from '@/stores';

import { useNotificationCenter } from '@/components/notification-center';

import InputField, { MODEL_EVENTS } from '@/components/fields/InputField.vue';
import AccountName from '@/pages/Account/AccountName.vue';

export default defineComponent({
  components: {
    AccountName,
    InputField,
  },
  setup() {
    const route = useRoute();
    const { addSuccessNotification } = useNotificationCenter();
    const accountsStore = useAccountsStore();

    const { getAccountById } = storeToRefs(accountsStore);

    const account = computed(
      () => getAccountById.value(Number(route.query.id)),
    );

    const updateBalance = _debounce(
      async (value: string) => {
        const balance = Number((Number(value) * 100).toFixed(0));

        await accountsStore.editAccount({
          id: account.value.id,
          currentBalance: balance,
        });

        addSuccessNotification('Account balance changed successfully');
      },
      2000,
    );

    const updateCreditLimit = _debounce(
      async (value: string) => {
        const creditLimit = Number((Number(value) * 100).toFixed(0));

        await accountsStore.editAccount({
          id: account.value.id,
          creditLimit,
        });

        addSuccessNotification('Account credit limit changed successfully');
      },
      2000,
    );

    return {
      MODEL_EVENTS,
      account,
      updateBalance,
      updateCreditLimit,
    };
  },
});
</script>

<style lang="scss" scoped>
.account {
  padding: 24px;
}
.account__field {
  &:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
