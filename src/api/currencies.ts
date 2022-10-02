import { api } from '@/api';
import { CurrencyRecord } from '@/js/records';

export const getAllCurrencies = async (): Promise<CurrencyRecord[]> => {
  const currencies = await api.get('/models/currencies');

  return currencies.map(item => new CurrencyRecord(item));
};

export const deleteUserCurrency = (currencyId: number) => (
  api.delete('/user/currency', { currencyId })
);

export const setBaseUserCurrency = (currencyId: number) => (
  api.post('/user/currencies/base', { currencyId })
);

export const addUserCurrencies = async (
  currencies: {
    currencyId: number,
    exchangeRate?: number;
    liveRateUpdate?: boolean;
  }[],
) => (
  api.post('/user/currencies', { currencies })
);
