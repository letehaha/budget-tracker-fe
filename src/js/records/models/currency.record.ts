interface Record {
  currencyId?: number;
  exchangeRate?: number;
  id?: number;
  isDefaultCurrency?: boolean;
  liveRateUpdate?: boolean;
  currency?: string;
  code?: number;
}

export class CurrencyRecord {
  _record: Record;

  currencyId: number;

  exchangeRate: number;

  id: number;

  isDefaultCurrency: boolean;

  liveRateUpdate: boolean;

  code: number;

  currency: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.currencyId = record.currencyId;
    this.exchangeRate = record.exchangeRate;
    this.id = record.id;
    this.isDefaultCurrency = record.isDefaultCurrency;
    this.liveRateUpdate = record.liveRateUpdate;
    this.currency = record.currency;
    this.code = record.code;
  }
}
