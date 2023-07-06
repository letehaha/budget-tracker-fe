import { ApiForbiddenError, ApiBaseError } from '@/common/types';

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
