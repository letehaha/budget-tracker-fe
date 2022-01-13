import { CategoryModel, CATEGORY_TYPES } from 'shared-types';

interface Record {
  id?: number;
  name?: string;
  imageUrl?: string;
  color?: string;
  type?: CATEGORY_TYPES;
  parentId?: number;
  userId?: number;
  subCategories?: CategoryModel[];
}

export class CategoryRecord {
  _record: Record;

  id: number;

  name: string;

  imageUrl: string;

  color: string;

  type: CATEGORY_TYPES;

  parentId: number;

  userId: number;

  subCategories: CategoryModel[];

  constructor(record: Record = {}) {
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
