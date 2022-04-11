interface Record {
  id?: number;
  name?: string;
}

export class PaymentTypeRecord {
  _record: Record;

  id: number;

  name: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
  }
}
