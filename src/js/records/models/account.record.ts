interface Record {
  id?: number;
  name?: string;
  currentBalance?: number;
  refCurrentBalance?: number;
  creditLimit?: number;
  refCreditLimit?: number;
  accountTypeId?: number;
  currencyId?: number;
  userId?: number;
}

export class AccountRecord {
  _record: Record;

  id: number;

  name: string;

  balance: number;

  refBalance: number;

  creditLimit: number;

  refCreditLimit: number;

  accountTypeId: number;

  currencyId: number;

  userId: number;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
    this.balance = record.currentBalance;
    this.refBalance = record.refCurrentBalance;
    this.creditLimit = record.creditLimit;
    this.refCreditLimit = record.refCreditLimit;
    this.accountTypeId = record.accountTypeId;
    this.currencyId = record.currencyId;
    this.userId = record.userId;
  }
}
