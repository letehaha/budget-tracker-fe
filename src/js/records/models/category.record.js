export class CategoryRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record.id;
    this.name = record.name;
    this.imageUrl = record.imageUrl;
    this.color = record.color;
    this.type = record.type;
    this.parentId = record.parentId;
    this.userId = record.userId;
    this.subCategories = record.subCategories.map(i => new CategoryRecord(i));
  }
}
