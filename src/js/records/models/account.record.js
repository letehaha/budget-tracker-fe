export class AccountRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
    this.balance = record.currentBalance;
    this.creditLimit = record.creditLimit;
    this.accountTypeId = record.accountTypeId;
    this.currencyId = record.currencyId;
    this.userId = record.userId;
  }
}
