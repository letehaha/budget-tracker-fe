export class TransactionTypeRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
    this.type = record.type;
  }
}
