export class TransactionRecord {
  constructor(record = {}) {
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
