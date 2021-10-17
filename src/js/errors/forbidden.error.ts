import { ApiForbiddenError } from 'shared-types';

/**
 * Forbidden error.
 *
 * @class
 */
export class ForbiddenError extends Error {
  data: ApiForbiddenError;

  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
