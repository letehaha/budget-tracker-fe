import { TRANSACTION_TYPES, PAYMENT_TYPES } from 'shared-types';

interface Record {
  id?: number;
  amount?: number;
  refAmount?: number;
  accountId?: number;
  categoryId?: number;
  paymentType?: PAYMENT_TYPES;
  transactionType?: TRANSACTION_TYPES;
  authorId?: number;
  time?: Date;
  note?: string;
  currencyId?: number;
  currencyCode?: string;
  isTransfer?: boolean;
  refCurrencyCode?: string;
  transferId?: string;
}

export class TransactionRecord {
  _record: Record;

  id: number;

  amount: number;

  refAmount: number;

  accountId: number;

  categoryId: number;

  paymentType: PAYMENT_TYPES;

  transactionType: TRANSACTION_TYPES;

  authorId: number;

  time: Date;

  note: string;

  currencyId: number;

  currencyCode: string;

  refCurrencyCode: string;

  isTransfer: boolean;

  transferId: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.amount = record.amount;
    this.refAmount = record.refAmount;
    this.accountId = record.accountId;
    this.categoryId = record.categoryId;
    this.paymentType = record.paymentType;
    this.transactionType = record.transactionType;
    this.authorId = record.authorId;
    this.time = record.time;
    this.note = record.note;
    this.currencyId = record.currencyId;
    this.currencyCode = record.currencyCode;
    this.refCurrencyCode = record.refCurrencyCode;
    this.isTransfer = record.isTransfer;
    this.transferId = record.transferId;
  }
}
