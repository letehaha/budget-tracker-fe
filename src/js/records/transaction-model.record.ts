import { TRANSACTION_TYPES } from '@/js/const';

export class TransactionModelRecord {
  _record: Record<string, unknown>;

  type: number;

  tx: Record<string, unknown>;

  constructor(type: number, record = {}) {
    this._record = record;

    this.type = type || TRANSACTION_TYPES.system;
    this.tx = record;
  }
}
