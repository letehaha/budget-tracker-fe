<template>
  <div class="account-create">
    <form
      class="account-create__form"
      @submit.prevent="submit"
    >
      <input-field
        v-model="form.name"
        label="Account name"
        placeholder="Account name"
        class="account-create__form-field"
      />

      <select-field
        v-model="form.currency"
        label="Currency"
        :values="formattedCurrencies"
        is-value-preselected
        class="account-create__form-field"
      />

      <!-- <select-field
        v-model="form.accountType"
        label="Account type"
        :values="ACCOUNT_TYPES"
        label-key="name"
        is-value-preselected
        class="account-create__form-field"
      /> -->

      <input-field
        v-model="form.currentBalance"
        label="Initial balance"
        placeholder="Initial balance"
        class="account-create__form-field"
      />

      <input-field
        v-model="form.creditLimit"
        label="Credit limit"
        placeholder="Credit limit"
        class="account-create__form-field"
      />

      <ui-button
        :type="BUTTON_TYPES.submit"
        class="account-create__form-submit"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Creating...' : 'Create' }}
      </ui-button>
    </form>
  </div>
</template>

<script lang="ts">
import { ACCOUNT_TYPES } from 'shared-types';
import {
  defineComponent, reactive, computed, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAccountsStore, useCurrenciesStore } from '@/stores';

import { toSystemAmount } from '@/js/helpers';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

import InputField from '@/components/fields/input-field.vue';
import SelectField from '@/components/fields/select-field.vue';
import UiButton, { BUTTON_TYPES } from '@/components/common/ui-button.vue';

export default defineComponent({
  name: 'create-account',
  components: {
    UiButton,
    InputField,
    SelectField,
  },
  setup() {
    const router = useRouter();
    const accountsStore = useAccountsStore();
    const currenciesStore = useCurrenciesStore();
    const { addNotification } = useNotificationCenter();

    const { currencies } = storeToRefs(currenciesStore);

    const formattedCurrencies = computed(
      () => currencies.value.map(currency => ({
        ...currency,
        label: `${currency.currency} (${currency.code})`,
      })),
    );

    const form = reactive({
      name: '',
      currency: null,
      accountType: 1,
      currentBalance: 0,
      creditLimit: 0,
    });

    const isLoading = ref(false);

    const submit = async () => {
      try {
        isLoading.value = true;

        await accountsStore.createAccount({
          currencyId: form.currency.id,
          accountTypeId: form.accountType,
          name: form.name,
          creditLimit: toSystemAmount(Number(form.creditLimit)),
          currentBalance: toSystemAmount(Number(form.currentBalance)),
        });

        addNotification({
          text: 'Created successfully.',
          type: NotificationType.success,
        });

        router.push({ name: 'accounts' });
      } catch (e) {
        addNotification({
          text: 'Unexpected error.',
          type: NotificationType.error,
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      ACCOUNT_TYPES,
      BUTTON_TYPES,
      form,
      isLoading,
      formattedCurrencies,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.account-create {
  padding: 24px;
}
.account-create__form-field {
  &:not(:last-child) {
    margin-bottom: 24px;
  }
}
.account-create__form-submit {
  margin-left: auto;
}
</style>
