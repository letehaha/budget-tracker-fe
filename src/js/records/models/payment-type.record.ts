interface Record {
  id?: string;
  name?: string;
}

export class PaymentTypeRecord {
  _record: Record;

  id: string;

  name: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
  }
}
