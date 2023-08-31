export * from './vue-query';

export const MONOBANK_API_TOKEN_LENGTH = 44;

export const isDevEnv = process.env.NODE_ENV === 'development';
export const isProdEnv = process.env.NODE_ENV === 'production';
