interface Record {
  id: number;
  baseId: number;
  quoteId: number;
  rate: number;
  baseCode: string;
  quoteCode: string;
  date: string;
}

export class ExchangeRateRecord {
  _record: Record;

  id: number;

  baseId: number;

  quoteId: number;

  rate: number;

  quoteRate: number;

  baseCode: string;

  quoteCode: string;

  date: string;

  constructor(record: Record) {
    this._record = record;

    this.id = record.id;
    this.baseId = record.baseId;
    this.quoteId = record.quoteId;
    this.rate = record.rate;
    this.quoteRate = Number(Number(1 / record.rate).toFixed(5));
    this.baseCode = record.baseCode;
    this.quoteCode = record.quoteCode;
    this.date = record.date;
  }
}
