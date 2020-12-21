/**
 * Too many requests error.
 *
 * @class
 */
export class TooManyRequestsError extends Error {
  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
