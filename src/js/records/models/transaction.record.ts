import { ACCOUNT_TYPES, TRANSACTION_TYPES, PAYMENT_TYPES } from 'shared-types';

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
  currencyId?: number;
  fromAccountId?: number;
  fromAccountType?: ACCOUNT_TYPES;
  toAccountId?: number;
  toAccountType?: ACCOUNT_TYPES;
  oppositeId?: number;
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

  fromAccountId?: number;

  fromAccountType?: ACCOUNT_TYPES;

  toAccountId?: number;

  toAccountType?: ACCOUNT_TYPES;

  oppositeId?: number;

  currencyId: number;

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
    this.fromAccountId = record.fromAccountId;
    this.fromAccountType = record.fromAccountType;
    this.toAccountId = record.toAccountId;
    this.toAccountType = record.toAccountType;
    this.oppositeId = record.oppositeId;
    this.currencyId = record.currencyId;
  }
}
