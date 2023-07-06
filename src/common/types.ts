import { ACCOUNT_TYPES } from 'shared-types';

export enum API_STATUS_CODES {
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  timeout = 408,
  conflict = 409,
  tooManyRequests = 429,
  internalError = 500
}

export interface ApiBaseError {
  statusText?: string;
  code: number | string;
}

export type ApiBadRequestError = ApiBaseError;
export type ApiUnauthorizedError = ApiBaseError;
export type ApiForbiddenError = ApiBaseError;
export type ApiConflictError = ApiBaseError;
export type ApiNetworkError = ApiBaseError;
export type ApiTimeoutError = ApiBaseError;
export type ApiNotFoundError = ApiBaseError;
export type ApiTooManyRequestsError = ApiBaseError;

export type APIRequestError =
  | ApiBadRequestError
  | ApiUnauthorizedError
  | ApiForbiddenError
  | ApiConflictError
  | ApiNetworkError
  | ApiTimeoutError
  | ApiNotFoundError
  | ApiTooManyRequestsError;

export type UserRecord = {
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

export type AccountRecord = {
  systemType: ACCOUNT_TYPES.system,
  id?: number;
  name?: string;
  currentBalance?: number;
  refCurrentBalance?: number;
  creditLimit?: number;
  refCreditLimit?: number;
  accountTypeId?: number;
  currencyId?: number;
  userId?: number;
}

export type MonobankAccountRecord = {
  systemType: ACCOUNT_TYPES.monobank,
  accountId?: string;
  balance?: number;
  creditLimit?: number;
  cashbackType?: string;
  maskedPan?: string;
  type?: string;
  iban?: string;
  isEnabled?: boolean;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  monoUserId?: number;
  currencyId?: number;
  accountTypeId?: number;
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
