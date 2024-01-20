import { api } from "@/api/_api";
import {
  CurrencyModel,
  UserExchangeRatesModel,
  UserCurrencyModel,
} from "shared-types";

export const getAllCurrencies = async (): Promise<CurrencyModel[]> =>
  api.get("/models/currencies");

export const loadUserCurrencies = async (): Promise<UserCurrencyModel[]> =>
  api.get("/user/currencies");

export const deleteCustomRate = (
  pairs: {
    baseCode: string;
    quoteCode: string;
  }[],
) => api.delete("/user/currency/rates", { pairs });

export const loadUserCurrenciesExchangeRates = async (): Promise<
  UserExchangeRatesModel[]
> => api.get("/user/currencies/rates");

export const editUserCurrenciesExchangeRates = async (
  pairs: {
    baseCode: string;
    quoteCode: string;
    rate: number;
  }[],
): Promise<UserExchangeRatesModel[]> =>
  api.put("/user/currency/rates", { pairs });

export const deleteUserCurrency = (currencyId: number) =>
  api.delete("/user/currency", { currencyId });

export const setBaseUserCurrency = (currencyId: number) =>
  api.post("/user/currencies/base", { currencyId });

export const addUserCurrencies = async (
  currencies: {
    currencyId: number;
    exchangeRate?: number;
    liveRateUpdate?: boolean;
  }[],
) => api.post("/user/currencies", { currencies });

export const loadUserBaseCurrency = (): Promise<UserCurrencyModel> =>
  api.get("/user/currencies/base");
