<template>
  <Card class="currencies-list">
    <div class="currencies-list__row currencies-list__row--header">
      <div class="currencies-list__column" />
      <div class="currencies-list__column">Name</div>
      <div class="currencies-list__column">Currency rate per {{ baseCurrency.currency.code }}</div>
    </div>
    <template v-for="(currency, index) in currenciesList" :key="currency.id">
      <div class="currencies-list__item">
        <div
          class="currencies-list__row"
          :class="{
            'currencies-list__row--default': currency.isDefaultCurrency,
          }"
          @click="!currency.isDefaultCurrency && toggleActiveItem(index)"
        >
          <div class="currencies-list__column">
            {{ currency.currency.code }}
          </div>
          <div class="currencies-list__column">
            {{ currency.currency.currency }}
          </div>
          <div class="currencies-list__column">
            <template v-if="currency.isDefaultCurrency">
              <span class="currencies-list__note"> This is your base currency </span>
            </template>
            <template v-else>
              <div class="currencies-list__ratios">
                <span>
                  {{ currency.quoteCode }} 1 = {{ currency.currency.code }}
                  {{ currency.quoteRate }}
                </span>
                <span>
                  {{ currency.currency.code }} 1 = {{ currency.quoteCode }}
                  {{ currency.rate }}
                </span>
              </div>
            </template>
          </div>
        </div>

        <template v-if="activeItemIndex === index">
          <edit-currency
            :currency="currency"
            :deletion-disabled="isDeletionDisabled(currency)"
            @delete="onDeleteHandler(index)"
            @submit="onCurrencyEdit"
          />
        </template>
      </div>
    </template>
  </Card>
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
import EditCurrency from "./edit-currency.vue";
import { CurrencyWithExchangeRate } from "./types";

type ActiveItemIndex = number;

const currenciesStore = useCurrenciesStore();
const accountsStore = useAccountsStore();
const { addSuccessNotification, addErrorNotification } = useNotificationCenter();
const { currencies, baseCurrency } = storeToRefs(currenciesStore);
const { accountsCurrencyIds } = storeToRefs(accountsStore);
const queryClient = useQueryClient();

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

const toggleActiveItem = (index: ActiveItemIndex) => {
  activeItemIndex.value = activeItemIndex.value === index ? null : index;
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
