import { TRANSACTION_TYPES } from '@/js/const';
import { TransactionRecord } from './models';
import { MONOTransactionRecord } from './monobank';

export class TransactionModelRecord {
  _record: TransactionRecord | MONOTransactionRecord;

  type: number;

  tx: TransactionRecord | MONOTransactionRecord;

  constructor(type: number, record: TransactionRecord | MONOTransactionRecord) {
    this._record = record;

    this.type = type || TRANSACTION_TYPES.system;
    this.tx = record;
  }
}
