export class TransactionRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record._id;
    this.account = record.account;
    this.amount = record.amount;
    this.category = record.category;
    this.paymentType = record.paymentType;
    this.time = record.time;
    this.note = record.note;
    this.type = record.type;
  }
}
