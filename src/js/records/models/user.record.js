export class UserRecord {
  constructor(record = {}) {
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
