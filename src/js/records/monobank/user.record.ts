interface Record {
  id?: string;
  clientId?: string;
  name?: string;
  webHookUrl?: string
  systemUserId?: number;
  apiToken?: string;
}

export class MONOUserRecord {
  _record: Record;

  id: string;

  clientId: string;

  name: string;

  webHookUrl: string

  systemUserId: number;

  apiToken: string;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.clientId = record.clientId;
    this.name = record.name;
    this.webHookUrl = record.webHookUrl;
    this.systemUserId = record.systemUserId;
    this.apiToken = record.apiToken;
  }
}
