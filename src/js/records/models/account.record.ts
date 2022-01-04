interface Record {
  id?: number;
  name?: string;
  currentBalance?: number;
  creditLimit?: number;
  accountTypeId?: number;
  currencyId?: number;
  userId?: number;
}

export class AccountRecord {
  _record: Record;

  id: number;

  name: string;

  balance: number;

  creditLimit: number;

  accountTypeId: number;

  currencyId: number;

  userId: number;

  constructor(record: Record = {}) {
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
