/**
 * Request timeout error.
 *
 * @class
 */
export class TimeoutError extends Error {
  data;

  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
