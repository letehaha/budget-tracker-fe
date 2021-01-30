export class MONOUserRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record.id;
    this.clientId = record.clientId;
    this.name = record.name;
    this.webHookUrl = record.webHookUrl;
    this.systemUserId = record.systemUserId;
    this.apiToken = record.apiToken;
  }
}
