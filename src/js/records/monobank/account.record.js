export class MONOAccountRecord {
  constructor(record = {}) {
    this._record = record;

    this.accountId = record.accountId;
    this.balance = record.balance;
    this.creditLimit = record.creditLimit;
    this.cashbackType = record.cashbackType;
    this.maskedPan = JSON.parse(record.maskedPan);
    this.type = record.type;
    this.iban = record.iban;
    this.isEnabled = record.isEnabled;
    this.name = record.name || `${record.type.toUpperCase()} ${record.cashbackType}`;
    this.createdAt = record.createdAt;
    this.updatedAt = record.updatedAt;
    this.monoUserId = record.monoUserId;
    this.currencyId = record.currencyId;
    this.accountTypeId = record.accountTypeId;
  }

  get verboseCreditLimit() {
    return this.creditLimit / 100;
  }

  get verboseBalance() {
    return this.balance / 100;
  }
}
