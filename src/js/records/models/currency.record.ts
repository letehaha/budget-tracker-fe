interface Record {
  _id?: string;
  currency?: string;
  digits?: number;
  number?: string;
  code?: string;
  countries?: string;
}

export class CurrencyRecord {
  _record: Record;

  id: string;

  currency: string;

  digits: number;

  number: string;

  code: string;

  countries: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record._id;
    this.currency = record.currency;
    this.digits = record.digits;
    this.number = record.number;
    this.code = record.code;
    this.countries = record.countries;
  }
}
