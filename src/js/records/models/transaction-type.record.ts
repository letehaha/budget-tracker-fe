import { TRANSACTIONS_TYPES } from 'shared-types';

interface Record {
  id?: number;
  name?: string;
  type?: TRANSACTIONS_TYPES;
}

export class TransactionTypeRecord {
  _record: Record;

  id: number;

  name: string;

  type: TRANSACTIONS_TYPES;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
    this.type = record.type;
  }
}
