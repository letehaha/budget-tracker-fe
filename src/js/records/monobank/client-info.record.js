import { MONOAccountRecord } from './account.record';

export class MONOClientInfoRecord {
  constructor(record = {}) {
    this._record = record;

    this.accounts = record.accounts.map(item => new MONOAccountRecord(item));
    this.clientId = record.clientId;
    this.name = record.name;
    this.webHookUrl = record.webHookUrl;
  }
}
