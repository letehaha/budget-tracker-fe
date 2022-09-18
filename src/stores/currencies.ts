import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import * as apiCurrencies from '@/api/currencies';
import { UserCurrencyRecord } from '@/js/records';

export const useCurrenciesStore = defineStore('currencies', () => {
  const currencies: Ref<UserCurrencyRecord[]> = ref([]);

  const loadCurrencies = async () => {
    const result = await api.get('/user/currencies');

    currencies.value = result.map(item => new UserCurrencyRecord(item));
  };

  const getCurrency = (currencyId: number) => (
    currencies.value.find(currency => currency.currencyId === currencyId)
  );

  const deleteCurrency = async (currencyId: number) => {
    await apiCurrencies.deleteCurrency(currencyId);
  };

  return {
    currencies,
    loadCurrencies,
    getCurrency,
    deleteCurrency,
  };
});
