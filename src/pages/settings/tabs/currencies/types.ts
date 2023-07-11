import { UserCurrencyRecord } from '@/js/records';

export type CurrencyWithExchangeRate = UserCurrencyRecord & {
  rate: number;
  quoteCode: string;
  custom?: boolean;
  quoteRate: number;
}
