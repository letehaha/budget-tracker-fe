interface Record {
  accountId?: string;
  balance?: number;
  creditLimit?: number;
  cashbackType?: string;
  maskedPan?: string;
  type?: string;
  iban?: string;
  isEnabled?: boolean;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  monoUserId?: number;
  currencyId?: number;
  accountTypeId?: number;
}

export class MONOAccountRecord {
  _record: Record

  accountId: string;

  balance: number;

  creditLimit: number;

  cashbackType: string;

  maskedPan: string;

  type: string;

  iban: string;

  isEnabled: boolean;

  name: string;

  createdAt: string;

  updatedAt: string;

  monoUserId: number;

  currencyId: number;

  accountTypeId: number;

  constructor(record: Record = {}) {
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

  get verboseCreditLimit(): number {
    return this.creditLimit / 100;
  }

  get verboseBalance(): number {
    return this.balance / 100;
  }
}
