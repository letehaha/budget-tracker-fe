export class PaymentTypeRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
  }
}
