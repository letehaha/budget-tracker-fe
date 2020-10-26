export class CurrencyRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record._id;
    this.name = record.name;
    this.asset = record.asset;
    this.code = record.code;
  }
}
