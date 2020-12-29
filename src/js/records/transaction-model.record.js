import { TRANSACTION_TYPES } from '@/js/const';

export class TransactionModelRecord {
  constructor(type, record = {}) {
    this._record = record;

    this.type = type || TRANSACTION_TYPES.system;
    this.tx = record;
  }
}
