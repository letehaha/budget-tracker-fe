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

export enum ERROR_CODES {
  // general
  tooManyRequests = 'TOO_MANY_REQUESTS',
  notFound = 'NOT_FOUND',
  unexpected = 'UNEXPECTED',
  validationError = 'VALIDATION_ERROR',
  forbidden = 'FORBIDDEN',

  // auth
  unauthorized = 'UNAUTHENTICATED',
  invalidCredentials = 'INVALID_CREDENTIALS',
  userExists = 'USER_ALREADY_EXISTS',

  // monobank
  monobankUserNotPaired = 'MONOBANK_USER_NOT_PAIRED',
  monobankUserAlreadyConnected = 'MONOBANK_USER_ALREADY_CONNECTED',
  monobankUserNotExist = 'MONOBANK_USER_NOT_EXIST',
  monobankTokenInvalid = 'MONOBANK_USER_TOKEN_INVALID',

  // crypto/binance
  cryptoBinanceBothAPIKeysDoesNotexist = 10101,
  cryptoBinancePublicAPIKeyNotDefined = 10102,
  cryptoBinanceSecretAPIKeyNotDefined = 10103,
}
