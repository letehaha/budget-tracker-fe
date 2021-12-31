import { formatAmount } from '@/js/helpers';

interface Record {
  id?: number;
  originalId?: number;
  description?: string;
  amount?: number;
  time?: Date;
  operationAmount?: number;
  commissionRate?: number;
  cashbackAmount?: number;
  balance?: number;
  hold?: number;
  userId?: number;
  categoryId?: number;
  transactionTypeId?: number;
  paymentTypeId?: number;
  monoAccountId?: number;
  transactionEntityId?: number;
  note?: string;
}

export class MONOTransactionRecord {
  _record: Record;

  id: number;

  originalId: number;

  description: string;

  amount: number;

  time: Date;

  operationAmount: number;

  commissionRate: number;

  cashbackAmount: number;

  balance: number;

  hold: number;

  userId: number;

  categoryId: number;

  transactionTypeId: number;

  paymentTypeId: number;

  monoAccountId: number;

  transactionEntityId: number;

  note: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.originalId = record.originalId;
    this.description = record.description;
    this.amount = record.amount;
    this.time = record.time;
    this.operationAmount = record.operationAmount;
    this.commissionRate = record.commissionRate;
    this.cashbackAmount = record.cashbackAmount;
    this.balance = record.balance;
    this.hold = record.hold;
    this.userId = record.userId;
    this.categoryId = record.categoryId;
    this.transactionTypeId = record.transactionTypeId;
    this.paymentTypeId = record.paymentTypeId;
    this.monoAccountId = record.monoAccountId;
    this.transactionEntityId = record.transactionEntityId;
    this.note = record.note;
  }

  get formattedAmount(): string {
    return formatAmount(this.amount);
  }

  get formattedCashback(): string {
    return formatAmount(this.cashbackAmount);
  }
}
