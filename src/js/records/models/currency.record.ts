interface Record {
  id?: number;
  code?: string;
  currency?: string;
  digits?: number;
  number?: number;
}

export class CurrencyRecord {
  _record: Record;

  id: number;

  code: string;

  currency: string;

  digits: number;

  number: number;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.currency = record.currency;
    this.code = record.code;
    this.digits = record.digits;
    this.number = record.number;
  }
}
