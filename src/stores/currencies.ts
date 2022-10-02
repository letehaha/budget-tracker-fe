import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { setBaseUserCurrency } from '@/api/currencies';
import { UserCurrencyRecord } from '@/js/records';

export const useCurrenciesStore = defineStore('currencies', () => {
  const currencies = ref<UserCurrencyRecord[]>([]);
  const baseCurrency = ref<UserCurrencyRecord>(null);
  const isBaseCurrencyExists = computed(() => Boolean(baseCurrency.value));

  const loadCurrencies = async () => {
    const result = await api.get('/user/currencies');

    currencies.value = result.map(item => new UserCurrencyRecord(item));
  };

  const getCurrency = (currencyId: number) => (
    currencies.value.find(currency => currency.currencyId === currencyId)
  );

  const loadBaseCurrency = async () => {
    const result: UserCurrencyRecord = await api.get('/user/currencies/base');

    if (result) {
      baseCurrency.value = result;

      if (!currencies.value.find(item => item.id === result.id)) {
        currencies.value.push(result);
      }
    }
  };

  const setBaseCurrency = async (currencyId: number) => {
    const result: UserCurrencyRecord = await setBaseUserCurrency(currencyId);

    if (result) {
      baseCurrency.value = result;
      currencies.value.push(result);
    }
  };

  return {
    currencies,
    baseCurrency,
    isBaseCurrencyExists,
    loadCurrencies,
    loadBaseCurrency,
    setBaseCurrency,
    getCurrency,
  };
});
