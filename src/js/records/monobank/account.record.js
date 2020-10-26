export class MONOAccountRecord {
  constructor(record = {}) {
    this._record = record;

    this.balance = record.balance;
    this.cashbackType = record.cashbackType;
    this.creditLimit = record.creditLimit;
    this.currencyCode = record.currencyCode;
    this.iban = record.iban;
    this.id = record.id;
    this.maskedPan = record.maskedPan;
    this.type = record.type;
  }

  get verboseCreditLimit() {
    return this.creditLimit / 100;
  }

  get verboseBalance() {
    return this.balance / 100;
  }
}
