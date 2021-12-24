/**
 * Not found error.
 *
 * @class
 */
export class NotFoundError extends Error {
  data;

  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
