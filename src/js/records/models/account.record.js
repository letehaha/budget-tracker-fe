export class AccountRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record._id;
    this.name = record.name;
    this.currency = record.currency;
    this.currentBalance = record.currentBalance;
    this.type = record.type;
  }
}
