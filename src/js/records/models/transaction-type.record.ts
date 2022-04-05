interface Record {
  id?: number;
  name?: string;
  type?: number;
}

export class TransactionTypeRecord {
  _record: Record;

  id: number;

  name: string;

  type: number;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
    this.type = record.type;
  }
}
