/**
 * Not found error.
 *
 * @class
 */
export class NotFoundError extends Error {
  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
