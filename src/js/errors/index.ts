import { APIRequestError } from 'shared-types';

export * from './network.error';
export * from './timeout.error';
export * from './auth.error';
export * from './to-many-requests.error';
export * from './not-found.error';
export * from './unexpected.error';
export * from './forbidden.error';

export class ApiErrorResponseError extends Error {
  data: APIRequestError;

  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
