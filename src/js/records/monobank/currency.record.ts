interface Record {
  currencyCodeA?: string;
  currencyCodeB?: string;
  date?: Date;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
}

export class MONOUserCurrencyRecord {
  _record: Record;

  currencyCodeA?: string;

  currencyCodeB?: string;

  date?: Date;

  rateBuy?: number;

  rateSell?: number;

  rateCross?: number;

  constructor(record: Record = {}) {
    this._record = record;

    this.currencyCodeA = record.currencyCodeA;
    this.currencyCodeB = record.currencyCodeB;
    this.date = record.date;
    this.rateBuy = record.rateBuy;
    this.rateSell = record.rateSell;
    this.rateCross = record.rateCross;
  }
}
