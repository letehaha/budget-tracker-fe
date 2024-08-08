<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useQueryClient } from "@tanstack/vue-query";

import { useAccountsStore, useCurrenciesStore } from "@/stores";
import { ACCOUNT_CATEGORIES_VERBOSE, VUE_QUERY_CACHE_KEYS } from "@/common/const";

import * as Select from "@/components/lib/ui/select";
import { useNotificationCenter, NotificationType } from "@/components/notification-center";
import InputField from "@/components/fields/input-field.vue";
import UiButton from "@/components/lib/ui/button/Button.vue";
import FieldLabel from "@/components/fields/components/field-label.vue";

import AddCurrencyDialog from "@/components/dialogs/add-currency-dialog.vue";
import { ACCOUNT_CATEGORIES } from "shared-types";

const emit = defineEmits(["created"]);

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
const accountCategories = Object.entries(ACCOUNT_CATEGORIES_VERBOSE).map(
  (entry: [keyof typeof ACCOUNT_CATEGORIES_VERBOSE, string]) => ({
    value: entry[0],
    label: entry[1],
  }),
);
const form = reactive<{
  name: string;
  currencyId: string;
  initialBalance: number;
  creditLimit: number;
  accountCategory: ACCOUNT_CATEGORIES;
}>({
  name: "",
  currencyId: String(defaultCurrency.value),
  initialBalance: 0,
  creditLimit: 0,
  accountCategory: ACCOUNT_CATEGORIES.creditCard,
});

const isLoading = ref(false);

const submit = async () => {
  try {
    isLoading.value = true;

    await accountsStore.createAccount({
      currencyId: Number(form.currencyId),
      name: form.name,
      creditLimit: form.creditLimit,
      initialBalance: form.initialBalance,
      accountCategory: form.accountCategory,
    });

    addNotification({
      text: "Created successfully.",
      type: NotificationType.success,
    });

    queryClient.invalidateQueries({
      queryKey: VUE_QUERY_CACHE_KEYS.allAccounts,
    });

    emit("created");
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

<template>
  <form class="grid gap-6" @submit.prevent="submit">
    <input-field v-model="form.name" label="Account name" placeholder="Account name" />

    <div>
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
    />

    <input-field v-model="form.creditLimit" label="Credit limit" placeholder="Credit limit" />

    <FieldLabel label="Account type">
      <Select.Select v-model="form.accountCategory">
        <Select.SelectTrigger>
          <Select.SelectValue placeholder="Select account type" />
        </Select.SelectTrigger>
        <Select.SelectContent>
          <template v-for="item of accountCategories" :key="item.id">
            <Select.SelectItem :value="item.value">
              {{ item.label }}
            </Select.SelectItem>
          </template>
        </Select.SelectContent>
      </Select.Select>
    </FieldLabel>

    <div class="flex">
      <ui-button type="submit" class="ml-auto min-w-[120px]" :disabled="isLoading">
        {{ isLoading ? "Creating..." : "Create" }}
      </ui-button>
    </div>
  </form>
</template>
