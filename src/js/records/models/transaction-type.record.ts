interface Record {
  id?: number;
  name?: string;
  type?: string;
}

export class TransactionTypeRecord {
  _record: Record;

  id: number;

  name: string;

  type: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
    this.type = record.type;
  }
}
