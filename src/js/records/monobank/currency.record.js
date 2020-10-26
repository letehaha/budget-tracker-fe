export class MONOCurrencyRecord {
  constructor(record = {}) {
    this._record = record;

    this.currencyCodeA = record.currencyCodeA;
    this.currencyCodeB = record.currencyCodeB;
    this.date = record.date;
    this.rateBuy = record.rateBuy;
    this.rateSell = record.rateSell;
    this.rateCross = record.rateCross;
  }
}
