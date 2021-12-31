interface Record {
  id?: number;
  amount?: number;
  accountId?: number;
  categoryId?: number;
  paymentTypeId?: number;
  transactionTypeId?: number;
  userId?: number;
  time?: Date;
  note?: string;
}

export class TransactionRecord {
  _record: Record;

  id: number;

  amount: number;

  accountId: number;

  categoryId: number;

  paymentTypeId: number;

  transactionTypeId: number;

  userId: number;

  time: Date;

  note: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.amount = record.amount;
    this.accountId = record.accountId;
    this.categoryId = record.categoryId;
    this.paymentTypeId = record.paymentTypeId;
    this.transactionTypeId = record.transactionTypeId;
    this.userId = record.userId;
    this.time = record.time;
    this.note = record.note;
  }
}
