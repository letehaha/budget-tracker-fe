/**
 * Request timeout error.
 *
 * @class
 */
export class TimeoutError extends Error {
  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
