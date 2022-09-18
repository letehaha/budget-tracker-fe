import { CurrencyRecord } from './currency.record';

interface Record {
  currencyId?: number;
  exchangeRate?: number;
  id?: number;
  isDefaultCurrency?: boolean;
  liveRateUpdate?: boolean;
  code?: string;
  digits?: number;
  number?: number;
  currency?: CurrencyRecord;
}

export class UserCurrencyRecord {
  _record: Record;

  currencyId: number;

  exchangeRate: number;

  id: number;

  isDefaultCurrency: boolean;

  liveRateUpdate: boolean;

  code: string;

  currency: string;

  digits: number;

  number: number;

  constructor(record: Record = {}) {
    this._record = record;

    const currency = new CurrencyRecord(record.currency);

    this.currencyId = record.currencyId;
    this.exchangeRate = record.exchangeRate;
    this.id = record.id;
    this.isDefaultCurrency = record.isDefaultCurrency;
    this.liveRateUpdate = record.liveRateUpdate;
    this.currency = currency.currency;
    this.code = currency.code;
    this.digits = currency.digits;
    this.number = currency.number;
  }
}
