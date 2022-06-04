import { TRANSACTION_TYPES, PAYMENT_TYPES } from 'shared-types';

interface Record {
  id?: number;
  amount?: number;
  accountId?: number;
  categoryId?: number;
  paymentType?: PAYMENT_TYPES;
  transactionType?: TRANSACTION_TYPES;
  userId?: number;
  time?: Date;
  note?: string;
}

export class TransactionRecord {
  _record: Record;

  id: number;

  amount: number;

  accountId: number;

  categoryId: number;

  paymentType: PAYMENT_TYPES;

  transactionType: TRANSACTION_TYPES;

  userId: number;

  time: Date;

  note: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.amount = record.amount;
    this.accountId = record.accountId;
    this.categoryId = record.categoryId;
    this.paymentType = record.paymentType;
    this.transactionType = record.transactionType;
    this.userId = record.userId;
    this.time = record.time;
    this.note = record.note;
  }
}
