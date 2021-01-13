import { formatAmount } from '@/js/helpers';

export class MONOTransactionRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record.id;
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

  get formattedAmount() {
    return formatAmount(this.amount);
  }

  get formattedCashback() {
    return formatAmount(this.cashbackAmount);
  }
}
