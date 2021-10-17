/**
 * Too many requests error.
 *
 * @class
 */
export class UnexpectedError extends Error {
  data;

  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
