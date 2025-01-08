<template>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
    <Card
      v-for="(currency, index) in currenciesList"
      :key="currency.id"
      class="p-4 flex flex-col gap-4 border rounded-lg shadow-sm transition-all duration-300"
      :class="{ 'border-green-500': activeItemIndex === index }"
      @click="!currency.isDefaultCurrency && toggleActiveItem(index)"
    >
      <div class="gap-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img class="w-5 h-5" :src="getCurrencyIcon(currency.currency.code)" alt="icon" />
            <div class="text-lg font-medium text-white ml-2">
              {{ currency.currency.currency }}
            </div>
          </div>
          <div>
            <div class="text-sm font-bold">
              {{ currency.quoteRate.toLocaleString() }}
              <span class="text-sm">
                {{ currency.currency.code }} / {{ baseCurrency.currency.code }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveDialog v-model:open="isOpen">
        <template #trigger>
          <slot />
        </template>

        <template #title>
          <span> Edit currency </span>
        </template>
        <edit-currency
          :currency="selectedCurrency"
          :deletion-disabled="isDeletionDisabled(selectedCurrency)"
          @delete="onDeleteHandler(activeItemIndex)"
          @submit="onCurrencyEdit"
        />
      </ResponsiveDialog>
    </Card>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { API_ERROR_CODES, UserCurrencyModel } from "shared-types";
import { useCurrenciesStore, useAccountsStore } from "@/stores";
import { deleteUserCurrency, loadUserCurrenciesExchangeRates } from "@/api/currencies";
import { useNotificationCenter } from "@/components/notification-center";
import { Card } from "@/components/lib/ui/card";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { getCurrencyIcon } from "@/js/helpers/currencyImage";
import ResponsiveDialog from "@/components/common/responsive-dialog.vue";
import EditCurrency from "./edit-currency.vue";
import { CurrencyWithExchangeRate } from "./types";

type ActiveItemIndex = number;

const currenciesStore = useCurrenciesStore();
const accountsStore = useAccountsStore();
const { addSuccessNotification, addErrorNotification } = useNotificationCenter();
const { currencies, baseCurrency } = storeToRefs(currenciesStore);
const { accountsCurrencyIds } = storeToRefs(accountsStore);
const queryClient = useQueryClient();

const isOpen = ref(false);

const { data: rates } = useQuery({
  queryKey: VUE_QUERY_CACHE_KEYS.exchangeRates,
  queryFn: loadUserCurrenciesExchangeRates,
  staleTime: Infinity,
  placeholderData: [],
});

const currenciesList = computed<CurrencyWithExchangeRate[]>(() =>
  currencies.value.map((item) => {
    const rate = rates.value.find((i) => i.baseCode === item.currency.code);
    const quoteRate = Number(Number(1 / Number(rate?.rate)).toFixed(4));

    return {
      ...item,
      rate: Number(rate?.rate?.toFixed(4)),
      custom: rate?.custom ?? false,
      quoteCode: rate?.quoteCode,
      quoteRate,
    };
  }),
);

const activeItemIndex = ref<ActiveItemIndex>(null);

const selectedCurrency = ref<CurrencyWithExchangeRate | null>(null);

const toggleActiveItem = (index: ActiveItemIndex) => {
  activeItemIndex.value = activeItemIndex.value === index ? null : index;
  selectedCurrency.value = activeItemIndex.value !== null ? currenciesList.value[index] : null;
  isOpen.value = !!selectedCurrency.value;
};

const onDeleteHandler = async (index: ActiveItemIndex) => {
  try {
    await deleteUserCurrency(currencies.value[index].currencyId);

    activeItemIndex.value = null;

    await currenciesStore.loadCurrencies();

    addSuccessNotification("Successfully deleted.");
  } catch (e) {
    if (e.data.code === API_ERROR_CODES.unauthorized) return;
    if (e.data.code === API_ERROR_CODES.validationError) {
      addErrorNotification(e.data.message);
      return;
    }
    addErrorNotification("Unexpected error. Currency is not deleted.");
  }
};

const onCurrencyEdit = () => {
  toggleActiveItem(null);
  queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.exchangeRates });
};

const isDeletionDisabled = (currency: UserCurrencyModel) =>
  accountsCurrencyIds.value.includes(currency.currencyId);
</script>

<style lang="scss" scoped>
.currencies-list {
  --settings-currency-list-item-padding: 16px 32px;

  padding: 16px 0;
}
.currencies-list__item {
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
}
.currencies-list__row {
  padding: var(--settings-currency-list-item-padding);

  display: grid;
  grid-template-columns: 50px 300px 1fr 50px;
  grid-gap: 16px;

  transition: background-color 0.2s ease-out;

  &:not(.currencies-list__row--header):not(.currencies-list__row--default) {
    cursor: pointer;

    &:hover {
      background-color: var(--app-surface-color-hover);
    }
  }
}
.currencies-list__note {
  opacity: 0.5;
}
.currencies-list__ratios {
  display: flex;
  gap: 24px;
}
</style>
