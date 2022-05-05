export * from './responses';
export * from './api';

export enum RESPONSE_STATUS {
  error = 'error',
  success = 'success',
}

export enum CATEGORY_TYPES {
  internal = 'internal',
  custom = 'custom',
}

export enum TRANSACTIONS_TYPES {
  expense = 2,
  income = 1,
  transfer = 3,
}

export enum ACCOUNT_TYPES {
  mono = 'mono',
  system = 'system',
}

export interface CategoryModel {
  color: string;
  id: number;
  imageUrl: null | string;
  name: string;
  parentId: null | number;
  subCategories: CategoryModel[];
  type: CATEGORY_TYPES;
  userId: number;
}

export enum TRANSACTION_TYPES {
  system = 1,
  monobank = 2,
}

export interface TransactionModel {
  type: TRANSACTION_TYPES;
  tx: unknown;
}

export enum KEYBOARD_CODES {
  plus = 43,
  minus = 45,
  equal = 61,
  keyE = 101,
  enter = 13,
  escape = 27,
  arrowLeft = 37,
  arrowTop = 38,
  arrowRight = 39,
  arrowBottom = 40,
}
