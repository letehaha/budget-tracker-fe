<template>
  <div class="account">
    <template v-if="account">
      <div class="account__form">
        <account-name
          :account="account"
          class="account__field"
        />

        <input-field
          :model-value="account.currentBalance / 100"
          class="account__field"
          label="Balance"
          type="number"
          placeholder="Balance"
          @[MODEL_EVENTS.input]="updateBalance"
        />

        <input-field
          :model-value="account.creditLimit / 100"
          class="account__field"
          label="Credit limit"
          type="number"
          placeholder="Credit limit"
          @[MODEL_EVENTS.input]="updateCreditLimit"
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
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash-es';
import { AccountModel } from 'shared-types';
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

import { ROUTES_NAMES } from '@/routes';
import { useAccountsStore } from '@/stores';
import { toSystemAmount } from '@/js/helpers';

import { useNotificationCenter } from '@/components/notification-center';

import UiButton from '@/components/common/ui-button.vue';
import InputField, { MODEL_EVENTS } from '@/components/fields/input-field.vue';
import AccountName from '@/pages/account/account-name.vue';

export default defineComponent({
  components: {
    UiButton,
    InputField,
    AccountName,
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

    const updateBalance = debounce(
      async (value: string) => {
        await accountsStore.editAccount({
          id: props.account.id,
          currentBalance: toSystemAmount(Number(value)),
        });

        addSuccessNotification('Account balance changed successfully');
      },
      2000,
    );

    const updateCreditLimit = debounce(
      async (value: string) => {
        await accountsStore.editAccount({
          id: props.account.id,
          creditLimit: toSystemAmount(Number(value)),
        });

        addSuccessNotification('Account credit limit changed successfully');
      },
      2000,
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

    return {
      MODEL_EVENTS,
      updateBalance,
      updateCreditLimit,
      deleteAccount,
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
.account__actions {
  margin-top: 64px;
}
</style>
