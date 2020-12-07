export class CategoryRecord {
  constructor(record = {}) {
    this._record = record;

    this.id = record._id;
    this.name = record.name;
    this.subcategories = (record.subcategories || [])
      .map(sub => new CategoryRecord(sub));
  }
}
