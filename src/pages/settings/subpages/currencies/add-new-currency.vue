<template>
  <div class="flex gap-4 p-4 mb-8 add-new-currency">
    <div class="flex-shrink-0 w-full max-w-[300px]">
      <select-field
        v-model="selectedCurrency"
        :values="filteredCurrencies"
        :placeholder="isCurrenciesLoading ? 'Loading...' : 'Select currency'"
        with-search-field
        :disabled="!filteredCurrencies.length"
        :label-key="(item: CurrencyModel) => `${item.code} - ${item.currency}`"
      />
    </div>
    <Button
      :disabled="!selectedCurrency || isCurrenciesLoading"
      class="w-[100px]"
      @click="addCurrency"
    >
      Add
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { CurrencyModel } from "shared-types";
import { useCurrenciesStore } from "@/stores";
import { addUserCurrencies } from "@/api/currencies";
import { useNotificationCenter } from "@/components/notification-center";
import { SelectField } from "@/components/fields";
import { Button } from "@/components/lib/ui/button";

const currenciesStore = useCurrenciesStore();
const { addErrorNotification } = useNotificationCenter();
const { currencies: userCurrencies, systemCurrencies } =
  storeToRefs(currenciesStore);

const isCurrenciesLoading = ref(false);
const selectedCurrency = ref<CurrencyModel>(null);
const filteredCurrencies = computed(() =>
  systemCurrencies.value.filter(
    (item) =>
      !userCurrencies.value.some((el) => el.currency.code === item.code),
  ),
);

const addCurrency = async () => {
  try {
    isCurrenciesLoading.value = true;

    await addUserCurrencies([
      {
        // TODO: add more options
        currencyId: selectedCurrency.value.id,
      },
    ]);

    await currenciesStore.loadCurrencies();
  } catch (e) {
    addErrorNotification("Unexpected error. Currency is not added.");
  } finally {
    isCurrenciesLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.add-new-currency {
  @include surface-container();
}
</style>
