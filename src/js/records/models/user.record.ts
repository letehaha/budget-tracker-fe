interface Record {
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  avatar?: string;
  totalBalance?: number;
  defaultCategoryId?: number;
}

export class UserRecord {
  _record: Record;

  id: number;

  username: string;

  email: string;

  firstName: string;

  lastName: string;

  middleName: string;

  avatar: string;

  totalBalance: number;

  defaultCategoryId: number;

  constructor(record: Record = {}) {
    this._record = record;

    this.id = record.id;
    this.username = record.username;
    this.email = record.email;
    this.firstName = record.firstName;
    this.lastName = record.lastName;
    this.middleName = record.middleName;
    this.avatar = record.avatar;
    this.totalBalance = record.totalBalance;
    this.defaultCategoryId = record.defaultCategoryId;
  }
}
