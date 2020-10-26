export class CurrencyRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record._id;
    this.currency = record.currency;
    this.digits = record.digits;
    this.number = record.number;
    this.code = record.code;
    this.countries = record.countries;
  }
}
