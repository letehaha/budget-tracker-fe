import { api } from '@/api';
import { CurrencyRecord, UserCurrencyRecord, ExchangeRateRecord } from '@/js/records';

export const getAllCurrencies = async (): Promise<CurrencyRecord[]> => {
  const currencies = await api.get('/models/currencies');

  return currencies.map(item => new CurrencyRecord(item));
};

export const loadUserCurrencies = async () => {
  const result = await api.get('/user/currencies');

  return result.map(item => new UserCurrencyRecord(item));
};

export const loadUserCurrenciesExchangeRates = async () => {
  const result = await api.get('/user/currencies/rates');

  return result.map(item => new ExchangeRateRecord(item));
};

export const editUserCurrenciesExchangeRates = async (
  pairs: {
    baseCode: string;
    quoteCode: string;
    rate: number;
  }[],
) => {
  const result = await api.put('/user/currency/rates', { pairs });

  return result.map(item => new ExchangeRateRecord(item));
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
