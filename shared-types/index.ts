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
  expense = 'expense',
  income = 'income',
  transfer = 'transfer',
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
