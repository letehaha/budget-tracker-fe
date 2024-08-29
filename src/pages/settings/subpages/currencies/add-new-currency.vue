<template>
  <Card class="mb-8">
    <CardContent class="pt-6 flex gap-4">
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

      <template v-if="userCurrencies.length === 1">
        <Tooltip.TooltipProvider>
          <Tooltip.Tooltip>
            <Tooltip.TooltipTrigger class="flex items-center gap-2">
              <InfoIcon class="size-6" />
              How it works?
            </Tooltip.TooltipTrigger>
            <Tooltip.TooltipContent class="max-w-[400px] p-4">
              <span class="text-sm opacity-90 leading-6">
                By adding custom currencies, you can create and manage accounts and transactions in
                those currencies. You’ll also be able to adjust and update their exchange rates
                relative to your base currency. Linked accounts will automatically create required
                currencies.
              </span>
            </Tooltip.TooltipContent>
          </Tooltip.Tooltip>
        </Tooltip.TooltipProvider>
      </template>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { CurrencyModel } from "shared-types";
import { InfoIcon } from "lucide-vue-next";
import { useCurrenciesStore } from "@/stores";
import { addUserCurrencies } from "@/api/currencies";
import { useNotificationCenter } from "@/components/notification-center";
import { SelectField } from "@/components/fields";
import { Button } from "@/components/lib/ui/button";
import { Card, CardContent } from "@/components/lib/ui/card";
import * as Tooltip from "@/components/lib/ui/tooltip";

const currenciesStore = useCurrenciesStore();
const { addErrorNotification } = useNotificationCenter();
const { currencies: userCurrencies, systemCurrencies } = storeToRefs(currenciesStore);

const isCurrenciesLoading = ref(false);
const selectedCurrency = ref<CurrencyModel>(null);
const filteredCurrencies = computed(() =>
  systemCurrencies.value.filter(
    (item) => !userCurrencies.value.some((el) => el.currency.code === item.code),
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
