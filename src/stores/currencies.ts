import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import {
  getAllCurrencies,
  loadUserCurrencies,
  setBaseUserCurrency,
  loadUserBaseCurrency,
} from '@/api/currencies';
import { CurrencyModel, UserCurrencyModel } from 'shared-types';

export const useCurrenciesStore = defineStore('currencies', () => {
  const systemCurrencies = ref<CurrencyModel[]>([]);
  const currencies = ref<UserCurrencyModel[]>([]);
  const baseCurrency = ref<UserCurrencyModel | null>(null);
  const isBaseCurrencyExists = computed(() => Boolean(baseCurrency.value));

  const systemCurrenciesAssociatedWithUser = computed(
    () => systemCurrencies.value.reduce((acc, curr) => {
      if (currencies.value.find(item => item.currencyId === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, [] as CurrencyModel[]),
  );

  const currenciesMap = computed(
    () => currencies.value.reduce((acc, curr) => {
      acc[curr.currencyId] = curr;
      return acc;
    }, {} as Record<number, UserCurrencyModel>),
  );

  const loadCurrencies = async () => {
    const [userCurrencies, systemOnes] = await Promise.all(
      [loadUserCurrencies(), getAllCurrencies()],
    );

    currencies.value = userCurrencies;
    systemCurrencies.value = systemOnes;
  };

  const getCurrency = (currencyId: number) => (
    currencies.value.find(currency => currency.currencyId === currencyId)
  );

  const loadBaseCurrency = async () => {
    const result = await loadUserBaseCurrency();

    if (result) {
      baseCurrency.value = result;

      if (!currencies.value.find(item => item.id === result.id)) {
        currencies.value.push(result);
      }
    }
  };

  const setBaseCurrency = async (currencyId: number) => {
    const result: UserCurrencyModel = await setBaseUserCurrency(currencyId);

    if (result) {
      baseCurrency.value = result;
      currencies.value.push(result);
    }
  };

  return {
    currencies,
    baseCurrency,
    systemCurrencies,
    currenciesMap,
    systemCurrenciesAssociatedWithUser,
    isBaseCurrencyExists,
    loadCurrencies,
    loadBaseCurrency,
    setBaseCurrency,
    getCurrency,
  };
});
