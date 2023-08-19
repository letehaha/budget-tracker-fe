import { storeToRefs } from 'pinia';
import { formatUIAmount } from '@/js/helpers';
import { useCurrenciesStore } from '@/stores';

export const useFormatCurrency = () => {
  const { baseCurrency } = storeToRefs(useCurrenciesStore());

  const formatBaseCurrency = (amount) => formatUIAmount(amount, {
    currency: baseCurrency.value.currency.code,
  });

  return {
    formatBaseCurrency,
  };
};
