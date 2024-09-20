<template>
  <div class="account-create">
    <form class="account-create__form" @submit.prevent="submit">
      <input-field
        v-model="form.name"
        label="Account name"
        placeholder="Account name"
        class="account-create__form-field"
      />

      <div class="account-create__form-field">
        <FieldLabel label="Currency">
          <Select.Select v-model="form.currencyId">
            <Select.SelectTrigger>
              <Select.SelectValue placeholder="Select currency" />
            </Select.SelectTrigger>
            <Select.SelectContent>
              <template v-for="item of systemCurrenciesVerbose.linked" :key="item.id">
                <Select.SelectItem :value="String(item.id)">
                  {{ item.code }} - {{ item.currency }}
                </Select.SelectItem>
              </template>

              <AddCurrencyDialog @added="form.currencyId = String($event)">
                <ui-button type="button" class="mt-4 w-full" variant="link">
                  Add new currency +
                </ui-button>
              </AddCurrencyDialog>
            </Select.SelectContent>
          </Select.Select>
        </FieldLabel>
      </div>

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

      <div class="flex">
        <ui-button type="submit" class="ml-auto min-w-[120px]" :disabled="isLoading">
          {{ isLoading ? "Creating..." : "Create" }}
        </ui-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQueryClient } from "@tanstack/vue-query";

import { ROUTES_NAMES } from "@/routes/constants";
import { useAccountsStore, useCurrenciesStore } from "@/stores";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";

import * as Select from "@/components/lib/ui/select";
import { useNotificationCenter, NotificationType } from "@/components/notification-center";
import InputField from "@/components/fields/input-field.vue";
import UiButton from "@/components/lib/ui/button/Button.vue";
import FieldLabel from "@/components/fields/components/field-label.vue";

import AddCurrencyDialog from "@/components/dialogs/add-currency-dialog.vue";

const router = useRouter();
const queryClient = useQueryClient();
const accountsStore = useAccountsStore();
const currenciesStore = useCurrenciesStore();
const { addNotification } = useNotificationCenter();

const { baseCurrency, systemCurrenciesVerbose } = storeToRefs(currenciesStore);

const defaultCurrency = computed(
  () =>
    systemCurrenciesVerbose.value.linked.find((i) => i.id === baseCurrency.value.currencyId).id ||
    0,
);
const form = reactive<{
  name: string;
  currencyId: string;
  initialBalance: number;
  creditLimit: number;
}>({
  name: "",
  currencyId: String(defaultCurrency.value),
  initialBalance: 0,
  creditLimit: 0,
});

const isLoading = ref(false);

const submit = async () => {
  try {
    isLoading.value = true;

    await accountsStore.createAccount({
      currencyId: form.currencyId,
      name: form.name,
      creditLimit: form.creditLimit,
      initialBalance: form.initialBalance,
    });

    addNotification({
      text: "Created successfully.",
      type: NotificationType.success,
    });

    router.push({ name: ROUTES_NAMES.accounts });
    queryClient.invalidateQueries({
      queryKey: VUE_QUERY_CACHE_KEYS.allAccounts,
    });
  } catch (e) {
    addNotification({
      text: "Unexpected error.",
      type: NotificationType.error,
    });
  } finally {
    isLoading.value = false;
  }
};
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
</style>
