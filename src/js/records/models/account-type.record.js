export class AccountTypeRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record._id;
    this.name = record.name;
  }
}
