export * from './binance-response';

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
