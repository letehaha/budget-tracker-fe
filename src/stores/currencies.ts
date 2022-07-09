import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { CurrencyRecord } from '@/js/records';

export const useCurrenciesStore = defineStore('currencies', () => {
  const currencies: Ref<CurrencyRecord[]> = ref([]);

  const loadCurrencies = async () => {
    const result = await api.get('/user/currencies');

    currencies.value = result.map(item => new CurrencyRecord(item));
  };

  const getCurrency = (currencyId: number) => (
    currencies.value.find(currency => currency.currencyId === currencyId)
  );

  return {
    currencies,
    loadCurrencies,
    getCurrency,
  };
});
