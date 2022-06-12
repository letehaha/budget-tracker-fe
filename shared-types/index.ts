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

export enum ACCOUNT_TYPES {
  monobank = 'monobank',
  system = 'system',
}

export enum PAYMENT_TYPES {
  bankTransfer = 'bankTransfer',
  voucher = 'voucher',
  webPayment = 'webPayment',
  cash = 'cash',
  mobilePayment = 'mobilePayment',
  creditCard = 'creditCard',
  debitCard = 'debitCard',
}

export enum TRANSACTION_TYPES {
  income = 'income',
  expense = 'expense',
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
