<template>
  <div class="account-create">
    <form class="account-create__form" @submit.prevent="submit">
      <input-field
        v-model="form.name"
        label="Account name"
        placeholder="Account name"
        class="account-create__form-field"
      />

      <select-field
        v-model="form.currency"
        label="Currency"
        :values="systemCurrenciesAssociatedWithUser"
        is-value-preselected
        :label-key="(item: CurrencyModel) => `${item.code} - ${item.currency}`"
        class="account-create__form-field"
      />

      <input-field
        v-model="form.initialBalance"
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
        type="submit"
        class="account-create__form-submit"
        :disabled="isLoading"
      >
        {{ isLoading ? "Creating..." : "Create" }}
      </ui-button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ACCOUNT_TYPES, CurrencyModel } from "shared-types";

import { ROUTES_NAMES } from "@/routes/constants";
import { useAccountsStore, useCurrenciesStore } from "@/stores";

import {
  useNotificationCenter,
  NotificationType,
} from "@/components/notification-center";

import InputField from "@/components/fields/input-field.vue";
import SelectField from "@/components/fields/select-field.vue";
import UiButton from "@/components/common/ui-button.vue";

export default defineComponent({
  name: "create-account",
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

    const { systemCurrenciesAssociatedWithUser } = storeToRefs(currenciesStore);

    const form = reactive<{
      name: string;
      currency: CurrencyModel;
      initialBalance: number;
      creditLimit: number;
    }>({
      name: "",
      currency: systemCurrenciesAssociatedWithUser.value[0],
      initialBalance: 0,
      creditLimit: 0,
    });

    const isLoading = ref(false);

    const submit = async () => {
      try {
        isLoading.value = true;

        await accountsStore.createAccount({
          currencyId: form.currency.id,
          name: form.name,
          creditLimit: form.creditLimit,
          initialBalance: form.initialBalance,
        });

        addNotification({
          text: "Created successfully.",
          type: NotificationType.success,
        });

        router.push({ name: ROUTES_NAMES.accounts });
      } catch (e) {
        addNotification({
          text: "Unexpected error.",
          type: NotificationType.error,
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      ACCOUNT_TYPES,
      form,
      isLoading,
      systemCurrenciesAssociatedWithUser,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.account-create {
  padding: 24px;
}
.account-create__form {
  max-width: 440px;
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
