export { PAGE_TRANSITIONS } from './page-transitions.const';
export { TRANSACTION_TYPES } from './transaction.const';
export { API_ERROR_CODES } from './error-codes.const';

export const MONOBANK_API_TOKEN_LENGTH = 44;

export const isDevEnv = process.env.NODE_ENV === 'development';
export const isProdEnv = process.env.NODE_ENV === 'production';
