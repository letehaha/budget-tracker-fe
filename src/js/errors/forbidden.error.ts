import { ApiForbiddenError, ApiBaseError } from 'shared-types';

/**
 * Forbidden error.
 *
 * @class
 */
export class ForbiddenError extends Error {
  data: ApiForbiddenError;

  constructor(message: string, data: ApiBaseError) {
    super(message);

    this.data = data;
  }
}
